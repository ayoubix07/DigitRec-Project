import { ReactNode } from "react";
import "../styles/test-auth.css";

type TestAuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  heroStatLeft: string;
  heroStatRight: string;
  image: string;
  imageAlt: string;
  children: ReactNode;
};

const TestAuthShell = ({
  eyebrow,
  title,
  subtitle,
  heroStatLeft,
  heroStatRight,
  image,
  imageAlt,
  children,
}: TestAuthShellProps) => {
  return (
    <div className="legacy-auth-page">
      <div className="legacy-auth-shell">
        <section className="legacy-auth-hero">
          <div className="legacy-auth-hero__inner">
            <p className="legacy-auth-hero__eyebrow">{eyebrow}</p>
            <h1 className="legacy-auth-hero__title">{title}</h1>
            <p className="legacy-auth-hero__subtitle">{subtitle}</p>

            <div className="legacy-auth-hero__stats">
              <div className="legacy-auth-hero__stat">
                <span className="legacy-auth-hero__stat-value">{heroStatLeft}</span>
                <span className="legacy-auth-hero__stat-label">Product-ready identity</span>
              </div>
              <div className="legacy-auth-hero__stat">
                <span className="legacy-auth-hero__stat-value">{heroStatRight}</span>
                <span className="legacy-auth-hero__stat-label">Clean migration surface</span>
              </div>
            </div>
          </div>

          <div className="legacy-auth-hero__media">
            <img src={image} alt={imageAlt} />
          </div>
        </section>

        <section className="legacy-auth-card">{children}</section>
      </div>
    </div>
  );
};

export default TestAuthShell;
