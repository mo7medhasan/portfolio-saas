"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Trash2, AlertTriangle, Eye, EyeOff } from "lucide-react";

const inputCls = [
  "w-full px-3.5 py-2.5 text-sm rounded-(--radius-md,8px)",
  "border border-(--color-border,#e5e5e5) outline-none",
  "transition-all focus:border-(--color-primary,#6C63FF)",
  "focus:ring-2 focus:ring-(--color-primary,#6C63FF)/10",
  "bg-(--color-surface,#f8f8f8)",
].join(" ");

function Section({ title, description, children }: {
  title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-(--color-text-primary,#111)">{title}</h2>
        {description && (
          <p className="text-xs mt-0.5 text-(--color-text-secondary,#555)">{description}</p>
        )}
      </div>
      <div className="p-4 rounded-(--radius-lg,16px) border border-(--color-border,#e5e5e5) bg-(--color-background,#fff) space-y-4">
        {children}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-(--color-text-primary,#111)">{label}</label>
      {hint && <p className="text-xs text-(--color-text-secondary,#555)">{hint}</p>}
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label, description }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-(--color-text-primary,#111)">{label}</p>
        {description && <p className="text-xs mt-0.5 text-(--color-text-secondary,#555)">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative shrink-0 w-10 h-6 rounded-full transition-colors"
        style={{ background: checked ? "var(--color-primary,#6C63FF)" : "var(--color-border,#e5e5e5)" }}
        aria-checked={checked}
        role="switch"
      >
        <span
          className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}

interface Props {
  portfolio: {
    id:                   string;
    title:                string;
    tagline:              string | null;
    slug:                 string;
    locale:               string;
    direction:            string;
    isPasswordProtected:  boolean;
    showPlatformBranding: boolean;
  };
}

export function SettingsEditor({ portfolio }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    title:                portfolio.title,
    tagline:              portfolio.tagline              ?? "",
    locale:               portfolio.locale               ?? "ar",
    direction:            portfolio.direction            ?? "rtl",
    isPasswordProtected:  portfolio.isPasswordProtected  ?? false,
    showPlatformBranding: portfolio.showPlatformBranding ?? true,
  });

  const [saving,        setSaving]        = useState(false);
  const [saved,         setSaved]         = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting,      setDeleting]      = useState(false);
  const [deleteInput,   setDeleteInput]   = useState("");

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  async function handleSave() {
    setSaving(true); setSaved(false);
    const res = await fetch("/api/settings", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    });
    if (res.ok) {
        router.refresh();
        setSaving(false); setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    } else {
        setSaving(false);
    }
  }

  async function handleDelete() {
    if (deleteInput !== portfolio.slug) return;
    setDeleting(true);
    const res = await fetch("/api/settings", { method: "DELETE" });
    if (res.ok) {
        router.push("/signup"); // redirect after delete
    } else {
        setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* ── General ──────────────────────────────────────────────── */}
      <Section title="General" description="Basic information about your portfolio">
        <Field label="Portfolio Title" hint="Shown in the browser tab and OG images">
          <input
            type="text"
            value={form.title}
            onChange={e => set("title", e.target.value)}
            maxLength={80}
            placeholder="My Portfolio"
            className={inputCls}
            style={{ color: "var(--color-text-primary,#111)" }}
          />
        </Field>

        <Field label="Tagline" hint="Short subtitle shown on the portfolio (optional)">
          <input
            type="text"
            value={form.tagline}
            onChange={e => set("tagline", e.target.value)}
            maxLength={160}
            placeholder="Frontend Engineer · Cairo"
            className={inputCls}
            style={{ color: "var(--color-text-primary,#111)" }}
          />
        </Field>

        <Field label="URL Slug" hint="Your portfolio address — contact support to change">
          <div
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-(--radius-md,8px) border border-(--color-border,#e5e5e5) bg-(--color-surface,#f8f8f8) opacity-60 cursor-not-allowed"
          >
            <span className="text-xs text-(--color-text-secondary,#555)">portfolioapp.com/</span>
            <span className="text-sm font-medium text-(--color-text-primary,#111)">{portfolio.slug}</span>
          </div>
        </Field>
      </Section>

      {/* ── Language & Direction ──────────────────────────────────── */}
      <Section
        title="Language & Direction"
        description="Controls the HTML lang attribute and text direction"
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Language">
            <select
              value={form.locale}
              onChange={e => set("locale", e.target.value)}
              className={inputCls}
              style={{ color: "var(--color-text-primary,#111)" }}
            >
              <option value="ar">العربية (ar)</option>
              <option value="en">English (en)</option>
              <option value="fr">Français (fr)</option>
              <option value="de">Deutsch (de)</option>
              <option value="es">Español (es)</option>
            </select>
          </Field>

          <Field label="Text Direction">
            <select
              value={form.direction}
              onChange={e => set("direction", e.target.value)}
              className={inputCls}
              style={{ color: "var(--color-text-primary,#111)" }}
            >
              <option value="rtl">RTL — Right to Left</option>
              <option value="ltr">LTR — Left to Right</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* ── Privacy ───────────────────────────────────────────────── */}
      <Section title="Privacy" description="Control who can view your portfolio">
        <Toggle
          checked={form.isPasswordProtected}
          onChange={v => set("isPasswordProtected", v)}
          label="Password Protection"
          description="Visitors must enter a password to view your portfolio — Pro plan feature"
        />

        <Toggle
          checked={!form.showPlatformBranding}
          onChange={v => set("showPlatformBranding", !v)}
          label="Remove Platform Branding"
          description="Hide the 'Built with Portfolio SaaS' badge — Business plan feature"
        />
      </Section>

      {/* Save */}
      <div className="sticky bottom-0 -mx-4 px-4 py-3 border-t border-(--color-border,#e5e5e5) bg-(--color-background,#fff) flex items-center justify-between">
        <p className="text-xs text-(--color-text-secondary,#555)">
          {saved ? "✓ Saved successfully" : "Unsaved changes"}
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-(--radius-md,8px) text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "var(--color-primary,#6C63FF)" }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      {/* ── Danger Zone ───────────────────────────────────────────── */}
      <Section title="Danger Zone">
        {!deleteConfirm ? (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-(--color-text-primary,#111)">Delete Portfolio</p>
              <p className="text-xs mt-0.5 text-(--color-text-secondary,#555)">
                Permanently delete your portfolio and all its content. This cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setDeleteConfirm(true)}
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-(--radius-md,8px) text-sm font-medium border transition-colors hover:bg-red-50 hover:border-red-300"
              style={{ color: "#ef4444", borderColor: "#fca5a5" }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className="flex items-start gap-3 p-3 rounded-(--radius-md,8px) border"
              style={{ background: "#fff7f7", borderColor: "#fca5a5" }}
            >
              <AlertTriangle size={16} style={{ color: "#ef4444", flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs" style={{ color: "#991b1b" }}>
                This will permanently delete <strong>{portfolio.title}</strong> and all its sections,
                media, messages, and settings. There is no undo.
              </p>
            </div>

            <Field label={`Type "${portfolio.slug}" to confirm`}>
              <input
                type="text"
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                placeholder={portfolio.slug}
                className={inputCls}
                style={{ color: "var(--color-text-primary,#111)" }}
              />
            </Field>

            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteConfirm(false); setDeleteInput(""); }}
                className="flex-1 py-2.5 text-sm rounded-(--radius-md,8px) border border-(--color-border,#e5e5e5) transition-colors hover:bg-(--color-surface,#f8f8f8) text-(--color-text-primary,#111)"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteInput !== portfolio.slug || deleting}
                className="flex-1 py-2.5 text-sm font-medium rounded-(--radius-md,8px) text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ background: "#ef4444" }}
              >
                {deleting ? "Deleting…" : "Delete Portfolio"}
              </button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
