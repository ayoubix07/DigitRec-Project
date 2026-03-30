import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TestAuthShell from "./TestAuthShell";
import { getSession, registerCandidate, registerCompany } from "../services/testAuthService";

const accountTypes = [
  {
    value: "candidate",
    label: "Candidate",
    description: "Create your profile, upload your background, and get ready to apply.",
  },
  {
    value: "company",
    label: "Company",
    description: "Open a workspace for your team and start managing recruitment.",
  },
] as const;

const TestRegister = () => {
  const navigate = useNavigate();
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

    setLoading(false);

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
      `Account created. Check your email to confirm your registration before signing in.${warning}`
    );
  };

  return (
    <TestAuthShell
      eyebrow="DigitRec Workspace"
      title="Build a profile that is ready to move."
      subtitle="Choose the way you want to enter the platform, then complete the fields that match your role."
      heroStatLeft="Candidate + Company"
      heroStatRight="Structured"
      image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
      imageAlt="Hiring team collaborating in a workspace"
    >
      <div className="legacy-auth-card__badge">Create Account</div>
      <h2 className="legacy-auth-card__title">Register</h2>
      <p className="legacy-auth-card__subtitle">
        Set up your access and align your profile with the right workspace.
      </p>

      <form className="legacy-auth-form" onSubmit={handleSubmit}>
        <div className="legacy-auth-field">
          <span className="legacy-auth-label">Register as</span>
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
                  First name
                </label>
                <input
                  id="test-register-first-name"
                  className="legacy-auth-input"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Jordan"
                />
              </div>

              <div className="legacy-auth-field">
                <label className="legacy-auth-label" htmlFor="test-register-last-name">
                  Last name
                </label>
                <input
                  id="test-register-last-name"
                  className="legacy-auth-input"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Reed"
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
                  Level
                </label>
                <input
                  id="test-register-level"
                  className="legacy-auth-input"
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                  placeholder="Junior, Mid, Senior..."
                />
              </div>
            </div>

            <div className="legacy-auth-field">
              <label className="legacy-auth-label" htmlFor="test-register-title">
                Title
              </label>
              <input
                id="test-register-title"
                className="legacy-auth-input"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Frontend Developer"
              />
            </div>

            <div className="legacy-auth-field">
              <label className="legacy-auth-label" htmlFor="test-register-profile">
                Profile
              </label>
              <input
                id="test-register-profile"
                className="legacy-auth-input"
                value={profile}
                onChange={(event) => setProfile(event.target.value)}
                placeholder="React, UI systems, testing..."
              />
            </div>

            <div className="legacy-auth-field">
              <label className="legacy-auth-label" htmlFor="test-register-cv-file">
                CV Upload
              </label>
              <input
                id="test-register-cv-file"
                className="legacy-auth-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) => setCvFile(event.target.files?.[0] ?? null)}
              />
              <span className="legacy-auth-helper">
                {cvFile ? `Selected: ${cvFile.name}` : "Upload a CV file instead of pasting a URL."}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="legacy-auth-field">
              <label className="legacy-auth-label" htmlFor="test-register-company-name">
                Company name
              </label>
              <input
                id="test-register-company-name"
                className="legacy-auth-input"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="Atlas Recruitment"
              />
            </div>

            <div className="legacy-auth-field">
              <label className="legacy-auth-label" htmlFor="test-register-logo-file">
                Logo Upload
              </label>
              <input
                id="test-register-logo-file"
                className="legacy-auth-input"
                type="file"
                accept="image/*"
                onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)}
              />
              <span className="legacy-auth-helper">
                {logoFile ? `Selected: ${logoFile.name}` : "Upload a logo file instead of pasting an image URL."}
              </span>
            </div>
          </>
        )}

        <div className="legacy-auth-field">
          <label className="legacy-auth-label" htmlFor="test-register-email">
            {accountType === "company" ? "Professional email" : "Email"}
          </label>
          <input
            id="test-register-email"
            className="legacy-auth-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
          />
        </div>

        <div className="legacy-auth-field">
          <label className="legacy-auth-label" htmlFor="test-register-password">
            Password
          </label>
          <input
            id="test-register-password"
            className="legacy-auth-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a strong password"
          />
        </div>

        <button className="legacy-auth-submit" type="submit" disabled={loading}>
          {loading
            ? "Creating account..."
            : accountType === "candidate"
              ? "Create candidate account"
              : "Create company account"}
        </button>
      </form>

      {message ? (
        <div
          className={
            message.startsWith("Account created")
              ? "legacy-auth-message legacy-auth-message--info"
              : "legacy-auth-message legacy-auth-message--error"
          }
        >
          {message}
        </div>
      ) : null}

      <p className="legacy-auth-footer">
        Already have an account?{" "}
        <Link className="legacy-auth-link" to="/test/login">
          Sign in
        </Link>
      </p>
    </TestAuthShell>
  );
};

export default TestRegister;
