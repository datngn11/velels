import type { ReactNode } from "react";
import { siteConfig } from "@/lib/config";

/** The only two contacts the site publishes. Exact strings, not patterns. */
const CONTACTS: Record<string, string> = {
  "@velelswim": siteConfig.social.instagram,
  [siteConfig.email]: `mailto:${siteConfig.email}`,
};

const SPLIT = new RegExp(`(${Object.keys(CONTACTS).join("|")})`, "g");

/**
 * No standing underline. `text-primary` against the `text-secondary` body is
 * 4.0:1, past the 3:1 a link needs when colour is the only thing marking it, and
 * `hover-underline-anim` is the site's inline-link treatment everywhere else.
 */
const LINK = "text-primary hover-underline-anim";

/**
 * Links the contacts above wherever they appear in body copy, so the message
 * files stay plain text and a translator never carries markup.
 */
export function linkifyContacts(text: string): ReactNode {
  const parts = text.split(SPLIT);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    const href = CONTACTS[part];
    if (!href) return part;
    const external = !href.startsWith("mailto:");
    return (
      <a
        key={i}
        href={href}
        className={LINK}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {part}
      </a>
    );
  });
}
