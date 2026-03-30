import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  BarChart3,
  Clock,
  Shield,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: Zap,
    title: "Automatisation intelligente",
    desc: "Triez et qualifiez automatiquement les candidatures grâce à nos algorithmes avancés.",
  },
  {
    icon: BarChart3,
    title: "Analyses en temps réel",
    desc: "Suivez vos KPIs de recrutement avec des tableaux de bord visuels et intuitifs.",
  },
  {
    icon: Clock,
    title: "Gain de temps",
    desc: "Réduisez votre temps de recrutement de 60% avec nos workflows optimisés.",
  },
  {
    icon: Shield,
    title: "Conformité RGPD",
    desc: "Vos données candidats sont protégées et conformes aux réglementations en vigueur.",
  },
];

const Index = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupMessage, setSignupMessage] = useState<string>("");
  const [signupError, setSignupError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string>("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [isLoginView, setIsLoginView] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const getPasswordStrength = (value: string) => {
    const checks = [
      /[a-z]/.test(value),
      /[A-Z]/.test(value),
      /\d/.test(value),
      /[@$!%*?&]/.test(value),
      value.length >= 12,
    ];
    const score = checks.reduce((sum, c) => sum + (c ? 1 : 0), 0);
    setPasswordStrength(score);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    getPasswordStrength(value);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    setSignupMessage("");

    if (!name || !email || !password) {
      setSignupError("Veuillez remplir tous les champs.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setSignupError("Email invalide.");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setSignupError("Le mot de passe doit contenir 8+ caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
      return;
    }

    setIsSubmitting(true);
    const apiBase = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

    try {
      const signupResponse = await fetch(`${apiBase}/api/auth/entreprise/inscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom_entreprise: name,
          email,
          mot_de_passe: password,
        }),
      });

      if (!signupResponse.ok) {
        let signupData: any = null;
        try { signupData = await signupResponse.json(); } catch { /* ignore */ }
        throw new Error(signupData?.detail || "Erreur serveur lors de l'inscription.");
      }
      const signupData = await signupResponse.json();

      setSignupMessage(`Inscription réussie ! Bienvenue ${signupData.nom_entreprise || name}. Vous pouvez maintenant vous connecter.`);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue";
      setSignupError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail || !loginPassword) {
      setLoginError("Veuillez remplir tous les champs du login.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(loginEmail)) {
      setLoginError("Veuillez saisir un email valide.");
      return;
    }
    if (loginPassword.length < 6) {
      setLoginError("Le mot de passe doit être d'au moins 6 caractères.");
      return;
    }

    setLoginLoading(true);
    const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

    try {
      const loginResponse = await fetch(`${apiBase}/api/auth/entreprise/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          mot_de_passe: loginPassword,
        }),
      });

      if (!loginResponse.ok) {
        let loginData: any = null;
        try { loginData = await loginResponse.json(); } catch { /* ignore */ }
        throw new Error(loginData?.detail || "Identifiants invalides.");
      }
      const loginData = await loginResponse.json();

      localStorage.setItem("token", loginData.access_token);
      localStorage.setItem("entreprise", JSON.stringify(loginData.entreprise));
      localStorage.setItem("entreprise_id", loginData.entreprise.id_entreprise);
      toast({ title: "Connexion réussie", description: "Redirection vers le dashboard..." });
      navigate("/dashboard");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Impossible de se connecter.");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-accent" />
            <span className="text-xl font-bold text-foreground">DigitRec</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>
              À propos
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsLoginView(false);
                document.getElementById("auth")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Inscription
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsLoginView(true);
                document.getElementById("auth")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Connexion
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(210_100%_52%/0.15),transparent_50%)]" />
        <div className="container relative mx-auto flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-4 py-2 text-sm text-primary-foreground/80"
          >
            <Zap className="h-4 w-4" />
            Plateforme de recrutement nouvelle génération
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="mb-6 max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-7xl"
          >
            Recrutez les{" "}
            <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
              meilleurs talents
            </span>
            , simplement.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mb-10 max-w-2xl text-lg text-primary-foreground/70"
          >
            DigitRec automatise votre processus de recrutement de A à Z.
            Publiez vos offres, gérez vos candidats et prenez les meilleures décisions.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              variant="hero"
              size="lg"
              className="text-base"
              onClick={() => {
                setIsLoginView(false);
                document.getElementById("auth")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Démarrer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="hero-outline" size="lg" className="text-base" onClick={() => navigate("/dashboard")}>
              Voir la démo
            </Button>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-primary-foreground/50"
          >
            {["2 000+ entreprises", "50 000+ recrutements", "Note 4.9/5"].map((stat) => (
              <div key={stat} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                {stat}
              </div>
            ))}
          </motion.div>
        </div>
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path
              d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            custom={0}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Pourquoi choisir DigitRec ?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Notre plateforme combine puissance et simplicité pour transformer
              votre façon de recruter.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="group rounded-xl border bg-card p-6 card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="auth" className="pb-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-md">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">{isLoginView ? "Connexion" : "Inscription"}</h2>
                <p className="text-muted-foreground">{isLoginView ? "Connectez-vous pour accéder à votre dashboard." : "Commencez gratuitement en créant votre compte."}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={isLoginView ? "outline" : "secondary"}
                  size="sm"
                  onClick={() => setIsLoginView(false)}
                >
                  Inscription
                </Button>
                <Button
                  variant={isLoginView ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setIsLoginView(true)}
                >
                  Connexion
                </Button>
              </div>
            </div>

            {!isLoginView ? (
              <>
                {signupError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4" />
                    <div>{signupError}</div>
                  </motion.div>
                )}
                {signupMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4" />
                    <div>{signupMessage}</div>
                  </motion.div>
                )}
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSignup}
                  className="rounded-xl border bg-card p-8 shadow-lg"
                >
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom de l'entreprise</Label>
                      <Input id="name" placeholder="Acme Corp" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email professionnel</Label>
                      <Input id="email" type="email" placeholder="contact@acme.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => handlePasswordChange(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full ${
                            passwordStrength <= 1
                              ? "bg-red-500"
                              : passwordStrength === 2
                              ? "bg-orange-500"
                              : passwordStrength === 3
                              ? "bg-yellow-500"
                              : passwordStrength === 4
                              ? "bg-emerald-500"
                              : "bg-blue-600"
                          }`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className={password.length >= 8 ? "text-emerald-600" : "text-red-500"}>• 8 caractères minimum</div>
                        <div className={/[A-Z]/.test(password) ? "text-emerald-600" : "text-red-500"}>• Au moins une majuscule</div>
                        <div className={/[a-z]/.test(password) ? "text-emerald-600" : "text-red-500"}>• Au moins une minuscule</div>
                        <div className={/\d/.test(password) ? "text-emerald-600" : "text-red-500"}>• Au moins un chiffre</div>
                        <div className={/[@$!%*?&]/.test(password) ? "text-emerald-600" : "text-red-500"}>• Au moins un caractère spécial</div>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                        />
                      ) : (
                        <>
                          Créer mon compte
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              </>
            ) : (
              <>
                {loginError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{loginError}</div>}
                <form onSubmit={handleLogin} className="rounded-xl border bg-card p-6 shadow-lg">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={loginShowPassword ? "text" : "password"}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setLoginShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {loginShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loginLoading}>
                      {loginLoading ? "Connexion..." : "Se connecter"}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto flex items-center justify-between px-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-accent" />
            DigiRec
          </div>
          <p>© 2026 DigitRec. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
