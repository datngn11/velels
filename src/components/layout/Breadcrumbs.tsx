import { Link } from "@/i18n/navigation";

export interface Crumb {
  name: string;
  /** Locale-relative path; "" for the homepage. */
  path: string;
}

interface BreadcrumbsProps {
  /** Root-first. The last entry is the current page and is not linked. */
  items: Crumb[];
  /** Accessible name for the nav landmark. */
  label: string;
}

/**
 * Visible breadcrumb trail. Pass the same array to `breadcrumbJsonLd()` so the
 * markup and the structured data cannot disagree — Google expects structured data
 * to reflect what a visitor can see.
 */
export function Breadcrumbs({ items, label }: BreadcrumbsProps) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-2 text-body-sm text-secondary">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-outline-variant">
                  /
                </span>
              )}
              {isCurrent ? (
                <span aria-current="page" className="text-primary">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path === "" ? "/" : item.path}
                  className="hover:text-primary transition-colors hover-underline-anim"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
