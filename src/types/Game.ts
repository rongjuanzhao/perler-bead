/**
 * Game category enumeration
 */
export enum GameCategory {
  GARDEN = 'garden',
  PUZZLE = 'puzzle',
  STRATEGY = 'strategy',
  CASUAL = 'casual'
}

/**
 * Core game configuration interface
 */
export interface GameConfig {
  id: string;
  title: string;
  description: string;
  iframeUrl: string;
  thumbnailUrl: string;
  category: GameCategory;
  tags: string[];
}

/**
 * Extended game interface with additional metadata
 */
export interface Game extends GameConfig {
  longDescription?: string;
  featured: boolean;
  seoSlug: string;
  metaDescription: string;
  instructions?: string[];
  controls?: string[];
}

/**
 * SEO configuration interface
 */
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl: string;
}