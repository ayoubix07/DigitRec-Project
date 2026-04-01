import RolePage from "../components/RolePage";
import { candidateOffers, companyOffers, formatAccountType } from "../lib/workspace";
import "../styles/workspace.css";

const Offers = () => {
  return (
    <RolePage allow={["candidate", "company"]}>
      {(account) => {
        if (account.accountType === "candidate") {
          return (
            <div className="legacy-workspace">
              <section className="legacy-workspace__hero">
                <div>
                  <div className="legacy-workspace__eyebrow">Espace candidat</div>
                  <h1 className="legacy-workspace__title">Offres</h1>
                  <p className="legacy-workspace__subtitle">
                    Consultez les opportunités disponibles, comparez leurs critères et repérez
                    rapidement les offres qui correspondent à votre profil.
                  </p>
                </div>
                <div className="legacy-workspace__hero-pill">{formatAccountType(account.accountType)}</div>
              </section>

              <section className="legacy-workspace__stack">
                {candidateOffers.map((offer) => (
                  <article key={offer.id} className="legacy-workspace__panel">
                    <div className="legacy-workspace__panel-header">
                      <div>
                        <h2>{offer.title}</h2>
                        <span>{offer.company}</span>
                      </div>
                      <div className="legacy-workspace__badges">
                        <span className="legacy-workspace__badge legacy-workspace__badge--sky">{offer.status}</span>
                        <span className="legacy-workspace__badge">{offer.examType}</span>
                      </div>
                    </div>
                    <div className="legacy-workspace__meta-grid">
                      <div>
                        <div className="legacy-workspace__label">Département</div>
                        <div className="legacy-workspace__value">{offer.department}</div>
                      </div>
                      <div>
                        <div className="legacy-workspace__label">Niveau</div>
                        <div className="legacy-workspace__value">{offer.level}</div>
                      </div>
                      <div>
                        <div className="legacy-workspace__label">Expérience</div>
                        <div className="legacy-workspace__value">{offer.experience}</div>
                      </div>
                      <div>
                        <div className="legacy-workspace__label">Clôture</div>
                        <div className="legacy-workspace__value">{offer.closeDate}</div>
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            </div>
          );
        }

        return (
          <div className="legacy-workspace">
            <section className="legacy-workspace__hero">
              <div>
                <div className="legacy-workspace__eyebrow">Espace entreprise</div>
                <h1 className="legacy-workspace__title">Mes offres</h1>
                <p className="legacy-workspace__subtitle">
                  Retrouvez ici vos offres publiées, leur état et leur niveau d'activité.
                </p>
              </div>
              <div className="legacy-workspace__hero-pill">{formatAccountType(account.accountType)}</div>
            </section>

            <section className="legacy-workspace__stack">
              {companyOffers.map((offer) => (
                <article key={offer.id} className="legacy-workspace__panel">
                  <div className="legacy-workspace__panel-header">
                    <div>
                      <h2>{offer.title}</h2>
                      <span>{offer.department}</span>
                    </div>
                    <div className="legacy-workspace__badges">
                      <span className="legacy-workspace__badge legacy-workspace__badge--emerald">{offer.status}</span>
                      <span className="legacy-workspace__badge">{offer.examType}</span>
                    </div>
                  </div>
                  <div className="legacy-workspace__meta-grid">
                    <div>
                      <div className="legacy-workspace__label">Niveau</div>
                      <div className="legacy-workspace__value">{offer.level}</div>
                    </div>
                    <div>
                      <div className="legacy-workspace__label">Candidats</div>
                      <div className="legacy-workspace__value">{offer.candidates}</div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>
        );
      }}
    </RolePage>
  );
};

export default Offers;
