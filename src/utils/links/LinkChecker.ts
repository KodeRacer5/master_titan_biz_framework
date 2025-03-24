import { NotificationManager } from '../notify/NotificationManager';

interface LinkCheckResult {
  url: string;
  isValid: boolean;
  statusCode?: number;
  error?: string;
  component?: string;
  section?: string;
}

export class LinkChecker {
  private static instance: LinkChecker;
  private notificationManager: NotificationManager;
  private checkedUrls: Set<string> = new Set();
  private results: LinkCheckResult[] = [];

  private constructor() {
    this.notificationManager = NotificationManager.getInstance();
  }

  static getInstance(): LinkChecker {
    if (!this.instance) {
      this.instance = new LinkChecker();
    }
    return this.instance;
  }

  async checkSection(sectionId: string): Promise<LinkCheckResult[]> {
    this.results = [];
    this.checkedUrls.clear();

    const section = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (!section) {
      this.notificationManager.error(`Section ${sectionId} not found`);
      return [];
    }

    await this.scanElement(section, sectionId);
    return this.results;
  }

  async checkFullSite(): Promise<LinkCheckResult[]> {
    this.results = [];
    this.checkedUrls.clear();

    const sections = document.querySelectorAll('[data-section-id]');
    for (const section of sections) {
      const sectionId = section.getAttribute('data-section-id');
      if (sectionId) {
        await this.scanElement(section, sectionId);
      }
    }

    return this.results;
  }

  private async scanElement(element: Element, sectionId: string): Promise<void> {
    // Check links
    const links = element.querySelectorAll('a');
    for (const link of links) {
      const url = link.href;
      if (!url || this.checkedUrls.has(url)) continue;

      this.checkedUrls.add(url);
      await this.checkUrl(url, sectionId, link.closest('[data-component]')?.getAttribute('data-component'));
    }

    // Check images
    const images = element.querySelectorAll('img');
    for (const img of images) {
      const url = img.src;
      if (!url || this.checkedUrls.has(url)) continue;

      this.checkedUrls.add(url);
      await this.checkUrl(url, sectionId, img.closest('[data-component]')?.getAttribute('data-component'));
    }

    // Check background images
    const elementsWithBg = element.querySelectorAll('[style*="background-image"]');
    for (const el of elementsWithBg) {
      const style = window.getComputedStyle(el);
      const bgUrl = style.backgroundImage.slice(4, -1).replace(/["']/g, "");
      if (!bgUrl || this.checkedUrls.has(bgUrl)) continue;

      this.checkedUrls.add(bgUrl);
      await this.checkUrl(bgUrl, sectionId, el.closest('[data-component]')?.getAttribute('data-component'));
    }
  }

  private async checkUrl(url: string, section: string, component?: string | null): Promise<void> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const result: LinkCheckResult = {
        url,
        isValid: response.ok,
        statusCode: response.status,
        section,
        component: component || undefined
      };

      if (!response.ok) {
        result.error = `HTTP ${response.status}: ${response.statusText}`;
        this.notificationManager.warning(`Broken link found: ${url}`, {
          title: 'Link Check',
          duration: 5000
        });
      }

      this.results.push(result);
    } catch (error) {
      const result: LinkCheckResult = {
        url,
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        section,
        component: component || undefined
      };

      this.results.push(result);
      this.notificationManager.error(`Failed to check link: ${url}`, {
        title: 'Link Check Error',
        duration: 5000
      });
    }
  }

  public getResults(): LinkCheckResult[] {
    return [...this.results];
  }

  public generateReport(): string {
    const validLinks = this.results.filter(r => r.isValid);
    const brokenLinks = this.results.filter(r => !r.isValid);

    return `
Link Check Report
================

Summary
-------
Total Links Checked: ${this.results.length}
Valid Links: ${validLinks.length}
Broken Links: ${brokenLinks.length}

Broken Links Details
------------------
${brokenLinks.map(link => `
URL: ${link.url}
Section: ${link.section}
${link.component ? `Component: ${link.component}` : ''}
Error: ${link.error || `Status Code: ${link.statusCode}`}
`).join('\n')}
`;
  }
}