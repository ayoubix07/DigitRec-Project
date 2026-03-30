import TestRolePage from "../components/TestRolePage";
import { candidateOralTests } from "../lib/testWorkspace";
import "../styles/test-workspace.css";

const TestOralTestsPage = () => {
  return (
    <TestRolePage allow={["candidate"]}>
      {() => (
        <div className="legacy-workspace">
          <section className="legacy-workspace__hero">
            <div>
              <div className="legacy-workspace__eyebrow">Espace candidat</div>
              <h1 className="legacy-workspace__title">Mes tests oraux</h1>
              <p className="legacy-workspace__subtitle">
                Consultez vos évaluations orales, leurs statuts et les informations utiles
                associées à chaque entretien.
              </p>
            </div>
            <div className="legacy-workspace__hero-pill">{candidateOralTests.length} éléments</div>
          </section>

          <section className="legacy-workspace__stack">
            {candidateOralTests.map((test) => (
              <article key={test.id} className="legacy-workspace__panel">
                <div className="legacy-workspace__panel-header">
                  <div>
                    <h2>{test.candidature}</h2>
                    <span>{test.takenAt}</span>
                  </div>
                  <div className="legacy-workspace__badges">
                    <span className="legacy-workspace__badge legacy-workspace__badge--emerald">{test.score}</span>
                    <span className="legacy-workspace__badge">{test.languageLevel}</span>
                  </div>
                </div>
                <p className="legacy-workspace__description">{test.question}</p>
                <div className="legacy-workspace__meta-grid">
                  <div>
                    <div className="legacy-workspace__label">Appréciation</div>
                    <div className="legacy-workspace__value">{test.sentiment}</div>
                  </div>
                  <div>
                    <div className="legacy-workspace__label">Observations</div>
                    <div className="legacy-workspace__value">{test.flags}</div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      )}
    </TestRolePage>
  );
};

export default TestOralTestsPage;
