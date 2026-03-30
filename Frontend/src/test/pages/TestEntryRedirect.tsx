import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTestLoadingBar } from "../components/TestLoadingBarProvider";
import { getSession } from "../services/testAuthService";

const TestEntryRedirect = () => {
  const [target, setTarget] = useState<"/test/login" | "/test/dashboard" | null>(null);
  const { startLoading } = useTestLoadingBar();

  useEffect(() => {
    let active = true;
    const stopLoading = startLoading();

    const resolveTarget = async () => {
      try {
        const sessionResult = await getSession();

        if (!active) return;

        setTarget(sessionResult.data ? "/test/dashboard" : "/test/login");
      } finally {
        stopLoading();
      }
    };

    resolveTarget();

    return () => {
      active = false;
      stopLoading();
    };
  }, [startLoading]);

  if (!target) {
    return (
      <div className="min-h-screen bg-background px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 text-sm text-muted-foreground shadow-sm">
          Vérification de l'accès à votre espace...
        </div>
      </div>
    );
  }

  return <Navigate to={target} replace />;
};

export default TestEntryRedirect;
