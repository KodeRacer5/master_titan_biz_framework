import { BatchPageGenerator } from './BatchPageGenerator';
import { PageGenerator } from './PageGenerator';
import { PageRelationManager } from './PageRelationManager';

export async function generateBatchPages(config: {
  source: string;
  count: number;
  template: string;
  strategy: 'sparse-content' | 'full-content';
}): Promise<void> {
  const generator = BatchPageGenerator.getInstance();
  await generator.generateBatch(config);
}

export async function generateLinkedPages(config: {
  source: string;
  template: string;
  depth: number;
  output: string;
}): Promise<void> {
  const generator = PageGenerator.getInstance();
  await generator.generatePages(config);
}

export async function createPageRelations(config: {
  menuSource: string[];
  strategy: 'bidirectional-linking' | 'hierarchical';
  versionGap: number;
}): Promise<void> {
  const relationManager = PageRelationManager.getInstance();
  await relationManager.createRelations(config);
}