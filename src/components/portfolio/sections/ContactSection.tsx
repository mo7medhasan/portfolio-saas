"use client";

import { JSX, useState } from "react";

interface ContactContent {
  heading?: string;
  subheading?: string;
  email?: string;
  phone?: string;
  showForm?: boolean;
  layout?: "default" | "split" | "minimal";
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    behance?: string;
    dribbble?: string;
  };
}

interface Props {
  content: Record<string, unknown>;
  variant: string;
}

type FormState = "idle" | "loading" | "success" | "error";

const socialIcons: Record<string, JSX.Element> = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
};

export function ContactSection({ content }: Props) {
  const c = content as ContactContent;
  const showForm = c.showForm !== false;
  const socials = c.socialLinks ?? {};
  const activeSocials = Object.entries(socials).filter(([, v]) => !!v);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          portfolioSlug: window.location.pathname.slice(1),
        }),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section
      id="contact"
      className="py-(--section-padding-y,6rem) bg-(--color-surface,#f8f8f8)"
    >
      <div className="mx-auto max-w-(--container-max-width,1200px) px-6">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-14">
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ color: "var(--color-primary,#6C63FF)" }}
          >
            {c.heading ?? "تواصل معي"}
          </span>
          <div className="flex-1 h-px bg-(--color-border,#e5e5e5)" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left — info */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h2
                className="text-[clamp(1.75rem,3vw,2.75rem)] leading-tight font-(--font-weight-heading,700)"
                style={{
                  fontFamily: "var(--font-heading,sans-serif)",
                  color: "var(--color-heading,#111)",
                }}
              >
                خليني أسمع منك
              </h2>
              {c.subheading && (
                <p
                  className="text-base leading-(--line-height-body,1.7)"
                  style={{ color: "var(--color-text-secondary,#555)" }}
                >
                  {c.subheading}
                </p>
              )}
            </div>

            {/* Contact info cards */}
            <div className="space-y-4">
              {c.email && (
                <a
                  href={`mailto:${c.email}`}
                  className="flex items-center gap-4 p-4 rounded-(--radius-lg,16px) border border-(--color-border,#e5e5e5) transition-all duration-(--transition-speed,0.2s) hover:border-(--color-primary,#6C63FF) hover:-translate-y-0.5 group"
                  style={{ background: "var(--color-background,#fff)" }}
                >
                  <div
                    className="w-11 h-11 rounded-(--radius-md,8px) flex items-center justify-center flex-shrink-0"
                    style={{ background: "color-mix(in srgb, var(--color-primary,#6C63FF) 10%, transparent)" }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary,#6C63FF)" strokeWidth="1.5">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs mb-0.5" style={{ color: "var(--color-text-secondary,#555)" }}>إيميل</div>
                    <div
                      className="text-sm font-medium transition-colors group-hover:text-(--color-primary,#6C63FF)"
                      style={{ color: "var(--color-text-primary,#111)" }}
                    >
                      {c.email}
                    </div>
                  </div>
                </a>
              )}

              {c.phone && (
                <a
                  href={`tel:${c.phone}`}
                  className="flex items-center gap-4 p-4 rounded-(--radius-lg,16px) border border-(--color-border,#e5e5e5) transition-all duration-(--transition-speed,0.2s) hover:border-(--color-primary,#6C63FF) hover:-translate-y-0.5 group"
                  style={{ background: "var(--color-background,#fff)" }}
                >
                  <div
                    className="w-11 h-11 rounded-(--radius-md,8px) flex items-center justify-center flex-shrink-0"
                    style={{ background: "color-mix(in srgb, var(--color-primary,#6C63FF) 10%, transparent)" }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary,#6C63FF)" strokeWidth="1.5">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs mb-0.5" style={{ color: "var(--color-text-secondary,#555)" }}>هاتف</div>
                    <div
                      className="text-sm font-medium transition-colors group-hover:text-(--color-primary,#6C63FF)"
                      style={{ color: "var(--color-text-primary,#111)" }}
                    >
                      {c.phone}
                    </div>
                  </div>
                </a>
              )}
            </div>

            {/* Social links */}
            {activeSocials.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--color-text-secondary,#555)" }}>
                  تابعني
                </p>
                <div className="flex gap-3">
                  {activeSocials.map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-(--radius-md,8px) border border-(--color-border,#e5e5e5) flex items-center justify-center transition-all duration-(--transition-speed,0.2s) hover:border-(--color-primary,#6C63FF) hover:text-(--color-primary,#6C63FF) hover:-translate-y-0.5"
                      style={{ color: "var(--color-text-secondary,#555)", background: "var(--color-background,#fff)" }}
                    >
                      {socialIcons[platform] ?? <span className="text-xs">{platform[0].toUpperCase()}</span>}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — form */}
          {showForm && (
            <div
              className="p-8 rounded-(--radius-lg,16px) border border-(--color-border,#e5e5e5)"
              style={{
                background: "var(--color-background,#fff)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {state === "success" ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "color-mix(in srgb, var(--color-primary,#6C63FF) 10%, transparent)" }}
                  >
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary,#6C63FF)" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-semibold"
                    style={{ fontFamily: "var(--font-heading,sans-serif)", color: "var(--color-heading,#111)" }}
                  >
                    تم الإرسال!
                  </h3>
                  <p className="text-sm" style={{ color: "var(--color-text-secondary,#555)" }}>
                    شكراً لتواصلك، هرد عليك في أقرب وقت.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label
                      className="block text-sm font-medium"
                      style={{ color: "var(--color-text-primary,#111)" }}
                    >
                      الاسم
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="اسمك الكريم"
                      className="w-full px-4 py-3 text-sm rounded-(--radius-md,8px) border border-(--color-border,#e5e5e5) outline-none transition-all duration-(--transition-speed,0.2s) focus:border-(--color-primary,#6C63FF) focus:ring-2 focus:ring-(--color-primary,#6C63FF)/10"
                      style={{
                        background: "var(--color-surface,#f8f8f8)",
                        color: "var(--color-text-primary,#111)",
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      className="block text-sm font-medium"
                      style={{ color: "var(--color-text-primary,#111)" }}
                    >
                      الإيميل
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="example@email.com"
                      className="w-full px-4 py-3 text-sm rounded-(--radius-md,8px) border border-(--color-border,#e5e5e5) outline-none transition-all duration-(--transition-speed,0.2s) focus:border-(--color-primary,#6C63FF) focus:ring-2 focus:ring-(--color-primary,#6C63FF)/10"
                      style={{
                        background: "var(--color-surface,#f8f8f8)",
                        color: "var(--color-text-primary,#111)",
                      }}
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label
                      className="block text-sm font-medium"
                      style={{ color: "var(--color-text-primary,#111)" }}
                    >
                      الرسالة
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="اكتب رسالتك هنا..."
                      className="w-full px-4 py-3 text-sm rounded-(--radius-md,8px) border border-(--color-border,#e5e5e5) outline-none transition-all duration-(--transition-speed,0.2s) focus:border-(--color-primary,#6C63FF) focus:ring-2 focus:ring-(--color-primary,#6C63FF)/10 resize-none"
                      style={{
                        background: "var(--color-surface,#f8f8f8)",
                        color: "var(--color-text-primary,#111)",
                      }}
                    />
                  </div>

                  {state === "error" && (
                    <p className="text-sm text-red-500">
                      حصل خطأ، حاول تاني.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="w-full py-3.5 px-6 rounded-(--radius-md,8px) text-sm font-medium text-white transition-all duration-(--transition-speed,0.2s) hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: "var(--color-primary,#6C63FF)" }}
                  >
                    {state === "loading" ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        جاري الإرسال...
                      </span>
                    ) : (
                      "إرسال الرسالة"
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}