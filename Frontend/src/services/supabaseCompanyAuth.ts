import {
  registerCompany as registerSupabaseCompany,
  signInWithPassword as signInWithSupabasePassword,
} from "./supabaseAuth";

export function signInCompanyWithSupabase(email: string, password: string) {
  return signInWithSupabasePassword(email, password);
}

export function registerCompanyWithSupabase(companyName: string, email: string, password: string) {
  return registerSupabaseCompany({
    companyName,
    email,
    logoFile: null,
    password,
  });
}
