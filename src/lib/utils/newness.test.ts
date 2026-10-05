import { afterEach, describe, expect, it, vi } from "vitest";

// newness.ts reads the build date once, at import, so each case sets it and
// imports a fresh copy.
async function isNewOn(buildDate: string | undefined, releasedAt?: string) {
  vi.resetModules();
  if (buildDate === undefined) vi.stubEnv("NEXT_PUBLIC_BUILD_DATE", undefined);
  else vi.stubEnv("NEXT_PUBLIC_BUILD_DATE", buildDate);
  const { isNewRelease } = await import("./newness");
  return isNewRelease({ releasedAt });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isNewRelease", () => {
  it("is new from the release day", async () => {
    expect(await isNewOn("2026-08-12", "2026-08-12")).toBe(true);
  });

  it("is still new on day 59", async () => {
    expect(await isNewOn("2026-10-10", "2026-08-12")).toBe(true);
  });

  it("stops being new on day 60", async () => {
    expect(await isNewOn("2026-10-11", "2026-08-12")).toBe(false);
  });

  it("is not new before its release date", async () => {
    expect(await isNewOn("2026-08-11", "2026-08-12")).toBe(false);
  });

  it("is not new without a release date", async () => {
    expect(await isNewOn("2026-08-12", undefined)).toBe(false);
  });

  it("is not new when the build date is missing", async () => {
    expect(await isNewOn(undefined, "2026-08-12")).toBe(false);
  });

  it("is not new when a date does not parse", async () => {
    expect(await isNewOn("not-a-date", "2026-08-12")).toBe(false);
    expect(await isNewOn("2026-08-12", "soon")).toBe(false);
  });
});
