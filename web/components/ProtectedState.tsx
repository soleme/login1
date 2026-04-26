import Link from "next/link";

type ProtectedStateProps = {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
};

export function ProtectedState({
  title,
  message,
  actionHref = "/login",
  actionLabel = "Sign in",
}: ProtectedStateProps) {
  return (
    <section className="center-panel">
      <div className="utility-card narrow">
        <p className="eyebrow">Access</p>
        <h1>{title}</h1>
        <p className="muted">{message}</p>
        <Link className="pill-button" href={actionHref}>
          {actionLabel}
        </Link>
      </div>
    </section>
  );
}
