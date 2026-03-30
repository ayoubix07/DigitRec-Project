import TestRolePage from "../components/TestRolePage";
import { companyCandidates } from "../lib/testWorkspace";
import "../styles/test-workspace.css";

const TestCandidatesPage = () => {
  return (
    <TestRolePage allow={["company"]}>
      {() => (
        <div className="legacy-workspace">
          <section className="legacy-workspace__hero">
            <div>
              <div className="legacy-workspace__eyebrow">Espace entreprise</div>
              <h1 className="legacy-workspace__title">Candidats</h1>
              <p className="legacy-workspace__subtitle">
                Suivez ici les profils en cours, leur progression et leur niveau d'adéquation
                avec les postes ouverts.
              </p>
            </div>
            <div className="legacy-workspace__hero-pill">{companyCandidates.length} en cours</div>
          </section>

          <section className="legacy-workspace__stack">
            {companyCandidates.map((candidate) => (
              <article key={candidate.id} className="legacy-workspace__panel">
                <div className="legacy-workspace__panel-header">
                  <div>
                    <h2>{candidate.name}</h2>
                    <span>{candidate.title}</span>
                  </div>
                  <div className="legacy-workspace__badges">
                    <span className="legacy-workspace__badge legacy-workspace__badge--violet">{candidate.stage}</span>
                    <span className="legacy-workspace__badge">{candidate.fit}</span>
                  </div>
                </div>
                <p className="legacy-workspace__description">{candidate.note}</p>
              </article>
            ))}
          </section>
        </div>
      )}
    </TestRolePage>
  );
};

export default TestCandidatesPage;
