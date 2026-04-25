"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ExternalLink } from "lucide-react";
import type { PortfolioSettings } from "@/db/schema";

// ── Shared field primitives ───────────────────────────────────────────────────
const inputCls = [
  "w-full px-3.5 py-2.5 text-sm rounded-(--radius-md,8px)",
  "border border-(--color-border,#e5e5e5) outline-none",
  "transition-all focus:border-(--color-primary,#6C63FF)",
  "focus:ring-2 focus:ring-(--color-primary,#6C63FF)/10",
  "bg-(--color-surface,#f8f8f8)",
].join(" ");

const textareaCls = `${inputCls} resize-none font-mono text-xs`;

function Field({
  label, hint, counter, children,
}: {
  label: string; hint?: string; counter?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-(--color-text-primary,#111)">{label}</label>
        {counter && <span className="text-xs text-(--color-text-secondary,#555)">{counter}</span>}
      </div>
      {hint && <p className="text-xs text-(--color-text-secondary,#555)">{hint}</p>}
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2
        className="text-sm font-semibold uppercase tracking-wider text-(--color-text-secondary,#555)"
        style={{ opacity: 0.7 }}
      >
        {title}
      </h2>
      <div className="space-y-4 p-4 rounded-(--radius-lg,16px) border border-(--color-border,#e5e5e5) bg-(--color-background,#fff)">
        {children}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  portfolioId: string;
  slug:        string;
  settings:    PortfolioSettings;
}

export function SeoEditor({ portfolioId, slug, settings: initial }: Props) {
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [tab,    setTab]    = useState<"meta" | "og" | "scripts" | "analytics">("meta");

  const [form, setForm] = useState({
    metaTitle:            initial.metaTitle            ?? "",
    metaDescription:      initial.metaDescription      ?? "",
    metaKeywords:         initial.metaKeywords         ?? "",
    ogTitle:              initial.ogTitle              ?? "",
    ogDescription:        initial.ogDescription        ?? "",
    ogImageUrl:           initial.ogImageUrl           ?? "",
    twitterHandle:        initial.twitterHandle        ?? "",
    robotsDirective:      initial.robotsDirective      ?? "index, follow",
    headScripts:          initial.headScripts          ?? "",
    bodyEndScripts:       initial.bodyEndScripts       ?? "",
    customCss:            initial.customCss            ?? "",
    googleAnalyticsId:    initial.googleAnalyticsId    ?? "",
    googleTagManagerId:   initial.googleTagManagerId   ?? "",
    facebookPixelId:      initial.facebookPixelId      ?? "",
  });

  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  async function handleSave() {
    setSaving(true); setSaved(false);
    await fetch("/api/seo", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    });
    router.refresh();
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const TABS = [
    { id: "meta",      label: "Metadata" },
    { id: "og",        label: "Open Graph" },
    { id: "scripts",   label: "Scripts & CSS" },
    { id: "analytics", label: "Analytics" },
  ] as const;

  return (
    <div className="space-y-6">

      {/* Preview link */}
      <a
        href={`/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-(--color-primary,#6C63FF) hover:underline"
      >
        <ExternalLink size={12} /> Preview portfolio
      </a>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 rounded-(--radius-lg,16px) bg-(--color-surface,#f8f8f8)">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 py-2 text-xs font-medium rounded-(--radius-md,8px) transition-all"
            style={{
              background: tab === t.id ? "var(--color-background,#fff)" : "transparent",
              color:      tab === t.id ? "var(--color-primary,#6C63FF)"  : "var(--color-text-secondary,#555)",
              boxShadow:  tab === t.id ? "0 1px 3px rgba(0,0,0,.08)"    : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Metadata tab ───────────────────────────────────────── */}
      {tab === "meta" && (
        <div className="space-y-6">
          <Section title="Page Title & Description">
            <Field
              label="Meta Title"
              hint="Shown in browser tab and Google results"
              counter={`${form.metaTitle.length}/60`}
            >
              <input
                type="text"
                value={form.metaTitle}
                maxLength={60}
                onChange={e => set("metaTitle", e.target.value)}
                placeholder="My Portfolio — Mohamed"
                className={inputCls}
                style={{ color: "var(--color-text-primary,#111)" }}
              />
            </Field>

            <Field
              label="Meta Description"
              hint="Shown in Google search results"
              counter={`${form.metaDescription.length}/160`}
            >
              <textarea
                value={form.metaDescription}
                maxLength={160}
                onChange={e => set("metaDescription", e.target.value)}
                placeholder="Frontend engineer specializing in React and Next.js"
                rows={3}
                className={textareaCls}
                style={{ color: "var(--color-text-primary,#111)" }}
              />
            </Field>

            <Field label="Keywords" hint="Comma-separated (optional — not heavily used by Google)">
              <input
                type="text"
                value={form.metaKeywords}
                onChange={e => set("metaKeywords", e.target.value)}
                placeholder="frontend, react, nextjs, typescript"
                className={inputCls}
                style={{ color: "var(--color-text-primary,#111)" }}
              />
            </Field>
          </Section>

          <Section title="Robots">
            <Field label="Robots Directive" hint="Controls how search engines index your portfolio">
              <select
                value={form.robotsDirective}
                onChange={e => set("robotsDirective", e.target.value)}
                className={inputCls}
                style={{ color: "var(--color-text-primary,#111)" }}
              >
                <option value="index, follow">index, follow — recommended</option>
                <option value="noindex, nofollow">noindex, nofollow — hide from search</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, follow">noindex, follow</option>
              </select>
            </Field>
          </Section>
        </div>
      )}

      {/* ── Open Graph tab ─────────────────────────────────────── */}
      {tab === "og" && (
        <div className="space-y-6">
          <Section title="Open Graph (Facebook, LinkedIn, WhatsApp)">
            <Field
              label="OG Title"
              hint="Leave blank to use Meta Title"
              counter={`${form.ogTitle.length}/60`}
            >
              <input
                type="text"
                value={form.ogTitle}
                maxLength={60}
                onChange={e => set("ogTitle", e.target.value)}
                placeholder="Same as meta title"
                className={inputCls}
                style={{ color: "var(--color-text-primary,#111)" }}
              />
            </Field>

            <Field
              label="OG Description"
              hint="Leave blank to use Meta Description"
              counter={`${form.ogDescription.length}/160`}
            >
              <textarea
                value={form.ogDescription}
                maxLength={160}
                onChange={e => set("ogDescription", e.target.value)}
                placeholder="Same as meta description"
                rows={3}
                className={textareaCls}
                style={{ color: "var(--color-text-primary,#111)" }}
              />
            </Field>

            <Field
              label="OG Image URL"
              hint="Recommended: 1200×630 px. Leave blank to auto-generate."
            >
              <input
                type="text"
                value={form.ogImageUrl}
                onChange={e => set("ogImageUrl", e.target.value)}
                placeholder="https://... or leave blank for auto"
                className={inputCls}
                style={{ color: "var(--color-text-primary,#111)" }}
              />
              {form.ogImageUrl && (
                <div className="mt-2 h-28 rounded-(--radius-md,8px) overflow-hidden border border-(--color-border,#e5e5e5)">
                  <img src={form.ogImageUrl} alt="OG preview" className="w-full h-full object-cover" />
                </div>
              )}
            </Field>
          </Section>

          <Section title="Twitter / X Card">
            <Field label="Twitter Handle" hint="Your @username (without the @)">
              <input
                type="text"
                value={form.twitterHandle}
                onChange={e => set("twitterHandle", e.target.value)}
                placeholder="mohameddev"
                className={inputCls}
                style={{ color: "var(--color-text-primary,#111)" }}
              />
            </Field>
          </Section>
        </div>
      )}

      {/* ── Scripts & CSS tab ──────────────────────────────────── */}
      {tab === "scripts" && (
        <div className="space-y-6">
          <Section title="Code Injection">
            <Field
              label="<head> Scripts"
              hint="Injected before </head> — good for fonts, analytics scripts, etc."
            >
              <textarea
                value={form.headScripts}
                onChange={e => set("headScripts", e.target.value)}
                placeholder={'<script>\n  // your code\n</script>'}
                rows={6}
                className={textareaCls}
                style={{ color: "var(--color-text-primary,#111)" }}
              />
            </Field>

            <Field
              label="<body> End Scripts"
              hint="Injected before </body> — good for chat widgets, tracking pixels, etc."
            >
              <textarea
                value={form.bodyEndScripts}
                onChange={e => set("bodyEndScripts", e.target.value)}
                placeholder={'<script>\n  // your code\n</script>'}
                rows={6}
                className={textareaCls}
                style={{ color: "var(--color-text-primary,#111)" }}
              />
            </Field>

            <Field
              label="Custom CSS"
              hint="Applied globally to your portfolio — overrides theme tokens"
            >
              <textarea
                value={form.customCss}
                onChange={e => set("customCss", e.target.value)}
                placeholder={"/* your styles */\n.hero { background: red; }"}
                rows={6}
                className={textareaCls}
                style={{ color: "var(--color-text-primary,#111)" }}
              />
            </Field>
          </Section>
        </div>
      )}

      {/* ── Analytics tab ──────────────────────────────────────── */}
      {tab === "analytics" && (
        <div className="space-y-6">
          <Section title="Analytics Integrations">
            <Field label="Google Analytics ID" hint="Format: G-XXXXXXXXXX">
              <input
                type="text"
                value={form.googleAnalyticsId}
                onChange={e => set("googleAnalyticsId", e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className={inputCls}
                style={{ color: "var(--color-text-primary,#111)" }}
              />
            </Field>

            <Field label="Google Tag Manager ID" hint="Format: GTM-XXXXXX">
              <input
                type="text"
                value={form.googleTagManagerId}
                onChange={e => set("googleTagManagerId", e.target.value)}
                placeholder="GTM-XXXXXX"
                className={inputCls}
                style={{ color: "var(--color-text-primary,#111)" }}
              />
            </Field>

            <Field label="Facebook Pixel ID" hint="16-digit number">
              <input
                type="text"
                value={form.facebookPixelId}
                onChange={e => set("facebookPixelId", e.target.value)}
                placeholder="1234567890123456"
                className={inputCls}
                style={{ color: "var(--color-text-primary,#111)" }}
              />
            </Field>
          </Section>

          {/* Analytics auto-injection notice */}
          <div
            className="p-4 rounded-(--radius-md,8px) border border-(--color-border,#e5e5e5) text-xs space-y-1"
            style={{ background: "var(--color-surface,#f8f8f8)" }}
          >
            <p className="font-medium text-(--color-text-primary,#111)">Auto-injection</p>
            <p className="text-(--color-text-secondary,#555)">
              GA and GTM IDs are automatically injected into your portfolio — no manual script needed.
              The Facebook Pixel ID requires a manual script in the &lt;head&gt; Scripts field above.
            </p>
          </div>
        </div>
      )}

      {/* Save button — sticky bottom */}
      <div className="sticky bottom-0 -mx-4 px-4 py-3 border-t border-(--color-border,#e5e5e5) bg-(--color-background,#fff) flex items-center justify-between">
        <p className="text-xs text-(--color-text-secondary,#555)">
          {saved ? "✓ Saved successfully" : "Changes are not saved yet"}
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-(--radius-md,8px) text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "var(--color-primary,#6C63FF)" }}
        >
          {saving
            ? <Loader2 size={14} className="animate-spin" />
            : <Save    size={14} />
          }
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
