import TestRolePage from "../components/TestRolePage";
import { formatAccountType } from "../lib/testWorkspace";
import "../styles/test-workspace.css";

function formatDate(value: unknown) {
  if (typeof value !== "string" || !value) return "Non disponible";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Non disponible";

  return date.toLocaleString();
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "Non disponible";
  }

  return String(value);
}

const TestProfile = () => {
  return (
    <TestRolePage>
      {(account) => {
        const authFields = [
          { label: "Type de compte", value: formatAccountType(account.accountType) },
          { label: "Email", value: account.authUser.email },
          { label: "Dernière connexion", value: formatDate(account.authUser.last_sign_in_at) },
          { label: "Date de création", value: formatDate(account.authUser.created_at) },
          { label: "Email confirmé le", value: formatDate(account.authUser.email_confirmed_at) },
        ];

        const profileFields =
          account.accountType === "candidate"
            ? [
                { label: "Prénom", value: account.profile?.prenom },
                { label: "Nom", value: account.profile?.nom },
                { label: "CIN", value: account.profile?.cin },
                { label: "Intitulé", value: account.profile?.title },
                { label: "Profil", value: account.profile?.profile },
                { label: "Niveau", value: account.profile?.level },
                { label: "CV", value: account.profile?.cv_url },
              ]
            : [
                { label: "Nom de l'entreprise", value: account.profile?.nom },
                { label: "Email professionnel", value: account.profile?.email_prof || account.authUser.email },
                { label: "Logo", value: account.profile?.logo_url },
              ];

        return (
          <div className="legacy-workspace">
            <section className="legacy-workspace__hero">
              <div>
                <div className="legacy-workspace__eyebrow">Mon profil</div>
                <h1 className="legacy-workspace__title">Profil</h1>
                <p className="legacy-workspace__subtitle">
                  Retrouvez ici vos informations principales, vos coordonnées et les éléments
                  associés à votre profil.
                </p>
              </div>
              <div className="legacy-workspace__hero-pill">{formatAccountType(account.accountType)}</div>
            </section>

            <section className="legacy-workspace__split">
              <article className="legacy-workspace__panel">
                <div className="legacy-workspace__panel-header">
                  <h2>Informations du compte</h2>
                  <span>Résumé</span>
                </div>
                <div className="legacy-workspace__list">
                  {authFields.map((field) => (
                    <div key={field.label} className="legacy-workspace__list-row">
                      <div className="legacy-workspace__label">{field.label}</div>
                      <div className="legacy-workspace__value">{formatValue(field.value)}</div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="legacy-workspace__panel">
                <div className="legacy-workspace__panel-header">
                  <h2>Informations du profil</h2>
                  <span>Coordonnées</span>
                </div>
                <div className="legacy-workspace__list">
                  {profileFields.map((field) => (
                    <div key={field.label} className="legacy-workspace__list-row">
                      <div className="legacy-workspace__label">{field.label}</div>
                      <div className="legacy-workspace__value">{formatValue(field.value)}</div>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </div>
        );
      }}
    </TestRolePage>
  );
};

export default TestProfile;
