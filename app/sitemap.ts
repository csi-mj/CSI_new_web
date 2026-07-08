import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://csi-mjcet.in';
  const routes = ['', '/team', '/events', '/magazine', '/resources', '/membership', '/adsophos'];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8
  }));
}
