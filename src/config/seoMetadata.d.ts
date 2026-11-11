import type { ComputedRef, Ref } from 'vue'

export interface SeoMetadataItem {
  title: string
  description: string
  h1: string
  toolMode: 'redact' | 'metadata' | 'merge' | 'split' | 'rasterize' | 'organize' | 'compress' | 'sign' | 'decrypt' | 'watermark' | 'extract' | 'verifier' | 'comparison' | 'compliance' | 'audit' | 'role' | null
  ogType?: 'website' | 'article'
  ogImage?: string
  ogImageAlt?: string
  featureList?: string[]
  schema?: Record<string, unknown>
}

export declare const faqs: Array<{ question: string; answer: string }>
export declare const faqJsonLd: Record<string, unknown>
export declare const seoMetadata: Record<string, SeoMetadataItem>

export declare function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>): Record<string, unknown>
export declare function buildHowToSchema(name: string, description: string, url: string, steps: Array<{ name: string; text: string }>): Record<string, unknown>
export declare function buildSoftwareSourceCodeSchema(): Record<string, unknown>

export declare function buildWebApplicationSchema(
  name: string,
  description: string,
  url: string,
  featureList?: string[]
): Record<string, unknown>

export declare function getRouteSeo(routePath?: string | null): SeoMetadataItem

export declare function useRouteSeo(
  routePath?: string | Ref<string> | (() => string) | null
): {
  seoData: ComputedRef<SeoMetadataItem>
  currentPath: ComputedRef<string>
}
