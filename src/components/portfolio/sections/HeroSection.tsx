interface HeroContent {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
  bgType?: "gradient" | "image" | "solid" | "video";
  bgValue?: string;
  imageUrl?: string;
  layout?: "centered" | "split-left" | "split-right" | "fullscreen";
}

interface Props {
  content: Record<string, unknown>;
  variant: string;
}

export function HeroSection({ content, variant }: Props) {
  const c = content as HeroContent;
  const layout = c.layout ?? "centered";
  const isSplit = layout === "split-left" || layout === "split-right";
  const isFullscreen = layout === "fullscreen";

  return (
    <section
      className={[
        "relative w-full overflow-hidden",
        isFullscreen
          ? "min-h-screen flex items-center"
          : isSplit
          ? "min-h-[85vh] flex items-center"
          : "py-(--section-padding-y,6rem)",
        "bg-(--color-background,#fff)",
      ].join(" ")}
    >
      {/* Background layer */}
      {c.bgType === "image" && c.bgValue && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${c.bgValue})` }}
        >
          <div className="absolute inset-0 bg-(--color-background,#fff)/80" />
        </div>
      )}

      {/* Decorative blob — centered & fullscreen layouts */}
      {!isSplit && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: "var(--color-primary,#6C63FF)", filter: "blur(80px)" }}
        />
      )}

      <div
        className={[
          "relative z-10 mx-auto w-full px-6",
          "max-w-(--container-max-width,1200px)",
          isSplit
            ? layout === "split-right"
              ? "flex flex-col-reverse md:flex-row-reverse items-center gap-12"
              : "flex flex-col-reverse md:flex-row items-center gap-12"
            : "flex flex-col items-center text-center",
        ].join(" ")}
      >
        {/* Text block */}
        <div className={isSplit ? "flex-1 space-y-6" : "max-w-3xl space-y-6"}>
          {/* Eyebrow */}
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-(--color-primary,#6C63FF) opacity-80">
            {variant === "agency" ? "Creative Agency" : "Portfolio"}
          </span>

          <h1
            className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] font-(--font-weight-heading,700) tracking-(--letter-spacing-heading,-0.02em)"
            style={{
              fontFamily: "var(--font-heading,sans-serif)",
              color: "var(--color-heading,#111)",
            }}
          >
            {c.headline ?? "مرحباً، أنا هنا"}
          </h1>

          {c.subheadline && (
            <p
              className="text-lg leading-(--line-height-body,1.7) max-w-xl"
              style={{ color: "var(--color-text-secondary,#555)" }}
            >
              {c.subheadline}
            </p>
          )}

          {/* CTA row */}
          <div className={`flex gap-4 flex-wrap ${!isSplit ? "justify-center" : ""}`}>
            {c.ctaText && (
              <a
                href={c.ctaUrl ?? "#contact"}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-(--radius-md,8px) font-medium text-white transition-all duration-(--transition-speed,0.2s) hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: "var(--color-primary,#6C63FF)" }}
              >
                {c.ctaText}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            )}
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-(--radius-md,8px) font-medium border border-(--color-border,#e5e5e5) transition-all duration-(--transition-speed,0.2s) hover:border-(--color-primary,#6C63FF) hover:text-(--color-primary,#6C63FF)"
              style={{ color: "var(--color-text-primary,#111)" }}
            >
              أعمالي
            </a>
          </div>
        </div>

        {/* Image — split layouts only */}
        {isSplit && c.imageUrl && (
          <div className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Ring decoration */}
              <div
                className="absolute inset-0 rounded-full border-2 border-(--color-primary,#6C63FF) opacity-20 scale-110"
              />
              <img
                src={c.imageUrl}
                alt="hero"
                className="relative z-10 w-full h-full object-cover rounded-full shadow-(--shadow-card)"
              />
            </div>
          </div>
        )}

        {/* Floating stats — centered layout only */}
        {!isSplit && !isFullscreen && (
          <div className="flex gap-8 mt-4 pt-8 border-t border-(--color-border,#e5e5e5) w-full max-w-sm justify-center">
            {[
              { value: "5+", label: "سنوات خبرة" },
              { value: "50+", label: "مشروع" },
              { value: "30+", label: "عميل" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-primary,#6C63FF)", fontFamily: "var(--font-heading,sans-serif)" }}
                >
                  {value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary,#555)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      {isFullscreen && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs tracking-widest" style={{ color: "var(--color-text-secondary,#555)" }}>scroll</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10l6 6 6-6" stroke="var(--color-text-secondary,#555)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </section>
  );
}