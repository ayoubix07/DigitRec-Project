import TestRolePage from "../components/TestRolePage";
import { candidateWrittenTests } from "../lib/testWorkspace";
import "../styles/test-workspace.css";

const TestWrittenTestsPage = () => {
  return (
    <TestRolePage allow={["candidate"]}>
      {() => (
        <div className="legacy-workspace">
          <section className="legacy-workspace__hero">
            <div>
              <div className="legacy-workspace__eyebrow">Espace candidat</div>
              <h1 className="legacy-workspace__title">Mes tests écrits</h1>
              <p className="legacy-workspace__subtitle">
                Retrouvez vos évaluations écrites, leurs résultats et les sessions à venir.
              </p>
            </div>
            <div className="legacy-workspace__hero-pill">{candidateWrittenTests.length} éléments</div>
          </section>

          <section className="legacy-workspace__stack">
            {candidateWrittenTests.map((test) => (
              <article key={test.id} className="legacy-workspace__panel">
                <div className="legacy-workspace__panel-header">
                  <div>
                    <h2>{test.candidature}</h2>
                    <span>{test.takenAt}</span>
                  </div>
                  <div className="legacy-workspace__badges">
                    <span className="legacy-workspace__badge legacy-workspace__badge--amber">{test.status}</span>
                    <span className="legacy-workspace__badge">{test.score}</span>
                  </div>
                </div>
                <p className="legacy-workspace__description">{test.details}</p>
              </article>
            ))}
          </section>
        </div>
      )}
    </TestRolePage>
  );
};

export default TestWrittenTestsPage;
