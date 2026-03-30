import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const offers = [
  { id: 1, title: "Développeur Full-Stack", dept: "Engineering", location: "Paris", type: "CDI", candidates: 34, status: "Active" },
  { id: 2, title: "Product Designer", dept: "Design", location: "Lyon", type: "CDI", candidates: 18, status: "Active" },
  { id: 3, title: "Data Analyst", dept: "Data", location: "Remote", type: "CDD", candidates: 12, status: "Active" },
  { id: 4, title: "Chef de Projet", dept: "Management", location: "Paris", type: "CDI", candidates: 28, status: "Brouillon" },
];

const Offers = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes Offres</h1>
          <p className="text-sm text-muted-foreground">{offers.length} offres au total</p>
        </div>
        <Button onClick={() => navigate("/dashboard/offers/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle offre
        </Button>
      </div>

      <div className="grid gap-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="flex items-center justify-between rounded-xl border bg-card p-5 card-shadow transition-all hover:card-shadow-hover cursor-pointer"
          >
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">{offer.title}</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{offer.dept}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {offer.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {offer.candidates} candidats
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={offer.status === "Active" ? "default" : "secondary"}>
                {offer.status}
              </Badge>
              <Badge variant="outline">{offer.type}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
