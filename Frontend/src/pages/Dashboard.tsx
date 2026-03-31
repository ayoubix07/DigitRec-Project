import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useMainCompanyWorkspace } from "@/hooks/useMainCompanyWorkspace";
import { signOutMainWorkspace } from "@/services/mainSupabaseWorkspace";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useMainCompanyWorkspace();

  const handleLogout = async () => {
    await signOutMainWorkspace();
    navigate("/", { replace: true });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">Chargement...</div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="gap-2 bg-blue-50 text-blue-700 border-blue-200">
              <Shield className="h-3 w-3" />
              ID: <code className="font-mono text-xs">{data.authUser.id}</code>
            </Badge>
            <div>
              <h1 className="text-xl font-bold">
                Dashboard - {data.company.nom || data.displayName || "Votre entreprise"}
              </h1>
              <p className="text-xs text-muted-foreground">Données isolées pour chaque entreprise.</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>Déconnexion</Button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Bienvenue dans votre espace sécurisé</h2>
          <p className="text-muted-foreground">Aucune autre entreprise ne peut voir ces données.</p>
          <div className="mt-4 rounded-md border bg-muted p-4">
            <p className="text-sm"><strong>Entreprise ID :</strong> {data.authUser.id}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">Offres ({data.offers.length})</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
              {data.offers.slice(0, 5).map((offer) => (
                <li key={offer.id}>{offer.titre_poste || offer.titre || "Offre sans titre"}</li>
              ))}
              {!data.offers.length && <li>Aucune offre créée.</li>}
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">Candidatures ({data.candidatures.length})</h3>
            <p className="mt-2 text-sm text-muted-foreground">Candidatures liées uniquement à vos offres.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
