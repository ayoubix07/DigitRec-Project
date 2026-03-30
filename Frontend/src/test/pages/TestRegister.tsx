import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTestLoadingBar } from "../components/TestLoadingBarProvider";
import { getSession, registerCandidate, registerCompany } from "../services/testAuthService";
import TestAuthShell from "./TestAuthShell";

const accountTypes = [
  {
    value: "candidate",
    label: "Candidat",
    description: "Créez votre profil, ajoutez votre CV et préparez vos candidatures.",
  },
  {
    value: "company",
    label: "Entreprise",
    description: "Ouvrez un espace équipe et commencez à piloter votre recrutement.",
  },
] as const;

const TestRegister = () => {
  const navigate = useNavigate();
  const { startLoading } = useTestLoadingBar();
  const [accountType, setAccountType] = useState<"candidate" | "company">("candidate");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [cin, setCin] = useState("");
  const [title, setTitle] = useState("");
  const [profile, setProfile] = useState("");
  const [level, setLevel] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const stopLoading = startLoading();

    const checkSession = async () => {
      try {
        const sessionResult = await getSession();

        if (!active) return;

        if (sessionResult.data) {
          navigate("/test/dashboard", { replace: true });
        }
      } finally {
        stopLoading();
      }
    };

    checkSession();

    return () => {
      active = false;
      stopLoading();
    };
  }, [navigate, startLoading]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const stopLoading = startLoading();

    try {
      const result =
        accountType === "candidate"
          ? await registerCandidate({
              cin,
              cvFile,
              email,
              firstName,
              lastName,
              level,
              password,
              profile,
              title,
            })
          : await registerCompany({
              companyName,
              email,
              logoFile,
              password,
            });

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      if (result.data?.auth.session) {
        navigate("/test/dashboard", { replace: true });
        return;
      }

      const warning = result.data?.uploadWarning ? ` ${result.data.uploadWarning}` : "";
      setMessage(
        `Compte créé. Vérifiez votre email pour confirmer l'inscription avant de vous connecter.${warning}`
      );
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  return (
    <TestAuthShell
      eyebrow="Inscription"
      title="Créez un accès propre et prêt à l'emploi."
      subtitle="Choisissez votre rôle, renseignez vos informations principales et préparez votre espace pour gérer vos candidatures ou votre recrutement."
      highlights={[
        "Créez rapidement un espace candidat ou entreprise.",
        "Rassemblez vos informations essentielles dès la première connexion.",
        "Commencez avec une interface claire et directement orientée métier.",
      ]}
      stats={[
        { label: "Profils gérés", value: "Candidat + Entreprise" },
        { label: "Expérience", value: "Simple" },
      ]}
      layout="card-only"
    >
      <div className="legacy-auth-card__badge">Inscription</div>
      <h2 className="legacy-auth-card__title">Créer votre accès</h2>
      <p className="legacy-auth-card__subtitle">
        Configurez votre compte et alignez les champs affichés avec votre rôle.
      </p>

      <form className="legacy-auth-form" onSubmit={handleSubmit}>
        <div className="legacy-auth-field">
          <span className="legacy-auth-label">Créer un compte en tant que</span>
          <div className="legacy-auth-role-grid">
            {accountTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                className={
                  accountType === type.value
                    ? "legacy-auth-role legacy-auth-role--active"
                    : "legacy-auth-role"
                }
                onClick={() => setAccountType(type.value)}
              >
                <span className="legacy-auth-role__title">{type.label}</span>
                <span className="legacy-auth-role__description">{type.description}</span>
              </button>
            ))}
          </div>
        </div>

        {accountType === "candidate" ? (
          <>
            <div className="legacy-auth-grid legacy-auth-grid--2">
              <div className="legacy-auth-field">
                <label className="legacy-auth-label" htmlFor="test-register-first-name">
                  Prénom
                </label>
                <input
                  id="test-register-first-name"
                  className="legacy-auth-input"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Salma"
                />
              </div>

              <div className="legacy-auth-field">
                <label className="legacy-auth-label" htmlFor="test-register-last-name">
                  Nom
                </label>
                <input
                  id="test-register-last-name"
                  className="legacy-auth-input"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Idrissi"
                />
              </div>
            </div>

            <div className="legacy-auth-grid legacy-auth-grid--2">
              <div className="legacy-auth-field">
                <label className="legacy-auth-label" htmlFor="test-register-cin">
                  CIN
                </label>
                <input
                  id="test-register-cin"
                  className="legacy-auth-input"
                  value={cin}
                  onChange={(event) => setCin(event.target.value)}
                  placeholder="AB123456"
                />
              </div>

              <div className="legacy-auth-field">
                <label className="legacy-auth-label" htmlFor="test-register-level">
                  Niveau
                </label>
                <input
                  id="test-register-level"
                  className="legacy-auth-input"
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                  placeholder="Junior, Confirmé, Senior..."
                />
              </div>
            </div>

            <div className="legacy-auth-field">
              <label className="legacy-auth-label" htmlFor="test-register-title">
                Intitulé
              </label>
              <input
                id="test-register-title"
                className="legacy-auth-input"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Développeur Frontend"
              />
            </div>

            <div className="legacy-auth-field">
              <label className="legacy-auth-label" htmlFor="test-register-profile">
                Profil
              </label>
              <input
                id="test-register-profile"
                className="legacy-auth-input"
                value={profile}
                onChange={(event) => setProfile(event.target.value)}
                placeholder="React, design systems, tests..."
              />
            </div>

            <div className="legacy-auth-field">
              <label className="legacy-auth-label" htmlFor="test-register-cv-file">
                CV
              </label>
              <input
                id="test-register-cv-file"
                className="legacy-auth-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) => setCvFile(event.target.files?.[0] ?? null)}
              />
              <span className="legacy-auth-helper">
                {cvFile ? `Fichier sélectionné : ${cvFile.name}` : "Ajoutez un CV en PDF, DOC ou DOCX."}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="legacy-auth-field">
              <label className="legacy-auth-label" htmlFor="test-register-company-name">
                Nom de l'entreprise
              </label>
              <input
                id="test-register-company-name"
                className="legacy-auth-input"
                autoComplete="organization"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="Atlas Recruitment"
              />
            </div>

            <div className="legacy-auth-field">
              <label className="legacy-auth-label" htmlFor="test-register-logo-file">
                Logo
              </label>
              <input
                id="test-register-logo-file"
                className="legacy-auth-input"
                type="file"
                accept="image/*"
                onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)}
              />
              <span className="legacy-auth-helper">
                {logoFile ? `Fichier sélectionné : ${logoFile.name}` : "Ajoutez un logo pour personnaliser l'espace entreprise."}
              </span>
            </div>
          </>
        )}

        <div className="legacy-auth-field">
          <label className="legacy-auth-label" htmlFor="test-register-email">
            {accountType === "company" ? "Email professionnel" : "Email"}
          </label>
          <input
            id="test-register-email"
            className="legacy-auth-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="vous@exemple.com"
          />
        </div>

        <div className="legacy-auth-field">
          <label className="legacy-auth-label" htmlFor="test-register-password">
            Mot de passe
          </label>
          <input
            id="test-register-password"
            className="legacy-auth-input"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Créez un mot de passe robuste"
          />
        </div>

        <button className="legacy-auth-submit" type="submit" disabled={loading}>
          {loading
            ? "Création..."
            : accountType === "candidate"
              ? "Créer un compte candidat"
              : "Créer un compte entreprise"}
        </button>
      </form>

      {message ? (
        <div
          className={
            message.startsWith("Compte créé")
              ? "legacy-auth-message legacy-auth-message--info"
              : "legacy-auth-message legacy-auth-message--error"
          }
        >
          {message}
        </div>
      ) : null}

      <p className="legacy-auth-footer">
        Vous avez déjà un compte ?{" "}
        <Link className="legacy-auth-link" to="/test/login">
          Se connecter
        </Link>
      </p>
    </TestAuthShell>
  );
};

export default TestRegister;
