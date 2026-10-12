const services: Record<string, string> = {
  development: "lab",
  marketing: "marketing",
  video: "content",
  "video-content": "content",
  website: "lab/services/website",
  "shopping-mall": "lab/services/shopping-mall",
  "automation-app": "lab/services/automation",
};
export function legacyDestination(path: string): string | null {
  const localized = /^\/(ko|en)(\/|$)/i.test(path);
  let clean = path.replace(/^\/(ko|en)(?=\/|$)/i, "") || "/";
  if (/^\/video(?=\/|$)/i.test(clean)) clean = clean.replace(/^\/video/i, "/content");
  if (/^\/dev(\/|$)/.test(clean)) clean = clean.replace(/^\/dev/, "/lab");
  if (["/quote", "/pricing"].includes(clean)) clean = "/contact";
  if (clean === "/team") clean = "/about";
  if (clean === "/portfolio") clean = "/work";
  if (clean === "/services") clean = "/";
  const match = /^\/services\/([^/]+)(.*)$/.exec(clean);
  if (match && services[match[1]]) clean = "/" + services[match[1]] + match[2];
  if (/^\/services\/(design|business)(\/|$)/.test(clean)) clean = "/about";
  return localized || clean !== path ? clean : null;
}
