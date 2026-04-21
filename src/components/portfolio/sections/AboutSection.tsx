interface AboutContent {
  heading?: string;
  bio?: string;
  photoUrl?: string;
  skills?: string[];
  layout?: "default" | "timeline" | "minimal";
  yearsExp?: string;
  projectsCount?: string;
  clientsCount?: string;
}

interface Props {
  content: Record<string, unknown>;
  variant: string;
}

export function AboutSection({ content }: Props) {
  const c = content as AboutContent;
  const layout = c.layout ?? "default";
  const skills = c.skills ?? [];

  // ── Minimal variant — text-only, editorial ────────────
  if (layout === "minimal") {
    return (
      <section
        className="py-[var(--section-padding-y,6rem)] bg-[var(--color-surface,#f8f8f8)]"
      >
        <div className="mx-auto max-w-[var(--container-max-width,1200px)] px-6">
          <div className="max-w-2xl">
            <span
              className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-6"
              style={{ color: "var(--color-primary,#6C63FF)" }}
            >
              {c.heading ?? "عني"}
            </span>
            <p
              className="text-2xl leading-relaxed"
              style={{
                fontFamily: "var(--font-heading,sans-serif)",
                color: "var(--color-heading,#111)",
              }}
            >
              {c.bio ?? "أكتب هنا نبذة عنك..."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ── Default variant — split photo + text ──────────────
  return (
    <section
      id="about"
      className="py-[var(--section-padding-y,6rem)] bg-[var(--color-background,#fff)]"
    >
      <div className="mx-auto max-w-[var(--container-max-width,1200px)] px-6">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-14">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: "var(--color-primary,#6C63FF)" }}
          >
            {c.heading ?? "عني"}
          </span>
          <div className="flex-1 h-px bg-[var(--color-border,#e5e5e5)]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Photo side */}
          <div className="relative flex justify-center">
            {c.photoUrl ? (
              <div className="relative">
                {/* Offset border decoration */}
                <div
                  className="absolute -bottom-4 -right-4 w-full h-full rounded-[var(--radius-lg,16px)] border-2"
                  style={{ borderColor: "var(--color-primary,#6C63FF)", opacity: 0.3 }}
                />
                <img
                  src={c.photoUrl}
                  alt="About"
                  className="relative z-10 w-full max-w-sm aspect-[4/5] object-cover rounded-[var(--radius-lg,16px)]"
                  style={{ boxShadow: "var(--shadow-card)" }}
                />

                {/* Floating stats card */}
                <div
                  className="absolute -bottom-6 -left-6 z-20 px-5 py-4 rounded-[var(--radius-md,8px)] shadow-lg"
                  style={{
                    background: "var(--color-primary,#6C63FF)",
                    boxShadow: "0 8px 32px color-mix(in srgb, var(--color-primary,#6C63FF) 30%, transparent)",
                  }}
                >
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading,sans-serif)" }}>
                    {c.yearsExp ?? "5"}+
                  </div>
                  <div className="text-xs text-white/80 mt-0.5">سنوات خبرة</div>
                </div>
              </div>
            ) : (
              /* Placeholder when no photo */
              <div
                className="w-full max-w-sm aspect-[4/5] rounded-[var(--radius-lg,16px)] flex items-center justify-center border-2 border-dashed"
                style={{ borderColor: "var(--color-border,#e5e5e5)" }}
              >
                <div className="text-center space-y-2">
                  <svg className="mx-auto w-12 h-12 opacity-30" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="18" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <p className="text-sm opacity-40" style={{ color: "var(--color-text-secondary,#555)" }}>
                    أضف صورتك
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Text side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2
                className="text-[clamp(1.75rem,3vw,2.75rem)] leading-tight font-[var(--font-weight-heading,700)]"
                style={{
                  fontFamily: "var(--font-heading,sans-serif)",
                  color: "var(--color-heading,#111)",
                }}
              >
                من أنا؟
              </h2>
              <p
                className="text-base leading-[var(--line-height-body,1.7)]"
                style={{ color: "var(--color-text-secondary,#555)" }}
              >
                {c.bio ?? "أكتب هنا نبذة عنك، خلفيتك، شغفك، وإيه اللي بيميزك."}
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-[var(--color-border,#e5e5e5)]">
              {[
                { value: c.projectsCount ?? "50+", label: "مشروع" },
                { value: c.clientsCount ?? "30+", label: "عميل" },
                { value: c.yearsExp ?? "5+", label: "سنة" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: "var(--font-heading,sans-serif)",
                      color: "var(--color-primary,#6C63FF)",
                    }}
                  >
                    {value}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--color-text-secondary,#555)" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="space-y-3">
                <h3
                  className="text-sm font-semibold tracking-wider uppercase"
                  style={{ color: "var(--color-text-secondary,#555)" }}
                >
                  مهاراتي
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm rounded-[var(--radius-full,9999px)] border border-[var(--color-border,#e5e5e5)] transition-colors duration-[var(--transition-speed,0.2s)] hover:border-[var(--color-primary,#6C63FF)] hover:text-[var(--color-primary,#6C63FF)] cursor-default"
                      style={{ color: "var(--color-text-primary,#111)" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm font-medium group"
              style={{ color: "var(--color-primary,#6C63FF)" }}
            >
              تواصل معي
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                viewBox="0 0 16 16" fill="none"
              >
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}