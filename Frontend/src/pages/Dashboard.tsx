import RolePage from "../components/RolePage";
import {
  candidateApplications,
  companyCandidates,
  companyOffers,
  getDashboardMetrics,
} from "../lib/workspace";
import "../styles/dashboard.css";
import "../styles/workspace.css";

const Dashboard = () => {
  return (
    <RolePage>
      {(account) => {
        const metrics = getDashboardMetrics(account.accountType);
        const spotlightItems =
          account.accountType === "candidate"
            ? [
                `Votre candidature pour ${candidateApplications[0]?.offerTitle} est actuellement a l'etape ${candidateApplications[0]?.stage}.`,
                "Retrouvez ici l'etat de vos candidatures et les prochaines etapes a suivre.",
                "Accedez rapidement a votre profil, a vos tests et a vos documents.",
              ]
            : [
                `${companyOffers[0]?.title} est l'offre la plus active de votre espace.`,
                `${companyCandidates[0]?.name} fait partie des profils les plus avances de votre suivi.`,
                "Suivez vos offres, vos candidats et les prochaines actions depuis ce tableau de bord.",
              ];

        const quickLinks =
          account.accountType === "candidate"
            ? [
                { label: "Offres", value: "Consultez les opportunites disponibles et leurs criteres principaux." },
                { label: "Candidatures", value: "Suivez l'avancement de vos dossiers et leurs statuts." },
                { label: "Tests", value: "Retrouvez vos evaluations ecrites et orales au meme endroit." },
              ]
            : [
                { label: "Mes offres", value: "Retrouvez vos postes ouverts et leur niveau d'activite." },
                { label: "Candidats", value: "Consultez les profils en cours et leur progression." },
                { label: "Profil", value: "Accedez aux informations generales de votre compte." },
              ];

        const roleLabel =
          account.accountType === "candidate"
            ? "Candidat"
            : account.accountType === "company"
              ? "Entreprise"
              : "Compte";

        const workspaceFocus =
          account.accountType === "candidate"
            ? "Suivi des offres et candidatures"
            : account.accountType === "company"
              ? "Pilotage des offres et candidats"
              : "Vue d'ensemble";

        return (
          <div className="legacy-workspace">
            <section className="legacy-dashboard-hero">
              <div>
                <div className="legacy-dashboard-hero__eyebrow">Tableau de bord</div>
                <h1 className="legacy-dashboard-hero__title">{account.displayName}</h1>
                <p className="legacy-dashboard-hero__subtitle">id : {account.authUser.id}</p>
                <p className="legacy-dashboard-hero__subtitle">
                  Bienvenue sur votre tableau de bord. Vous pouvez y retrouver vos chiffres cles,
                  suivre votre activite et acceder rapidement aux sections principales.
                </p>
              </div>
              <div className="legacy-dashboard-hero__meta">
                <div className="legacy-dashboard-hero__pill">{roleLabel}</div>
                <div className="legacy-dashboard-hero__id-card">
                  <div className="legacy-dashboard-hero__id-label">Vue principale</div>
                  <div className="legacy-dashboard-hero__id-value">{workspaceFocus}</div>
                </div>
              </div>
            </section>

            <section className="legacy-workspace__metrics">
              {metrics.map((metric) => (
                <article
                  key={metric.label}
                  className={`legacy-workspace__panel legacy-workspace__metric legacy-workspace__metric--${metric.tone || "sky"}`}
                >
                  <div className="legacy-workspace__label">{metric.label}</div>
                  <div className="legacy-workspace__metric-value">{metric.value}</div>
                </article>
              ))}
            </section>

            <section className="legacy-workspace__split">
              <article className="legacy-workspace__panel">
                <div className="legacy-workspace__panel-header">
                  <h2>Apercu</h2>
                  <span>Activite</span>
                </div>
                <div className="legacy-workspace__list">
                  {spotlightItems.map((item) => (
                    <div key={item} className="legacy-workspace__list-row">
                      <div className="legacy-workspace__value">{item}</div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="legacy-workspace__panel">
                <div className="legacy-workspace__panel-header">
                  <h2>Acces rapides</h2>
                  <span>Navigation</span>
                </div>
                <div className="legacy-workspace__list">
                  {quickLinks.map((item) => (
                    <div key={item.label} className="legacy-workspace__list-row">
                      <div className="legacy-workspace__label">{item.label}</div>
                      <div className="legacy-workspace__value">{item.value}</div>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </div>
        );
      }}
    </RolePage>
  );
};

export default Dashboard;
