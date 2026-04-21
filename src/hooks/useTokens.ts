// src/hooks/useTokens.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { DesignToken } from "@/db/schema";

// ── Types ─────────────────────────────────────────────────
interface TokenUpdate {
  key: string;
  value: string;
  darkValue?: string | null;
}

interface UseTokensReturn {
  tokens: DesignToken[];
  tokenMap: Record<string, string>;          // { '--color-primary': '#6C63FF' }
  isLoading: boolean;
  isSaving: boolean;
  updateToken: (key: string, value: string, darkValue?: string) => void;
  applyPreset: (presetId: string) => Promise<void>;
  resetToken: (key: string) => void;
  hasUnsavedChanges: boolean;
}

// ── The Hook ──────────────────────────────────────────────
export function useTokens(): UseTokensReturn {
  const [tokens, setTokens] = useState<DesignToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Pending updates buffer — بنجمّع التغييرات قبل الـ save
  const pendingUpdates = useRef<Map<string, TokenUpdate>>(new Map());
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // ── Fetch tokens from API ────────────────────────────────
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tokens");
      const data = await res.json();
      setTokens(data.tokens ?? []);
      setIsLoading(false);
    }
    load();
  }, []);

  // ── Build token map { key → value } ────────────────────
  const tokenMap = tokens.reduce<Record<string, string>>(
    (acc, t) => ({ ...acc, [t.key]: t.value }),
    {}
  );

  // ── Apply CSS variables to document immediately ─────────
  // ده الـ live preview — مش محتاج page refresh
  function applyToDocument(key: string, value: string) {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty(key, value);
  }

  // ── Debounced save to DB ─────────────────────────────────
  // بيستنى 500ms بعد آخر تغيير قبل ما يحفظ
  // عشان ميبعتش request لكل حرف بيكتبه الـ user
  const scheduleSave = useCallback(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      const updates = Array.from(pendingUpdates.current.values());
      if (updates.length === 0) return;

      setIsSaving(true);
      try {
        await fetch("/api/tokens", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updates }),
        });
        pendingUpdates.current.clear();
        setHasUnsavedChanges(false);
      } catch (err) {
        console.error("Failed to save tokens:", err);
      } finally {
        setIsSaving(false);
      }
    }, 500); // 500ms debounce
  }, []);

  // ── Update a single token ────────────────────────────────
  const updateToken = useCallback(
    (key: string, value: string, darkValue?: string) => {
      // 1. Update local state immediately (optimistic)
      setTokens((prev) =>
        prev.map((t) =>
          t.key === key
            ? { ...t, value, darkValue: darkValue ?? t.darkValue }
            : t
        )
      );

      // 2. Apply to document for live preview
      applyToDocument(key, value);

      // 3. Add to pending buffer
      pendingUpdates.current.set(key, { key, value, darkValue });
      setHasUnsavedChanges(true);

      // 4. Schedule debounced save
      scheduleSave();
    },
    [scheduleSave]
  );

  // ── Apply full preset ────────────────────────────────────
  const applyPreset = useCallback(async (presetId: string) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presetId }),
      });
      if (!res.ok) throw new Error("Failed to apply preset");

      // Reload tokens after preset applied
      const tokensRes = await fetch("/api/tokens");
      const data = await tokensRes.json();
      const newTokens: DesignToken[] = data.tokens ?? [];

      setTokens(newTokens);

      // Apply all new values to document
      newTokens.forEach((t) => applyToDocument(t.key, t.value));
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // ── Reset single token to default ───────────────────────
  const resetToken = useCallback(
    (key: string) => {
      const token = tokens.find((t) => t.key === key);
      if (!token) return;
      updateToken(key, token.defaultValue);
    },
    [tokens, updateToken]
  );

  // Cleanup debounce on unmount
  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  return {
    tokens,
    tokenMap,
    isLoading,
    isSaving,
    updateToken,
    applyPreset,
    resetToken,
    hasUnsavedChanges,
  };
}