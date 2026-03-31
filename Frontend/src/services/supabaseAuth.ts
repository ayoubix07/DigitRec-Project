import { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

type NormalizedError = {
  code?: string;
  details?: string;
  hint?: string;
  message: string;
  status?: number;
};

type ServiceResult<T> = {
  data: T | null;
  error: NormalizedError | null;
};

type CompanyRegistrationPayload = {
  companyName: string;
  email: string;
  logoFile: File | null;
  password: string;
};

type ResolvedProfile = {
  accountType: "candidate" | "company" | "unknown";
  authUser: User;
  displayName: string;
  profile: Record<string, unknown> | null;
  source: string | null;
};

type RegistrationUploadResult = {
  path: string | null;
  warning: string | null;
};

function normalizeError(error: unknown): NormalizedError {
  if (typeof error === "string") {
    return { message: error };
  }

  if (error && typeof error === "object") {
    const issue = error as {
      code?: string;
      details?: string;
      hint?: string;
      message?: string;
      status?: number;
    };

    return {
      code: issue.code,
      details: issue.details,
      hint: issue.hint,
      message: issue.message || "Request failed.",
      status: issue.status,
    };
  }

  return { message: "Request failed." };
}

async function run<T>(task: () => Promise<T>): Promise<ServiceResult<T>> {
  try {
    const data = await task();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: normalizeError(error) };
  }
}

function getBucketName() {
  const env = import.meta.env as unknown as Record<string, string | undefined>;
  return env.VITE_SUPABASE_LOGO_BUCKET ?? env.VITE_TEST_SUPABASE_LOGO_BUCKET ?? "company-logos";
}

function buildStoragePath(folder: string, file: File) {
  const safeBaseName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const uniqueId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `${folder}/${safeBaseName || "file"}-${uniqueId}.${extension}`;
}

async function uploadCompanyLogo(file: File, email: string) {
  const bucket = getBucketName();
  const ownerFolder = email.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const path = buildStoragePath(`company-logos/${ownerFolder}`, file);

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message || "File upload failed.");
  }

  return path;
}

async function uploadCompanyLogoSafely(
  file: File | null,
  email: string
): Promise<RegistrationUploadResult> {
  if (!file) {
    return { path: null, warning: null };
  }

  try {
    const path = await uploadCompanyLogo(file, email);
    return { path, warning: null };
  } catch (error) {
    const issue = normalizeError(error);
    return {
      path: null,
      warning: `L'envoi du logo a été ignoré : ${issue.message}`,
    };
  }
}

function getDisplayName(
  accountType: "candidate" | "company" | "unknown",
  authUser: User,
  profile: Record<string, unknown> | null
) {
  if (accountType === "candidate") {
    const firstName =
      (profile?.prenom as string | undefined) ?? authUser.user_metadata?.prenom;
    const lastName =
      (profile?.nom as string | undefined) ?? authUser.user_metadata?.nom;
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
    return fullName || "Compte candidat";
  }

  if (accountType === "company") {
    return (
      (profile?.nom as string | undefined) ??
      authUser.user_metadata?.company_name ??
      "Compte entreprise"
    );
  }

  return authUser.email || "Compte utilisateur";
}

async function insertProfile(payload: Record<string, unknown>, failureMessage: string) {
  const { data, error } = await supabase.from("entreprises").insert(payload).select().single();

  if (error) {
    throw new Error(error.message || failureMessage);
  }

  return data;
}

async function fetchLatestProfile(
  table: "candidats" | "entreprises",
  column: string,
  value: string
) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq(column, value)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Record<string, unknown> | null;
}

export function getSession() {
  return run(async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;
    return session;
  });
}

export function signInWithPassword(email: string, password: string) {
  return run(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) throw error;
    return data;
  });
}

export function signOut() {
  return run(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  });
}

export function registerCompany(payload: CompanyRegistrationPayload) {
  return run(async () => {
    const email = payload.email.trim().toLowerCase();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: payload.password,
      options: {
        data: {
          user_type: "company",
          company_name: payload.companyName.trim(),
        },
      },
    });

    if (authError) throw authError;

    const uploadResult = await uploadCompanyLogoSafely(payload.logoFile, email);

    const profile = await insertProfile(
      {
        nom: payload.companyName.trim(),
        email_prof: email,
        logo_url: uploadResult.path,
      },
      "La création du profil entreprise a échoué."
    );

    return {
      accountType: "company",
      auth: authData,
      profile,
      uploadWarning: uploadResult.warning,
    };
  });
}

export function resolveCurrentProfile() {
  return run<ResolvedProfile>(async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    if (!user) throw new Error("Aucun utilisateur connecté n'a été trouvé.");

    const preferredType = user.user_metadata?.user_type as
      | "candidate"
      | "company"
      | undefined;
    const email = user.email;

    if (!email) {
      return {
        accountType: preferredType || "unknown",
        authUser: user,
        displayName: getDisplayName(preferredType || "unknown", user, null),
        profile: null,
        source: null,
      };
    }

    if (preferredType === "candidate") {
      const profile = await fetchLatestProfile("candidats", "email", email);
      return {
        accountType: "candidate",
        authUser: user,
        displayName: getDisplayName("candidate", user, profile),
        profile,
        source: "public.candidats",
      };
    }

    if (preferredType === "company") {
      const profile = await fetchLatestProfile("entreprises", "email_prof", email);
      return {
        accountType: "company",
        authUser: user,
        displayName: getDisplayName("company", user, profile),
        profile,
        source: "public.entreprises",
      };
    }

    const [candidateProfile, companyProfile] = await Promise.all([
      fetchLatestProfile("candidats", "email", email),
      fetchLatestProfile("entreprises", "email_prof", email),
    ]);

    if (candidateProfile) {
      return {
        accountType: "candidate",
        authUser: user,
        displayName: getDisplayName("candidate", user, candidateProfile),
        profile: candidateProfile,
        source: "public.candidats",
      };
    }

    if (companyProfile) {
      return {
        accountType: "company",
        authUser: user,
        displayName: getDisplayName("company", user, companyProfile),
        profile: companyProfile,
        source: "public.entreprises",
      };
    }

    return {
      accountType: preferredType || "unknown",
      authUser: user,
      displayName: getDisplayName(preferredType || "unknown", user, null),
      profile: null,
      source: null,
    };
  });
}
