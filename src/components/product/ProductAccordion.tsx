import type { ReactNode } from "react";

interface ProductAccordionProps {
  title: string;
  children: ReactNode;
}

/**
 * One collapsible row on the product page.
 *
 * Extracted when a third row was added, rather than copying the chevron markup
 * again. `<details>`/`<summary>` is used deliberately: it is keyboard operable and
 * announced correctly with no JavaScript, which a hand-rolled toggle would have to
 * earn back.
 *
 * Reserved for reference material — long, conditional, read once a decision is
 * already made. Anything a visitor needs *while* deciding belongs in the visible
 * lines under the call to action, not behind a tap.
 */
export function ProductAccordion({ title, children }: ProductAccordionProps) {
  return (
    <details className="group cursor-pointer">
      <summary className="flex justify-between items-center text-label-lg text-primary">
        {title}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="group-open:rotate-180 transition-transform duration-300"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <div className="pt-4 pb-2 pl-4 border-l border-outline-variant/30 mt-2 text-body-md text-secondary">
        {children}
      </div>
    </details>
  );
}
