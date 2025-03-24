import { PageGenerator } from './PageGenerator';
import { SitemapGenerator } from '../sitemap/SitemapGenerator';
import { TemplateManager } from '../templates/TemplateManager';
import { NotificationManager } from '../notify/NotificationManager';

interface BatchConfig {
  source: string;
  count: number;
  template: string;
  strategy: 'sparse-content' | 'full-content';
}

export class BatchPageGenerator {
  private static instance: BatchPageGenerator;
  private pageGenerator: PageGenerator;
  private sitemapGenerator: SitemapGenerator;
  private templateManager: TemplateManager;
  private notificationManager: NotificationManager;

  private constructor() {
    this.pageGenerator = PageGenerator.getInstance();
    this.sitemapGenerator = SitemapGenerator.getInstance();
    this.templateManager = TemplateManager.getInstance();
    this.notificationManager = NotificationManager.getInstance();
  }

  static getInstance(): BatchPageGenerator {
    if (!this.instance) {
      this.instance = new BatchPageGenerator();
    }
    return this.instance;
  }

  async generateBatch(config: BatchConfig): Promise<void> {
    try {
      // Validate template
      const template = this.templateManager.getTemplate(config.template);
      if (!template) {
        throw new Error(`Template "${config.template}" not found`);
      }

      // Load sitemap
      const sitemap = await this.loadSitemap(config.source);
      const urls = this.extractURLs(sitemap, config.count);

      // Generate pages
      await Promise.all(urls.map(url => 
        this.generatePage(url, template, config.strategy)
      ));

      this.notificationManager.success(
        `Generated ${urls.length} pages successfully`,
        { title: 'Batch Generation Complete' }
      );
    } catch (error) {
      this.notificationManager.error(
        'Failed to generate pages',
        { 
          title: 'Generation Error',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      );
      throw error;
    }
  }

  private async loadSitemap(source: string): Promise<Document> {
    const parser = new DOMParser();
    const sitemap = await fetch(source).then(res => res.text());
    return parser.parseFromString(sitemap, 'application/xml');
  }

  private extractURLs(sitemap: Document, count: number): string[] {
    const urls = Array.from(sitemap.querySelectorAll('url loc'))
      .map(loc => loc.textContent)
      .filter((url): url is string => url !== null)
      .slice(0, count);

    if (urls.length < count) {
      this.notificationManager.warning(
        `Only found ${urls.length} URLs in sitemap`,
        { title: 'URL Count Warning' }
      );
    }

    return urls;
  }

  private async generatePage(
    url: string, 
    template: any, 
    strategy: 'sparse-content' | 'full-content'
  ): Promise<void> {
    const path = new URL(url).pathname;
    const segments = path.split('/').filter(Boolean);
    
    const pageData = {
      title: this.generateTitle(segments),
      description: this.generateDescription(segments),
      content: await this.generateContent(strategy),
      meta: {
        canonical: url,
        template: template.id,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    };

    await this.pageGenerator.generatePages({
      source: JSON.stringify(pageData),
      template: template.id,
      depth: segments.length,
      output: path
    });
  }

  private generateTitle(segments: string[]): string {
    return segments
      .map(s => s.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      )
      .join(' | ');
  }

  private generateDescription(segments: string[]): string {
    const topic = segments[segments.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return `Learn about ${topic} with Titan Surgical Systems. Discover how our advanced dental technology and marketing solutions can transform your practice.`;
  }

  private async generateContent(strategy: 'sparse-content' | 'full-content'): Promise<any> {
    if (strategy === 'sparse-content') {
      return {
        sections: [
          {
            type: 'hero',
            content: {
              title: '{{title}}',
              subtitle: '{{description}}',
              backgroundImage: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80'
            }
          },
          {
            type: 'content',
            content: {
              text: 'Content coming soon...'
            }
          }
        ]
      };
    }

    // Full content strategy would generate more comprehensive content
    return {
      sections: [
        {
          type: 'hero',
          content: {
            title: '{{title}}',
            subtitle: '{{description}}',
            backgroundImage: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80'
          }
        },
        {
          type: 'content',
          content: {
            text: 'Detailed content would be generated here...'
          }
        },
        {
          type: 'cta',
          content: {
            title: 'Ready to Learn More?',
            buttonText: 'Contact Us',
            buttonLink: '/contact'
          }
        }
      ]
    };
  }
}