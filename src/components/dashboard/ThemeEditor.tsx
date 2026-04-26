// src/components/dashboard/ThemeEditor.tsx
"use client";

import { useState } from "react";
import { useTokens } from "@/hooks/useTokens";
import type { DesignToken } from "@/db/schema";

// ── Built-in presets (هتضيفهم للـ DB بالـ seed) ────────────
const BUILT_IN_PRESETS = [
  {
    id: "preset-minimal",
    name: "Minimal",
    colors: { primary: "#111111", accent: "#6C63FF" },
  },
  {
    id: "preset-ocean",
    name: "Ocean",
    colors: { primary: "#0EA5E9", accent: "#06B6D4" },
  },
  {
    id: "preset-forest",
    name: "Forest",
    colors: { primary: "#16A34A", accent: "#84CC16" },
  },
  {
    id: "preset-sunset",
    name: "Sunset",
    colors: { primary: "#F97316", accent: "#EF4444" },
  },
  {
    id: "preset-rose",
    name: "Rose",
    colors: { primary: "#E11D48", accent: "#F43F5E" },
  },
  {
    id: "preset-violet",
    name: "Violet",
    colors: { primary: "#7C3AED", accent: "#6C63FF" },
  },
];

// ── Font options ───────────────────────────────────────────
const HEADING_FONTS = [
  { label: "Sora", value: "'Sora', sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "DM Serif Display", value: "'DM Serif Display', serif" },
  { label: "Cabinet Grotesk", value: "'Cabinet Grotesk', sans-serif" },
  { label: "Fraunces", value: "'Fraunces', serif" },
  { label: "Outfit", value: "'Outfit', sans-serif" },
];

const BODY_FONTS = [
  { label: "DM Sans", value: "'DM Sans', sans-serif" },
  { label: "Lato", value: "'Lato', sans-serif" },
  { label: "Nunito", value: "'Nunito', sans-serif" },
  { label: "Source Sans 3", value: "'Source Sans 3', sans-serif" },
  { label: "Mulish", value: "'Mulish', sans-serif" },
];

// ── Color token row component ──────────────────────────────
function ColorRow({
  token,
  onUpdate,
  onReset,
}: {
  token: DesignToken;
  onUpdate: (key: string, value: string, dark?: string) => void;
  onReset: (key: string) => void;
}) {
  const isDefault = token.value === token.defaultValue;

  return (
    <div className="flex items-center justify-between py-3 border-b border-(--color-border,#e5e5e5) last:border-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Color swatch + picker */}
        <div className="relative w-8 h-8 rounded-md border border-(--color-border,#e5e5e5) overflow-hidden flex-shrink-0 cursor-pointer">
          <div
            className="absolute inset-0"
            style={{ background: token.value }}
          />
          <input
            type="color"
            value={token.value}
            onChange={(e) => onUpdate(token.key, e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            title={token.label}
          />
        </div>

        {/* Label + key */}
        <div className="min-w-0">
          <p
            className="text-sm font-medium truncate"
            style={{ color: "var(--color-text-primary,#111)" }}
          >
            {token.label}
          </p>
          <p
            className="text-xs truncate font-mono"
            style={{ color: "var(--color-text-secondary,#555)" }}
          >
            {token.key}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Hex input */}
        <input
          type="text"
          value={token.value}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
              onUpdate(token.key, val);
            }
          }}
          className="w-24 px-2 py-1 text-xs font-mono rounded border border-(--color-border,#e5e5e5) outline-none focus:border-(--color-primary,#6C63FF)"
          style={{
            background: "var(--color-surface,#f8f8f8)",
            color: "var(--color-text-primary,#111)",
          }}
        />

        {/* Reset button — ظاهر بس لو القيمة اتغيرت */}
        {!isDefault && (
          <button
            onClick={() => onReset(token.key)}
            title="Reset to default"
            className="w-7 h-7 rounded flex items-center justify-center transition-colors hover:bg-(--color-surface,#f8f8f8)"
            style={{ color: "var(--color-text-secondary,#555)" }}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <path d="M2 8a6 6 0 106-6H5M2 2v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Select row ────────────────────────────────────────────
function SelectRow({
  token,
  options,
  onUpdate,
}: {
  token: DesignToken;
  options: { label: string; value: string }[];
  onUpdate: (key: string, value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-(--color-border,#e5e5e5) last:border-0">
      <p
        className="text-sm font-medium"
        style={{ color: "var(--color-text-primary,#111)" }}
      >
        {token.label}
      </p>
      <select
        value={token.value}
        onChange={(e) => onUpdate(token.key, e.target.value)}
        className="text-sm px-3 py-1.5 rounded border border-(--color-border,#e5e5e5) outline-none focus:border-(--color-primary,#6C63FF) max-w-[180px]"
        style={{
          background: "var(--color-surface,#f8f8f8)",
          color: "var(--color-text-primary,#111)",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Slider row ────────────────────────────────────────────
function SliderRow({
  token,
  min,
  max,
  step,
  unit,
  onUpdate,
}: {
  token: DesignToken;
  min: number;
  max: number;
  step: number;
  unit: string;
  onUpdate: (key: string, value: string) => void;
}) {
  const numericValue = parseFloat(token.value);

  return (
    <div className="py-3 border-b border-(--color-border,#e5e5e5) last:border-0 space-y-2">
      <div className="flex items-center justify-between">
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary,#111)" }}
        >
          {token.label}
        </p>
        <span
          className="text-sm font-mono"
          style={{ color: "var(--color-text-secondary,#555)" }}
        >
          {token.value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={numericValue}
        onChange={(e) => onUpdate(token.key, `${e.target.value}${unit}`)}
        className="w-full accent-(--color-primary,#6C63FF)"
      />
    </div>
  );
}

// ── Main ThemeEditor ──────────────────────────────────────
export function ThemeEditor() {
  const { tokens, isLoading, isSaving, updateToken, resetToken, hasUnsavedChanges } =
    useTokens();

  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "spacing">("colors");

  // Group tokens by category
  const colorTokens = tokens.filter((t) => t.category === "color");
  const typographyTokens = tokens.filter((t) => t.category === "typography");
  const spacingTokens = tokens.filter((t) => t.category === "spacing");
  const radiusTokens = tokens.filter((t) => t.category === "radius");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--color-primary,#6C63FF)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-lg font-semibold"
            style={{
              fontFamily: "var(--font-heading,sans-serif)",
              color: "var(--color-heading,#111)",
            }}
          >
            Theme Editor
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary,#555)" }}>
            التغييرات بتظهر فوراً على الـ portfolio
          </p>
        </div>

        {/* Save status */}
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-secondary,#555)" }}>
          {isSaving ? (
            <>
              <div
                className="w-3 h-3 rounded-full border border-t-transparent animate-spin"
                style={{ borderColor: "var(--color-text-secondary,#555)", borderTopColor: "transparent" }}
              />
              جاري الحفظ...
            </>
          ) : hasUnsavedChanges ? (
            <span className="text-amber-500">تغييرات غير محفوظة</span>
          ) : (
            <span className="text-green-500">كل حاجة محفوظة</span>
          )}
        </div>
      </div>

      {/* Preset gallery */}
      <div className="space-y-3">
        <p
          className="text-xs font-semibold tracking-wider uppercase"
          style={{ color: "var(--color-text-secondary,#555)" }}
        >
          Themes جاهزة
        </p>
        <div className="grid grid-cols-3 gap-2">
          {BUILT_IN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                // Apply locally using updateToken for instant preview and debounced save
                updateToken("--color-primary", preset.colors.primary);
                if (preset.colors.accent) {
                  updateToken("--color-accent", preset.colors.accent);
                }
                
              }}
              disabled={isSaving}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-(--color-border,#e5e5e5) text-left transition-all hover:border-(--color-primary,#6C63FF) hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: "var(--color-background,#fff)" }}
            >
              {/* Color preview dots */}
              <div className="flex gap-1  shrink-0">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: preset.colors.primary }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: preset.colors.accent }}
                />
              </div>
              <span
                className="text-xs font-medium truncate"
                style={{ color: "var(--color-text-primary,#111)" }}
              >
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-(--color-border,#e5e5e5)">
        {(["colors", "typography", "spacing"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab
                ? "border-(--color-primary,#6C63FF) text-(--color-primary,#6C63FF)"
                : "border-transparent",
            ].join(" ")}
            style={{
              color:
                activeTab === tab
                  ? "var(--color-primary,#6C63FF)"
                  : "var(--color-text-secondary,#555)",
            }}
          >
            {tab === "colors" ? "ألوان" : tab === "typography" ? "خطوط" : "مسافات"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className="rounded-xl border border-(--color-border,#e5e5e5) divide-y divide-(--color-border,#e5e5e5) overflow-hidden"
        style={{ background: "var(--color-background,#fff)" }}
      >

        {/* ── Colors tab ──────────────────────────────── */}
        {activeTab === "colors" && (
          <div className="px-4">
            {colorTokens.map((token) => (
              <ColorRow
                key={token.id}
                token={token}
                onUpdate={updateToken}
                onReset={resetToken}
              />
            ))}
          </div>
        )}

        {/* ── Typography tab ───────────────────────────── */}
        {activeTab === "typography" && (
          <div className="px-4">
            {typographyTokens.map((token) => {
              if (token.key === "--font-heading") {
                return (
                  <SelectRow
                    key={token.id}
                    token={token}
                    options={HEADING_FONTS}
                    onUpdate={updateToken}
                  />
                );
              }
              if (token.key === "--font-body") {
                return (
                  <SelectRow
                    key={token.id}
                    token={token}
                    options={BODY_FONTS}
                    onUpdate={updateToken}
                  />
                );
              }
              if (token.key === "--font-weight-heading") {
                return (
                  <SelectRow
                    key={token.id}
                    token={token}
                    options={[
                      { label: "Regular (400)", value: "400" },
                      { label: "Medium (500)", value: "500" },
                      { label: "Semibold (600)", value: "600" },
                      { label: "Bold (700)", value: "700" },
                      { label: "Extrabold (800)", value: "800" },
                      { label: "Black (900)", value: "900" },
                    ]}
                    onUpdate={updateToken}
                  />
                );
              }
              if (token.key === "--letter-spacing-heading") {
                return (
                  <SelectRow
                    key={token.id}
                    token={token}
                    options={[
                      { label: "Tight (-0.05em)", value: "-0.05em" },
                      { label: "Snug (-0.03em)", value: "-0.03em" },
                      { label: "Default (-0.02em)", value: "-0.02em" },
                      { label: "Normal (0)", value: "0" },
                      { label: "Wide (0.02em)", value: "0.02em" },
                      { label: "Wider (0.05em)", value: "0.05em" },
                    ]}
                    onUpdate={updateToken}
                  />
                );
              }
              return null;
            })}
          </div>
        )}

        {/* ── Spacing tab ──────────────────────────────── */}
        {activeTab === "spacing" && (
          <div className="px-4">
            {/* Section padding */}
            {spacingTokens.map((token) => {
              if (token.key === "--section-padding-y") {
                return (
                  <SliderRow
                    key={token.id}
                    token={token}
                    min={32}
                    max={160}
                    step={8}
                    unit="px"
                    onUpdate={updateToken}
                  />
                );
              }
              if (token.key === "--gap-cards") {
                return (
                  <SliderRow
                    key={token.id}
                    token={token}
                    min={8}
                    max={48}
                    step={4}
                    unit="px"
                    onUpdate={updateToken}
                  />
                );
              }
              return null;
            })}

            {/* Border radius */}
            {radiusTokens.map((token) => {
              if (token.key === "--radius-lg") {
                return (
                  <SliderRow
                    key={token.id}
                    token={token}
                    min={0}
                    max={32}
                    step={2}
                    unit="px"
                    onUpdate={updateToken}
                  />
                );
              }
              if (token.key === "--radius-md") {
                return (
                  <SliderRow
                    key={token.id}
                    token={token}
                    min={0}
                    max={16}
                    step={2}
                    unit="px"
                    onUpdate={updateToken}
                  />
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}