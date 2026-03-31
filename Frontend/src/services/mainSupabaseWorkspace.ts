import { resolveCurrentProfile, signOut } from "./supabaseAuth";
import { supabase } from "./supabaseClient";

export type MainCompanyProfile = {
  id: string;
  nom: string;
  email_prof: string;
  logo_url: string | null;
  created_at?: string | null;
};

export type MainOffer = {
  id: string;
  id_entreprise: string;
  titre_poste: string;
  departement: string | null;
  niveau_demande: string | null;
  nombre_candidats_recherche: number | null;
  type_examen_ecrit: string | null;
  date_fin_offre: string | null;
  nombre_experience_min: number | null;
  description_poste: string | null;
  status: string | null;
  created_at?: string | null;
};

export type MainCandidature = {
  id: string;
  id_offre: string | null;
  id_candidat: string | null;
  score_cv_matching: number | null;
  cv_analysis_report: string | null;
  etape_actuelle: string | null;
  created_at?: string | null;
};

export type MainCandidateCard = {
  id: string;
  name: string;
  role: string;
  stage: string;
  rating: number;
};

export type MainCompanyWorkspace = {
  authUser: {
    email?: string;
    id: string;
    last_sign_in_at?: string;
  };
  company: MainCompanyProfile;
  displayName: string;
  offers: MainOffer[];
  candidatures: MainCandidature[];
  candidateCards: MainCandidateCard[];
};

type MainSessionResult = {
  session: unknown | null;
};

