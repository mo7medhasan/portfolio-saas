// Sticky page-level header — title + optional actions slot.
interface Props {
  title:        string;
  description?: string;
  actions?:     React.ReactNode;
}

export function TopBar({ title, description, actions }: Props) {
  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-6 h-14 border-b border-[var(--color-border,#e5e5e5)] shrink-0"
      style={{ background: "var(--color-background,#fff)" }}
    >
      <div className="min-w-0">
        <h1
          className="text-sm font-semibold leading-tight truncate"
          style={{ fontFamily: "var(--font-heading,sans-serif)", color: "var(--color-heading,#111)" }}
        >
          {title}
        </h1>
        {description && (
          <p className="text-xs mt-px truncate" style={{ color: "var(--color-text-secondary,#555)" }}>
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {actions}
        </div>
      )}
    </header>
  );
}
