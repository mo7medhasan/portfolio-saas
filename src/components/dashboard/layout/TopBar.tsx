// Page-level header — title + page-specific actions slot
interface Props {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, description, actions }: Props) {
  return (
    <div
      className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border,#e5e5e5)] sticky top-0 z-20"
      style={{ background: "var(--color-background,#fff)" }}
    >
      <div>
        <h1
          className="text-base font-semibold leading-tight"
          style={{ fontFamily: "var(--font-heading,sans-serif)", color: "var(--color-heading,#111)" }}
        >
          {title}
        </h1>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary,#555)" }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
