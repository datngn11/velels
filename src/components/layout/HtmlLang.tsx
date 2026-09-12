"use client";

import { useEffect } from "react";

/**
 * Keeps `<html lang>` in step with the locale. The root layout owns that element and
 * does not re-render when the `[locale]` segment changes, so after a client-side
 * switch the attribute would still name the locale the document was parsed with.
 *
 * Mounted inside `[locale]` on purpose: the 404 renders outside it and sets its own
 * value, which this must not overwrite.
 */
export function HtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