function toNullable(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function parseExperience(value: string) {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function normalizeCompanyProfile(profile: Record<string, unknown>): MainCompanyProfile {
  return {
    id: String(profile.id ?? ""),
    nom: String(profile.nom ?? "Votre entreprise"),
    email_prof: String(profile.email_prof ?? ""),
    logo_url: (profile.logo_url as string | null | undefined) ?? null,
    created_at: (profile.created_at as string | null | undefined) ?? null,
  };
}

function buildFallbackCompanyProfile(input: {
  displayName: string;
  email?: string;
  profile?: Record<string, unknown> | null;
}): MainCompanyProfile {
  return {
    id: String(input.profile?.id ?? ""),
    nom: String(input.profile?.nom ?? "").trim() || input.displayName || "Votre entreprise",
    email_prof: String(input.profile?.email_prof ?? "").trim() || input.email || "",
    logo_url: (input.profile?.logo_url as string | null | undefined) ?? null,
    created_at: (input.profile?.created_at as string | null | undefined) ?? null,
  };
}

function formatStage(value: string | null) {
  if (!value) return "En cours";

  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeRating(value: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  const score = Math.max(0, Math.min(100, value));
  return Math.round((score / 20) * 10) / 10;
}

function buildDescription(input: {
  description: string;
  location: string;
  selectedContracts: string[];
  skills: string[];
  salary: number[];
}) {
  const parts = [
    input.description.trim(),
    input.location ? `Localisation : ${input.location}` : "",
    input.selectedContracts.length ? `Contrats : ${input.selectedContracts.join(", ")}` : "",
    input.skills.length ? `Compétences : ${input.skills.join(", ")}` : "",
    input.salary.length === 2 ? `Salaire : ${input.salary[0]}k€ - ${input.salary[1]}k€` : "",
  ].filter(Boolean);

  return parts.join("\n\n");
}

async function getCompanyContext() {
  const profileResult = await resolveCurrentProfile();

  if (profileResult.error || !profileResult.data) {
    throw new Error(profileResult.error?.message || "Session introuvable.");
  }

  const authUser = {
    email: profileResult.data.authUser.email,
    id: profileResult.data.authUser.id,
    last_sign_in_at: profileResult.data.authUser.last_sign_in_at,
  };

  if (profileResult.data.accountType !== "company") {
    return {
      authUser,
      displayName: profileResult.data.displayName,
      company: buildFallbackCompanyProfile({
        displayName: profileResult.data.displayName,
        email: profileResult.data.authUser.email,
        profile: profileResult.data.profile,
      }),
    };
  }

  return {
    authUser,
    displayName: profileResult.data.displayName,
    company: profileResult.data.profile
      ? normalizeCompanyProfile(profileResult.data.profile)
      : buildFallbackCompanyProfile({
          displayName: profileResult.data.displayName,
          email: profileResult.data.authUser.email,
          profile: null,
        }),
  };
}

export async function getMainSession(): Promise<MainSessionResult> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return { session };
}

export async function getMainCompanyWorkspace(): Promise<MainCompanyWorkspace> {
  const context = await getCompanyContext();

  let offers: MainOffer[] = [];
  if (context.company.id) {
    const { data, error } = await supabase
      .from("offres")
      .select("*")
      .eq("id_entreprise", context.company.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase offres query failed", error.message);
    } else {
      offers = (data ?? []) as MainOffer[];
    }
  }

  const offerIds = offers.map((offer) => offer.id);
  let candidatures: MainCandidature[] = [];

  if (offerIds.length > 0) {
    const { data, error } = await supabase
      .from("candidatures")
      .select("*")
      .in("id_offre", offerIds)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase candidatures query failed", error.message);
    } else {
      candidatures = (data ?? []) as MainCandidature[];
    }
  }

  const numericCandidateIds = Array.from(
    new Set(
      candidatures
        .map((item) => item.id_candidat)
        .filter((value): value is string => Boolean(value) && /^\d+$/.test(String(value)))
        .map((value) => Number(value))
    )
  );

  let candidateRows: Array<Record<string, unknown>> = [];
  if (numericCandidateIds.length > 0) {
    const { data, error } = await supabase
      .from("candidats")
      .select("*")
      .in("id", numericCandidateIds);

    if (error) {
      console.warn("Supabase candidats query failed", error.message);
    } else {
      candidateRows = (data ?? []) as Array<Record<string, unknown>>;
    }
  }

  const candidateMap = new Map(candidateRows.map((candidate) => [String(candidate.id), candidate]));
  const offerMap = new Map(offers.map((offer) => [offer.id, offer]));

  const candidateCards: MainCandidateCard[] = candidatures.map((item) => {
    const candidate = item.id_candidat ? candidateMap.get(String(item.id_candidat)) : undefined;
    const offer = item.id_offre ? offerMap.get(item.id_offre) : undefined;
    const firstName = String(candidate?.prenom ?? "").trim();
    const lastName = String(candidate?.nom ?? "").trim();
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

    return {
      id: item.id,
      name: fullName || `Candidat ${String(item.id_candidat ?? item.id).slice(0, 8)}`,
      role: offer?.titre_poste || "Offre en cours",
      stage: formatStage(item.etape_actuelle),
      rating: normalizeRating(item.score_cv_matching),
    };
  });

  return {
    authUser: context.authUser,
    company: context.company,
    displayName: context.displayName,
    offers,
    candidatures,
    candidateCards,
  };
}

export async function signOutMainWorkspace() {
  return signOut();
}

export async function createMainOffer(input: {
  title: string;
  department: string;
  location: string;
  selectedContracts: string[];
  skills: string[];
  experience: string;
  salary: number[];
  description: string;
}) {
  const context = await getCompanyContext();

  if (!context.company.id) {
    throw new Error("Le profil entreprise est incomplet. Impossible de créer une offre pour le moment.");
  }

  const payload = {
    id_entreprise: context.company.id,
    titre_poste: input.title.trim(),
    departement: toNullable(input.department),
    niveau_demande: toNullable(input.experience),
    nombre_candidats_recherche: 1,
    type_examen_ecrit: null,
    difficulte_examen: null,
    nombre_questions_oral: null,
    date_fin_offre: null,
    nombre_experience_min: parseExperience(input.experience),
    description_poste: toNullable(
      buildDescription({
        description: input.description,
        location: input.location,
        selectedContracts: input.selectedContracts,
        skills: input.skills,
        salary: input.salary,
      })
    ),
    status: "active",
  };

  const { data, error } = await supabase.from("offres").insert(payload).select().single();

  if (error) {
    throw new Error(error.message);
  }

  return data as MainOffer;
}

export async function updateMainCompanyProfile(input: {
  companyName: string;
  email: string;
  logoUrl: string;
}) {
  const context = await getCompanyContext();

  if (!context.company.id) {
    throw new Error(
      "Le profil entreprise est incomplet. Impossible de mettre à jour ces informations pour le moment."
    );
  }

  const { data, error } = await supabase
    .from("entreprises")
    .update({
      nom: input.companyName.trim(),
      email_prof: input.email.trim().toLowerCase(),
      logo_url: toNullable(input.logoUrl),
    })
    .eq("id", context.company.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return normalizeCompanyProfile(data as Record<string, unknown>);
}
