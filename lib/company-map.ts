/** Only Google's supported embed URLs are accepted as iframe sources. */
export function companyMap(address: string, mapUrl = "") {
  const fallback = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  let directions = fallback;
  let embed = address ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed` : "";
  try {
    const url = new URL(mapUrl);
    if (url.protocol === "https:" || url.protocol === "http:") directions = url.href;
    if (url.protocol === "https:" && ["www.google.com", "maps.google.com", "www.google.com.np"].includes(url.hostname) && url.pathname.startsWith("/maps/embed")) embed = url.href;
  } catch { /* An empty URL uses the company address. */ }
  return { directions, embed };
}
