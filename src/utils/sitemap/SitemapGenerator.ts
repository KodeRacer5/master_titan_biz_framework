import { NotificationManager } from '../notify/NotificationManager';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface SitemapConfig {
  baseURL: string;
  outputPath: string;
  priority: 'structural' | 'chronological';
  maxUrls?: number;
}

export class SitemapGenerator {
  private static instance: SitemapGenerator;
  private notificationManager: NotificationManager;
  private readonly GOOGLE_MAX_URLS = 50000;
  private readonly GOOGLE_MAX_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly DEFAULT_PRIORITIES = {
    home: 1.0,
    sections: 0.8,
    features: 0.6,
    articles: 0.4
  };

  private constructor() {
    this.notificationManager = NotificationManager.getInstance();
  }

  static getInstance(): SitemapGenerator {
    if (!this.instance) {
      this.instance = new SitemapGenerator();
    }
    return this.instance;
  }

  async generateSitemap(config: SitemapConfig): Promise<string> {
    try {
      const urls = await this.collectURLs(config);
      
      if (config.maxUrls && urls.length > config.maxUrls) {
        throw new Error(`URL count (${urls.length}) exceeds maximum limit (${config.maxUrls})`);
      }

      const sitemap = this.generateXML(urls);
      await this.validateSitemap(sitemap);
      await this.saveSitemap(sitemap, config.outputPath);

      this.notificationManager.success('Sitemap generated successfully', {
        title: 'Sitemap Generation',
        duration: 3000
      });

      return sitemap;
    } catch (error) {
      this.notificationManager.error('Failed to generate sitemap', {
        title: 'Sitemap Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      throw error;
    }
  }

  private async collectURLs(config: SitemapConfig): Promise<SitemapURL[]> {
    const urls: SitemapURL[] = [
      {
        loc: config.baseURL,
        priority: this.DEFAULT_PRIORITIES.home,
        changefreq: 'weekly'
      },
      {
        loc: `${config.baseURL}/digital-scanning`,
        priority: this.DEFAULT_PRIORITIES.sections,
        changefreq: 'monthly'
      },
      {
        loc: `${config.baseURL}/marketing-strategy`,
        priority: this.DEFAULT_PRIORITIES.sections,
        changefreq: 'monthly'
      },
      {
        loc: `${config.baseURL}/lab-services`,
        priority: this.DEFAULT_PRIORITIES.sections,
        changefreq: 'monthly'
      },
      {
        loc: `${config.baseURL}/insights`,
        priority: this.DEFAULT_PRIORITIES.features,
        changefreq: 'weekly'
      }
    ];

    // Add dynamic routes based on project structure
    const dynamicRoutes = await this.collectDynamicRoutes(config);
    urls.push(...dynamicRoutes);

    return this.prioritizeURLs(urls, config.priority);
  }

  private async collectDynamicRoutes(config: SitemapConfig): Promise<SitemapURL[]> {
    // Implementation would scan project for dynamic routes
    return [];
  }

  private prioritizeURLs(urls: SitemapURL[], strategy: 'structural' | 'chronological'): SitemapURL[] {
    if (strategy === 'structural') {
      return urls.sort((a, b) => {
        const depthA = (a.loc.match(/\//g) || []).length;
        const depthB = (b.loc.match(/\//g) || []).length;
        return depthA - depthB;
      });
    } else {
      return urls.sort((a, b) => {
        const dateA = a.lastmod ? new Date(a.lastmod).getTime() : 0;
        const dateB = b.lastmod ? new Date(b.lastmod).getTime() : 0;
        return dateB - dateA;
      });
    }
  }

  private generateXML(urls: SitemapURL[]): string {
    const urlElements = urls.map(url => `
      <url>
        <loc>${this.escapeXML(url.loc)}</loc>
        ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
        ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
        ${url.priority ? `<priority>${url.priority.toFixed(1)}</priority>` : ''}
      </url>
    `).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
  }

  private escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private async validateSitemap(sitemap: string): Promise<void> {
    // Check size
    const sitemapSize = new Blob([sitemap]).size;
    if (sitemapSize > this.GOOGLE_MAX_SIZE) {
      throw new Error(`Sitemap size (${sitemapSize} bytes) exceeds Google's limit (${this.GOOGLE_MAX_SIZE} bytes)`);
    }

    // Check URL count
    const urlCount = (sitemap.match(/<url>/g) || []).length;
    if (urlCount > this.GOOGLE_MAX_URLS) {
      throw new Error(`URL count (${urlCount}) exceeds Google's limit (${this.GOOGLE_MAX_URLS})`);
    }

    // Validate XML structure
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(sitemap, 'application/xml');
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML structure');
      }
    } catch (error) {
      throw new Error(`XML validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async saveSitemap(sitemap: string, outputPath: string): Promise<void> {
    try {
      // In a real environment, this would write to the filesystem
      console.log('Sitemap saved to:', outputPath);
      console.log(sitemap);
    } catch (error) {
      throw new Error(`Failed to save sitemap: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}