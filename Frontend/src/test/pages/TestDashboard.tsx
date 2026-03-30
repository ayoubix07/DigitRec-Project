import { useEffect, useState } from "react";
import { resolveCurrentProfile } from "../services/testAuthService";
import "../styles/test-dashboard.css";

type DashboardState = {
  accountType: string;
  authUser: {
    app_metadata?: Record<string, unknown>;
    created_at?: string;
    email?: string;
    email_confirmed_at?: string;
    id: string;
    last_sign_in_at?: string;
    role?: string;
    user_metadata?: Record<string, unknown>;
  };
  displayName: string;
  profile: Record<string, unknown> | null;
  source: string | null;
};

function formatAccountType(value: string) {
  if (value === "candidate") return "Candidate";
  if (value === "company") return "Company";
  return "Unknown";
}

function formatDate(value: unknown) {
  if (typeof value !== "string" || !value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleString();
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  return String(value);
}

const TestDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [account, setAccount] = useState<DashboardState | null>(null);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      const result = await resolveCurrentProfile();

      if (!active) return;

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      setAccount(result.data);
      setLoading(false);
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <div className="legacy-dashboard-state">Loading account details...</div>;
  }

  if (error || !account) {
    return <div className="legacy-dashboard-state legacy-dashboard-state--error">{error || "Unable to load the dashboard."}</div>;
  }

  const overviewItems = [
    { label: "Auth User ID", value: account.authUser.id },
    {
      label: account.accountType === "candidate" ? "Candidate Table ID" : "Company Table ID",
      value: account.profile?.id,
    },
    { label: "Account Type", value: formatAccountType(account.accountType) },
    { label: "Display Name", value: account.displayName },
    { label: "Email", value: account.authUser.email },
  ];

  const authFields = [
    { label: "Auth Source", value: "Supabase" },
    { label: "Auth Role", value: account.authUser.role },
    { label: "Last Sign In", value: formatDate(account.authUser.last_sign_in_at) },
    { label: "Auth Created At", value: formatDate(account.authUser.created_at) },
    { label: "Email Confirmed At", value: formatDate(account.authUser.email_confirmed_at) },
    { label: "Provider", value: account.authUser.app_metadata?.provider },
    { label: "Profile Source", value: account.source || "No matching public profile found" },
  ];

  const profileFields =
    account.accountType === "candidate"
      ? [
          { label: "Profile Table", value: "public.candidats" },
          { label: "Candidate ID", value: account.profile?.id },
          { label: "First Name", value: account.profile?.prenom },
          { label: "Last Name", value: account.profile?.nom },
          { label: "Email", value: account.profile?.email || account.authUser.email },
          { label: "CIN", value: account.profile?.cin },
          { label: "Title", value: account.profile?.title },
          { label: "Profile", value: account.profile?.profile },
          { label: "Level", value: account.profile?.level },
          { label: "CV URL", value: account.profile?.cv_url },
          { label: "Created At", value: formatDate(account.profile?.created_at) },
        ]
      : [
          { label: "Profile Table", value: "public.entreprises" },
          { label: "Company ID", value: account.profile?.id },
          { label: "Company Name", value: account.profile?.nom },
          { label: "Professional Email", value: account.profile?.email_prof || account.authUser.email },
          { label: "Logo URL", value: account.profile?.logo_url },
          { label: "Created At", value: formatDate(account.profile?.created_at) },
        ];

  return (
    <div className="legacy-dashboard">
      <section className="legacy-dashboard-hero">
        <div>
          <div className="legacy-dashboard-hero__eyebrow">Personal Space</div>
          <h1 className="legacy-dashboard-hero__title">{account.displayName}</h1>
          <p className="legacy-dashboard-hero__subtitle">
            Your account summary, identity details, and linked profile information all live here in one place.
          </p>
        </div>
        <div className="legacy-dashboard-hero__meta">
          <div className="legacy-dashboard-hero__pill">{formatAccountType(account.accountType)}</div>
          <div className="legacy-dashboard-hero__id-card">
            <div className="legacy-dashboard-hero__id-label">
              {account.accountType === "candidate" ? "Candidate ID" : "Company ID"}
            </div>
            <div className="legacy-dashboard-hero__id-value">
              {formatValue(account.profile?.id)}
            </div>
          </div>
        </div>
      </section>

      <section className="legacy-dashboard-overview">
        {overviewItems.map((item) => (
          <article key={item.label} className="legacy-dashboard-card legacy-dashboard-card--compact">
            <div className="legacy-dashboard-card__label">{item.label}</div>
            <div className="legacy-dashboard-card__value">{formatValue(item.value)}</div>
          </article>
        ))}
      </section>

      <section className="legacy-dashboard-columns">
        <article className="legacy-dashboard-card">
          <div className="legacy-dashboard-card__header">
            <h2>Auth Details</h2>
          </div>
          <div className="legacy-dashboard-list">
            {authFields.map((field) => (
              <div key={field.label} className="legacy-dashboard-list__item">
                <div className="legacy-dashboard-list__label">{field.label}</div>
                <div className="legacy-dashboard-list__value">{formatValue(field.value)}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="legacy-dashboard-card">
          <div className="legacy-dashboard-card__header">
            <h2>Profile Details</h2>
          </div>
          <div className="legacy-dashboard-list">
            {profileFields.map((field) => (
              <div key={field.label} className="legacy-dashboard-list__item">
                <div className="legacy-dashboard-list__label">{field.label}</div>
                <div className="legacy-dashboard-list__value">{formatValue(field.value)}</div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="legacy-dashboard-columns">
        <article className="legacy-dashboard-card">
          <div className="legacy-dashboard-card__header">
            <h2>Auth Metadata</h2>
          </div>
          <pre className="legacy-dashboard-code">
            {JSON.stringify(account.authUser.user_metadata || {}, null, 2)}
          </pre>
        </article>

        <article className="legacy-dashboard-card">
          <div className="legacy-dashboard-card__header">
            <h2>Profile Record</h2>
          </div>
          <pre className="legacy-dashboard-code">
            {JSON.stringify(account.profile || { message: "No matching public profile found." }, null, 2)}
          </pre>
        </article>
      </section>
    </div>
  );
};

export default TestDashboard;
