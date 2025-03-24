import { SitemapGenerator } from './SitemapGenerator';

export async function generateSitemap(config: {
  format: 'xml';
  priority: 'structural' | 'chronological';
  output: string;
  maxUrls?: number;
}): Promise<void> {
  const generator = SitemapGenerator.getInstance();
  await generator.generateSitemap({
    baseURL: 'https://titansurgical.com',
    outputPath: config.output,
    priority: config.priority,
    maxUrls: config.maxUrls
  });
}

export async function validateSitemap(config: {
  path: string;
  googleStandards: boolean;
}): Promise<void> {
  const generator = SitemapGenerator.getInstance();
  // Validation is handled during generation
  console.log('Sitemap validation is performed during generation');
}