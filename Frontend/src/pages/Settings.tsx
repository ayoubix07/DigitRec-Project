import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="text-sm text-muted-foreground">Gérez les paramètres de votre entreprise</p>
      </div>

      <div className="rounded-xl border bg-card p-6 card-shadow space-y-5">
        <h2 className="font-semibold text-foreground">Informations de l'entreprise</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Nom de l'entreprise</Label>
            <Input defaultValue="Acme Corp" />
          </div>
          <div className="space-y-2">
            <Label>Site web</Label>
            <Input defaultValue="https://acme.com" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input defaultValue="Leader en solutions technologiques innovantes" />
        </div>
      </div>

      <Separator />

      <div className="rounded-xl border bg-card p-6 card-shadow space-y-5">
        <h2 className="font-semibold text-foreground">Compte administrateur</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue="admin@acme.com" type="email" />
          </div>
          <div className="space-y-2">
            <Label>Mot de passe</Label>
            <Input type="password" defaultValue="password" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Enregistrer les modifications</Button>
      </div>
    </div>
  );
};

export default SettingsPage;
