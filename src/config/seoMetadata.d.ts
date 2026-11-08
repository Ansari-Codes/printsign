import type { ComputedRef, Ref } from 'vue'

export interface SeoMetadataItem {
  title: string
  description: string
  h1: string
  toolMode: 'redact' | 'metadata' | 'merge' | 'split' | 'rasterize' | 'organize' | 'compress' | 'verifier' | null
  ogType?: 'website' | 'article'
  featureList?: string[]
  schema?: Record<string, unknown>
}

export declare const faqs: Array<{ question: string; answer: string }>
export declare const faqJsonLd: Record<string, unknown>
export declare const seoMetadata: Record<string, SeoMetadataItem>

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
