import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, onAuthStateChange } from "../services/authService";
import { useLoadingBar } from "./LoadingBarProvider";

type RequireAuthProps = {
  children: ReactNode;
};

const RequireAuth = ({ children }: RequireAuthProps) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const { startLoading } = useLoadingBar();

  useEffect(() => {
    let active = true;
    const stopLoading = startLoading();

    const checkSession = async () => {
      try {
        const sessionResult = await getSession();

        if (!active) return;

        if (sessionResult.error || !sessionResult.data) {
          navigate("/login", { replace: true });
          return;
        }

        setChecking(false);
      } finally {
        stopLoading();
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = onAuthStateChange((_event, session) => {
      if (!active) return;

      if (!session) {
        navigate("/login", { replace: true });
        return;
      }

      setChecking(false);
    });

    return () => {
      active = false;
      stopLoading();
      subscription.unsubscribe();
    };
  }, [navigate, startLoading]);

  if (checking) {
    return (
      <div className="min-h-screen bg-background px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 text-sm text-muted-foreground shadow-sm">
          Vérification de votre session...
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
