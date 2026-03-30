type TestRoutePlaceholderProps = {
  title: string;
  description: string;
};

const TestRoutePlaceholder = ({ title, description }: TestRoutePlaceholderProps) => {
  return (
    <div className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Test Namespace
        </div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default TestRoutePlaceholder;
