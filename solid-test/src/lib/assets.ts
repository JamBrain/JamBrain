export function toStatic(href: string | null) {
  if (href == null || !href.startsWith("///")) {
    return null;
  }
  return STATIC_ENDPOINT + href.substring(2);
}
