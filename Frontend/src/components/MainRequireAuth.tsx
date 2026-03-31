import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMainSession } from "@/services/mainSupabaseWorkspace";

type MainRequireAuthProps = {
  children: ReactNode;
};

const MainRequireAuth = ({ children }: MainRequireAuthProps) => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery({
    queryKey: ["main-supabase-session"],
    queryFn: getMainSession,
  });

  useEffect(() => {
    if (isLoading) return;

    if (error || !data?.session) {
      navigate("/", { replace: true });
    }
  }, [data?.session, error, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Chargement...</div>;
  }

  if (!data?.session) {
    return null;
  }

  return <>{children}</>;
};

export default MainRequireAuth;
