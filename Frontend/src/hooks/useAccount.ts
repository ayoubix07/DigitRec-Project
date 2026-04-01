import { useEffect, useState } from "react";
import { useLoadingBar } from "../components/LoadingBarProvider";
import { getCurrentUser, resolveCurrentProfile } from "../services/authService";

export type AccountType = "candidate" | "company" | "unknown";

export type AuthUser = {
  app_metadata?: Record<string, unknown>;
  created_at?: string;
  email?: string;
  email_confirmed_at?: string;
  id: string;
  last_sign_in_at?: string;
  role?: string;
  user_metadata?: Record<string, unknown>;
};

export type Account = {
  accountType: AccountType;
  authUser: AuthUser;
  displayName: string;
  profile: Record<string, unknown> | null;
  source: string | null;
};

type AccountState = {
  account: Account | null;
  error: string;
  loading: boolean;
};

export function useAccount() {
  const { startLoading } = useLoadingBar();
  const [state, setState] = useState<AccountState>({
    account: null,
    error: "",
    loading: true,
  });

  useEffect(() => {
    let active = true;
    const stopLoading = startLoading();

    const loadAccount = async () => {
      try {
        const profileResult = await resolveCurrentProfile();

        if (!active) return;

        if (profileResult.data) {
          setState({
            account: profileResult.data as Account,
            error: "",
            loading: false,
          });
          return;
        }

        const userResult = await getCurrentUser();

        if (!active) return;

        if (userResult.data) {
          const fallbackName = userResult.data.email || "Compte DigitRec";
          setState({
            account: {
              accountType: "unknown",
              authUser: {
                app_metadata: userResult.data.app_metadata as Record<string, unknown> | undefined,
                created_at: userResult.data.created_at,
                email: userResult.data.email,
                email_confirmed_at: userResult.data.email_confirmed_at,
                id: userResult.data.id,
                last_sign_in_at: userResult.data.last_sign_in_at,
                role: userResult.data.role,
                user_metadata: userResult.data.user_metadata as Record<string, unknown> | undefined,
              },
              displayName: fallbackName,
              profile: null,
              source: null,
            },
            error: "",
            loading: false,
          });
          return;
        }

        setState({
          account: null,
          error:
            profileResult.error?.message ||
            userResult.error?.message ||
            "Impossible de charger les informations du compte.",
          loading: false,
        });
      } finally {
        stopLoading();
      }
    };

    loadAccount();

    return () => {
      active = false;
      stopLoading();
    };
  }, [startLoading]);

  return state;
}
