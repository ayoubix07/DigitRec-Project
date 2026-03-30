import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, Plus } from "lucide-react";

const contractTypes = ["CDI", "CDD", "Freelance", "Stage", "Alternance"];

const NewOffer = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState([35, 65]);
  const [description, setDescription] = useState("");

  const toggleContract = (type: string) => {
    setSelectedContracts((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast({ title: "Erreur", description: "Le titre est requis.", variant: "destructive" });
      return;
    }
    toast({
      title: "✅ Offre publiée !",
      description: `L'offre "${title}" a été créée avec succès.`,
    });
    setTimeout(() => navigate("/dashboard/offers"), 600);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/offers")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nouvelle offre d'emploi</h1>
          <p className="text-sm text-muted-foreground">Remplissez les informations pour publier votre offre</p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Basic Info */}
        <div className="rounded-xl border bg-card p-6 card-shadow space-y-5">
          <h2 className="font-semibold text-foreground">Informations de base</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du poste *</Label>
              <Input id="title" placeholder="ex: Développeur React Senior" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dept">Département</Label>
              <Input id="dept" placeholder="ex: Engineering" value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Localisation</Label>
            <Input id="location" placeholder="ex: Paris, France (Remote)" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Type de contrat</Label>
            <div className="flex flex-wrap gap-2">
              {contractTypes.map((type) => (
                <Badge
                  key={type}
                  variant={selectedContracts.includes(type) ? "default" : "outline"}
                  className="cursor-pointer select-none transition-all"
                  onClick={() => toggleContract(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="rounded-xl border bg-card p-6 card-shadow space-y-5">
          <h2 className="font-semibold text-foreground">Détails techniques</h2>
          <div className="space-y-2">
            <Label>Compétences requises</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter une compétence..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button type="button" variant="secondary" size="icon" onClick={addSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSkills(skills.filter((s) => s !== skill))} />
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp">Niveau d'expérience</Label>
            <Input id="exp" placeholder="ex: 3-5 ans" value={experience} onChange={(e) => setExperience(e.target.value)} />
          </div>
          <div className="space-y-3">
            <Label>Fourchette de salaire (k€/an)</Label>
            <Slider min={20} max={120} step={5} value={salary} onValueChange={setSalary} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{salary[0]}k€</span>
              <span>{salary[1]}k€</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl border bg-card p-6 card-shadow space-y-5">
          <h2 className="font-semibold text-foreground">Description du poste</h2>
          <Textarea
            placeholder="Décrivez les missions, les responsabilités et l'environnement de travail..."
            className="min-h-[200px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/dashboard/offers")}>
            Annuler
          </Button>
          <Button type="submit">Publier l'offre</Button>
        </div>
      </motion.form>
    </div>
  );
};

export default NewOffer;
