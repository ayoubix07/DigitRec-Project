import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoadingBar } from "../components/LoadingBarProvider";
import AuthShell from "../components/AuthShell";
import { getSession, signInWithPassword } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const { startLoading } = useLoadingBar();
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
          navigate("/dashboard", { replace: true });
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
      const result = await signInWithPassword(email, password);

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      navigate("/dashboard", { replace: true });
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  return (
    <AuthShell
      eyebrow="Connexion"
      title="Accédez à votre espace de travail."
      subtitle="Retrouvez votre tableau de bord, vos offres, vos candidatures et tout votre suivi recrutement dans un espace clair et fluide."
      highlights={[
        "Centralisez vos offres, vos candidatures et vos étapes d'évaluation.",
        "Gardez une vue simple sur votre activité, côté candidat comme côté entreprise.",
        "Travaillez dans une interface sobre, professionnelle et pensée pour aller à l'essentiel.",
      ]}
      stats={[
        { label: "Expérience", value: "Fluide" },
        { label: "Pilotage", value: "Centralisé" },
      ]}
      titleClassName="legacy-auth-hero__title--login"
    >
      <div className="legacy-auth-card__badge">Connexion</div>
      <h2 className="legacy-auth-card__title">Bon retour sur DigitRec</h2>
      <p className="legacy-auth-card__subtitle">
        Connectez-vous pour retrouver votre espace candidat ou entreprise.
      </p>

      <form className="legacy-auth-form" onSubmit={handleSubmit}>
        <div className="legacy-auth-field">
          <label className="legacy-auth-label" htmlFor="test-login-email">
            Email
          </label>
          <input
            id="test-login-email"
            className="legacy-auth-input"
            type="email"
            autoComplete="email"
            placeholder="vous@entreprise.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="legacy-auth-field">
          <label className="legacy-auth-label" htmlFor="test-login-password">
            Mot de passe
          </label>
          <input
            id="test-login-password"
            className="legacy-auth-input"
            type="password"
            autoComplete="current-password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button className="legacy-auth-submit" type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      {message ? <div className="legacy-auth-message legacy-auth-message--error">{message}</div> : null}

      <p className="legacy-auth-footer">
        Pas encore de compte ?{" "}
        <Link className="legacy-auth-link" to="/register">
          Créer un compte
        </Link>
      </p>
    </AuthShell>
  );
};

export default Login;
