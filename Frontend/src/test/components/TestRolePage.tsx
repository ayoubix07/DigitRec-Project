import { ReactNode } from "react";
import { TestAccountType, useTestAccount } from "../hooks/useTestAccount";

type TestRolePageProps = {
  allow?: TestAccountType[];
  children: (account: NonNullable<ReturnType<typeof useTestAccount>["account"]>) => ReactNode;
};

const TestRolePage = ({ allow, children }: TestRolePageProps) => {
  const { account, error, loading } = useTestAccount();

  if (loading) {
    return <div className="legacy-dashboard-state">Chargement de votre espace...</div>;
  }

  if (error || !account) {
    return (
      <div className="legacy-dashboard-state legacy-dashboard-state--error">
        {error || "Impossible de charger cette page pour le moment."}
      </div>
    );
  }

  if (allow && !allow.includes(account.accountType)) {
    return (
      <div className="legacy-dashboard-state">
        Cette page n&apos;est pas disponible pour ce type de compte.
      </div>
    );
  }

  return <>{children(account)}</>;
};

export default TestRolePage;
