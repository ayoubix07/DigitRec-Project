import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TestAuthShell from "./TestAuthShell";
import { getSession, signInWithPassword } from "../services/testAuthService";

const TestLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const sessionResult = await getSession();

      if (!active) return;

      if (sessionResult.data) {
        navigate("/test/dashboard", { replace: true });
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await signInWithPassword(email, password);

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    navigate("/test/dashboard", { replace: true });
  };

  return (
    <TestAuthShell
      eyebrow="DigitRec Workspace"
      title="Lead the build. Energize the launch."
      subtitle="Reconnect with the original sign-in flow, now integrated cleanly so we can keep its look and behavior without spilling into the main product."
      heroStatLeft="Identity-first"
      heroStatRight="Safe"
      image="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
      imageAlt="Team working with modern technology"
    >
      <div className="legacy-auth-card__badge">Welcome Back</div>
      <h2 className="legacy-auth-card__title">Sign in</h2>
      <p className="legacy-auth-card__subtitle">
        Access your workspace and continue from where you left off.
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
            placeholder="you@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="legacy-auth-field">
          <label className="legacy-auth-label" htmlFor="test-login-password">
            Password
          </label>
          <input
            id="test-login-password"
            className="legacy-auth-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button className="legacy-auth-submit" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in to DigitRec"}
        </button>
      </form>

      {message ? <div className="legacy-auth-message legacy-auth-message--error">{message}</div> : null}

      <p className="legacy-auth-footer">
        New here?{" "}
        <Link className="legacy-auth-link" to="/test/register">
          Create an account
        </Link>
      </p>
    </TestAuthShell>
  );
};

export default TestLogin;
