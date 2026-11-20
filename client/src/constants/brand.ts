import brandManifest from "../../../brandManifest.json";

// Single source of truth for brand copy: brandManifest.json at the repo root.
export const brand = brandManifest;

export const mailtoHref = `mailto:${brand.contact.email}`;
