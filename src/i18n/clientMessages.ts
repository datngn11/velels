import type { AbstractIntlMessages } from "next-intl";

/**
 * The namespaces client components read. Only these reach the browser; add one
 * when a client component starts reading it, or the page shows the raw key.
 */
const CLIENT_NAMESPACES = ["meta", "nav", "hero", "catalog", "products", "productDetail", "error"];

export function clientMessages(messages: AbstractIntlMessages): AbstractIntlMessages {
  return Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]));
}
