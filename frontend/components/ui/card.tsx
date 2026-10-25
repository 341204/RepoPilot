import { clsx } from "clsx";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={clsx("min-w-0 rounded-xl border border-line bg-surface p-5", className)}>
      {children}
    </section>
  );
}

export function PageTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 flex flex-col gap-2 border-b border-line/80 pb-5">
      <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">RepoPilot / Workspace</div>
      <h1 className="text-2xl font-semibold tracking-normal text-ink md:text-3xl">{title}</h1>
      <p className="max-w-3xl text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

export function PrimaryButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "repo-choice w-full rounded-md border border-line bg-surface px-3 py-2 text-left text-sm text-ink transition hover:border-accent/25 hover:bg-accent-soft hover:text-accent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
