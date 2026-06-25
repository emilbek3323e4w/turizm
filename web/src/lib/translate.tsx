import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

/**
 * Machine-translates user-generated content (hotel descriptions, names, etc.)
 * that isn't in the i18n dictionary. Uses the free Google translate endpoint
 * with in-memory + localStorage caching. On any failure it returns the original
 * text, so content never disappears.
 */

const memCache = new Map<string, string>();
const LS_PREFIX = "tr:";

function key(lang: string, text: string): string {
  return `${lang}::${text}`;
}

export async function translateText(text: string, target: string): Promise<string> {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return text;
  const k = key(target, trimmed);
  if (memCache.has(k)) return memCache.get(k)!;
  try {
    const ls = localStorage.getItem(LS_PREFIX + k);
    if (ls) {
      memCache.set(k, ls);
      return ls;
    }
  } catch {
    /* ignore */
  }
  try {
    const url =
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" +
      encodeURIComponent(target) +
      "&dt=t&q=" +
      encodeURIComponent(trimmed);
    const res = await fetch(url);
    const data = (await res.json()) as unknown;
    const segments = Array.isArray(data) && Array.isArray(data[0]) ? (data[0] as unknown[]) : [];
    const translated = segments
      .map((seg) => (Array.isArray(seg) ? String(seg[0] ?? "") : ""))
      .join("");
    const result = translated || text;
    memCache.set(k, result);
    try {
      localStorage.setItem(LS_PREFIX + k, result);
    } catch {
      /* ignore quota */
    }
    return result;
  } catch {
    return text;
  }
}

/** Inline component for translating user content inside lists (rooms, reviews). */
export function T({ text }: { text: string | undefined | null }): React.ReactElement {
  return <>{useAutoTranslate(text)}</>;
}

/** Hook: returns `text` translated into the current UI language (or the original). */
export function useAutoTranslate(text: string | undefined | null): string {
  const { lang } = useI18n();
  const [out, setOut] = useState(text ?? "");

  useEffect(() => {
    const value = text ?? "";
    setOut(value);
    if (!value.trim()) return;
    let active = true;
    void translateText(value, lang).then((r) => {
      if (active) setOut(r);
    });
    return () => {
      active = false;
    };
  }, [text, lang]);

  return out;
}
