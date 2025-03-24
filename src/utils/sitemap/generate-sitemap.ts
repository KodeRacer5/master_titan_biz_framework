import { siteIndex, PageInfo } from './site-index';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export function generateSitemapXML(): string {
  const baseUrl = 'https://titansurgical.com';
  const pages = flattenSiteIndex(siteIndex);
  const sitemapUrls = generateSitemapURLs(pages, baseUrl);
  
  const urlElements = sitemapUrls.map(url => `
    <url>
      <loc>${url.loc}</loc>
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
      ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    </url>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

function flattenSiteIndex(index: Record<string, PageInfo>, result: PageInfo[] = []): PageInfo[] {
  Object.values(index).forEach((item: PageInfo) => {
    if (item.path) {
      result.push(item);
    }
    if (item.children) {
      flattenSiteIndex(item.children, result);
    }
  });
  return result;
}

function generateSitemapURLs(pages: PageInfo[], baseUrl: string): SitemapURL[] {
  return pages.map(page => ({
    loc: `${baseUrl}${page.path}`,
    changefreq: getChangeFreq(page.path),
    priority: getPriority(page.path),
    lastmod: new Date().toISOString().split('T')[0]
  }));
}

function getChangeFreq(path: string): SitemapURL['changefreq'] {
  if (path === '/') return 'daily';
  if (path.includes('case-study')) return 'weekly';
  if (path.includes('technical-specs')) return 'monthly';
  return 'weekly';
}

function getPriority(path: string): string {
  if (path === '/') return '1.0';
  if (path.split('/').length === 2) return '0.8';
  if (path.includes('case-study')) return '0.7';
  return '0.5';
}

export function validateSitemap(xml: string): boolean {
  try {
    // Check XML structure
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    if (doc.querySelector('parsererror')) {
      throw new Error('Invalid XML structure');
    }

    // Check required elements
    const urls = doc.querySelectorAll('url');
    if (urls.length === 0) {
      throw new Error('Sitemap contains no URLs');
    }

    // Validate each URL
    urls.forEach(url => {
      const loc = url.querySelector('loc');
      if (!loc || !loc.textContent) {
        throw new Error('URL missing required loc element');
      }

      const priority = url.querySelector('priority');
      if (priority) {
        const value = parseFloat(priority.textContent || '');
        if (isNaN(value) || value < 0 || value > 1) {
          throw new Error('Invalid priority value');
        }
      }
    });

    return true;
  } catch (error) {
    console.error('Sitemap validation failed:', error);
    return false;
  }
}