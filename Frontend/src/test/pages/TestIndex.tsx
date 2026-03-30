import { Link } from "react-router-dom";

const routes = [
  { href: "/test/login", label: "Test Login" },
  { href: "/test/register", label: "Test Register" },
  { href: "/test/dashboard", label: "Test Dashboard" },
  { href: "/test/page", label: "Test Page" },
  { href: "/test/page2", label: "Test Page 2" },
];

const TestIndex = () => {
  return (
    <div className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-4xl rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Test Namespace
        </div>
        <h1 className="text-3xl font-bold text-foreground">Legacy Merge Sandbox</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          This area is reserved for old-app routes that we want to merge carefully without
          disturbing the current app.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className="rounded-xl border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestIndex;
