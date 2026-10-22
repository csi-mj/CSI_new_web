/**
 * Curated Google-Fonts list for certificate typography.
 * Fonts are loaded lazily (a single <link> injected by the editor/send pages)
 * and each family actually used is awaited via document.fonts.load() before
 * any canvas render or export — see lib/ecert/render.ts ensureFontsUsed().
 */

export const ECERT_FONTS: string[] = [
  'Poppins',
  'Montserrat',
  'Playfair Display',
  'Cormorant Garamond',
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Raleway',
  'Nunito',
  'Outfit',
  'Manrope',
  'DM Sans',
  'Work Sans',
  'Mulish',
  'Quicksand',
  'Josefin Sans',
  'Bricolage Grotesque',
  'Merriweather',
  'Lora',
  'Libre Baskerville',
  'EB Garamond',
  'Bitter',
  'Crimson Pro',
  'Cinzel',
  'Cinzel Decorative',
  'Great Vibes',
  'Pinyon Script',
  'Parisienne',
  'Alex Brush',
  'Dancing Script',
  'Sacramento',
  'Tangerine',
  'Marcellus',
  'Cardo',
  'Oswald',
  'Bebas Neue',
  'Anton',
  'Rubik',
  'Rubik Mono One'
];

export const DEFAULT_CERT_FONT = 'Montserrat';

/** Builds a fonts.googleapis.com css2 URL for the given families (400/700 + italics). */
export function googleFontsUrl(families: string[]): string {
  const spec = families
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:ital,wght@0,400;0,700;1,400;1,700`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${spec}&display=swap`;
}

/** Injects the stylesheet once per family list (idempotent by url). */
export function ensureGoogleFontsInjected(families: string[]): void {
  if (typeof document === 'undefined') return;
  const base = googleFontsUrl(ECERT_FONTS);
  const id = 'ecert-google-fonts';
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = base;
    document.head.appendChild(link);
    const pre = document.createElement('link');
    pre.id = `${id}-pre`;
    pre.rel = 'preconnect';
    pre.href = 'https://fonts.gstatic.com';
    pre.crossOrigin = 'anonymous';
    document.head.appendChild(pre);
  }
}

/**
 * Awaits every requested family so canvas text renders with the right glyphs.
 * Resolves even if a family fails (falls back through the CSS stack) — the
 * caller is told which families failed so it can warn the admin.
 */
export async function ensureFontsLoaded(
  families: string[],
  weights: number[] = [400, 700]
): Promise<{ missing: string[] }> {
  if (typeof document === 'undefined' || !families.length) return { missing: [] };
  ensureGoogleFontsInjected(families);
  const missing: string[] = [];
  await Promise.all(
    families.map(async (family) => {
      try {
        await Promise.race([
          Promise.all(weights.map((w) => document.fonts.load(`${w} 64px "${family}"`))),
          new Promise((resolve) => setTimeout(resolve, 8000))
        ]);
        const loaded = Array.from(document.fonts).some((f) => f.family === family);
        if (!loaded) missing.push(family);
      } catch {
        missing.push(family);
      }
    })
  );
  try {
    await document.fonts.ready;
  } catch {
    /* ignore */
  }
  return { missing: [...new Set(missing)] };
}