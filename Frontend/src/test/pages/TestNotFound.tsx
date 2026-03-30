import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "../styles/test-not-found.css";

const TestNotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("Test 404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="legacy-test-not-found">
      <div className="legacy-test-not-found__card">
        <div className="legacy-test-not-found__eyebrow">DigitRec Workspace</div>
        <h1 className="legacy-test-not-found__code">404</h1>
        <h2 className="legacy-test-not-found__title">This page doesn&apos;t exist here.</h2>
        <p className="legacy-test-not-found__subtitle">
          The address you opened does not match any page in this workspace. You can head back
          to the entry screen or jump straight into registration.
        </p>
        <div className="legacy-test-not-found__actions">
          <Link className="legacy-test-not-found__link legacy-test-not-found__link--primary" to="/test">
            Go to Workspace Home
          </Link>
          <Link className="legacy-test-not-found__link" to="/test/register">
            Open Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestNotFound;
