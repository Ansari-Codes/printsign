import type { ComputedRef, Ref } from 'vue'

export interface SeoRouteConfig {
  title: string
  description: string
  h1: string
  toolMode: 'redact' | 'metadata' | 'merge' | 'split' | 'rasterize' | 'organize' | 'compress' | null
  featureList: string[]
}

export declare const seoRoutes: Record<string, SeoRouteConfig>

export declare function getRouteSeo(routePath?: string | null): SeoRouteConfig

export declare function useRouteSeo(
  routePath?: string | Ref<string> | (() => string) | null
): {
  seoData: ComputedRef<SeoRouteConfig>
  currentPath: ComputedRef<string>
}
