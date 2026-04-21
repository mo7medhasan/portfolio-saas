// src/components/dashboard/SectionsList.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Section } from "@/db/schema";

interface Props {
  sections: Section[];
  portfolioSlug: string;
}

const SECTION_ICONS: Record<string, string> = {
  hero: "🏠",
  about: "👤",
  services: "⚙️",
  portfolio: "🗂️",
  contact: "✉️",
  custom_html: "</>",
};

export function SectionsList({ sections: initialSections, portfolioSlug }: Props) {
  const router = useRouter();
  const [sections, setSections] = useState(initialSections);
  const [loading, setLoading] = useState<string | null>(null);

  async function addSection(type: string) {
    setLoading("adding");
    const res = await fetch("/api/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    if (res.ok) router.refresh();
    setLoading(null);
  }

  async function deleteSection(id: string) {
    setLoading(id);
    await fetch(`/api/sections/${id}`, { method: "DELETE" });
    setSections((prev) => prev.filter((s) => s.id !== id));
    setLoading(null);
  }

  async function toggleVisibility(section: Section) {
    await fetch(`/api/sections/${section.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible: !section.isVisible }),
    });
    setSections((prev) =>
      prev.map((s) =>
        s.id === section.id ? { ...s, isVisible: !s.isVisible } : s
      )
    );
  }

  const sectionTypes = [
    { type: "hero", label: "Hero" },
    { type: "about", label: "About" },
    { type: "services", label: "Services" },
    { type: "portfolio", label: "Portfolio" },
    { type: "contact", label: "Contact" },
    { type: "custom_html", label: "Custom HTML" },
  ];

  return (
    <div>
      {/* Add Section Buttons */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Add Section
        </p>
        <div className="flex flex-wrap gap-2">
          {sectionTypes.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => addSection(type)}
              disabled={loading === "adding"}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-sm border border-indigo-100 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm cursor-pointer"
            >
              <span className="text-base">{SECTION_ICONS[type] ?? "+"}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mb-6" />

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
          <div className="text-4xl mb-3">🗂️</div>
          <p className="font-medium text-gray-500">No sections yet</p>
          <p className="text-sm mt-1">Add a section using the buttons above</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl border bg-white shadow-sm transition-all duration-150 hover:shadow-md ${
                section.isVisible
                  ? "border-gray-200 opacity-100"
                  : "border-dashed border-gray-200 opacity-50"
              }`}
            >
              {/* Left: Icon + Info */}
              <div className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">
                  {SECTION_ICONS[section.type] ?? "📄"}
                </span>
                <div>
                  <span className="font-semibold text-sm text-gray-800 capitalize">
                    {section.type.replace("_", " ")}
                  </span>
                  {section.label && (
                    <span className="text-xs text-gray-400 ml-2">
                      {section.label}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 ml-2">
                    #{index + 1}
                  </span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleVisibility(section)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors duration-150 cursor-pointer ${
                    section.isVisible
                      ? "border-gray-200 text-gray-600 hover:bg-gray-50"
                      : "border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                  }`}
                >
                  {section.isVisible ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => deleteSection(section.id)}
                  disabled={loading === section.id}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading === section.id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}