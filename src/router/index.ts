import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const isFileProtocol = typeof window !== 'undefined' && window.location.protocol === 'file:'

// Code-split all views into on-demand chunks so marketing/blog/compliance routes never load heavy PDF engines upfront
const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/editor', name: 'editor', component: () => import('../views/EditorView.vue') },
  { path: '/verify-redaction', name: 'verify-redaction', component: () => import('../views/VerifyRedactionView.vue') },
  { path: '/f12-network-audit', name: 'network-audit', component: () => import('../views/NetworkAuditView.vue') },
  { path: '/for-lawyers', name: 'for-lawyers', component: () => import('../views/IndustryRoleView.vue') },
  { path: '/for-healthcare', name: 'for-healthcare', component: () => import('../views/IndustryRoleView.vue') },
  { path: '/for-journalists', name: 'for-journalists', component: () => import('../views/IndustryRoleView.vue') },
  { path: '/ilovepdf-smallpdf-offline-alternative', name: 'comparison-cloud-alternative', component: () => import('../views/ComplianceComparisonView.vue') },
  { path: '/hipaa-compliant-pdf-redaction', name: 'compliance-hipaa', component: () => import('../views/ComplianceComparisonView.vue') },
  { path: '/nist-800-88-pdf-sanitization', name: 'compliance-nist', component: () => import('../views/ComplianceComparisonView.vue') },
  { path: '/redact-pdf', name: 'tool-redact', component: () => import('../views/EditorView.vue'), meta: { toolMode: 'redact' } },
  { path: '/scrub-pdf-metadata', name: 'tool-metadata', component: () => import('../views/EditorView.vue'), meta: { toolMode: 'metadata' } },
  { path: '/merge-pdf', name: 'tool-merge', component: () => import('../views/EditorView.vue'), meta: { toolMode: 'merge' } },
  { path: '/split-pdf', name: 'tool-split', component: () => import('../views/EditorView.vue'), meta: { toolMode: 'split' } },
  { path: '/flatten-rasterize-pdf', name: 'tool-rasterize', component: () => import('../views/EditorView.vue'), meta: { toolMode: 'rasterize' } },
  { path: '/reorder-rotate-pdf', name: 'tool-organize', component: () => import('../views/EditorView.vue'), meta: { toolMode: 'organize' } },
  { path: '/compress-pdf', name: 'tool-compress', component: () => import('../views/EditorView.vue'), meta: { toolMode: 'compress' } },
  { path: '/general-editor', name: 'general-editor', component: () => import('../views/GeneralEditorView.vue') },
  { path: '/document-editor', redirect: '/general-editor' },
  { path: '/features', name: 'features', component: () => import('../views/FeaturesView.vue') },
  { path: '/security-architecture', redirect: '/features' },
  { path: '/about-us', name: 'about', component: () => import('../views/AboutView.vue') },
  { path: '/contact-us', name: 'contact', component: () => import('../views/ContactView.vue') },
  { path: '/privacy-policy', name: 'privacy', component: () => import('../views/PrivacyPolicyView.vue') },
  { path: '/terms-of-service', name: 'terms', component: () => import('../views/TermsView.vue') },
  { path: '/cookie-policy', name: 'cookies', component: () => import('../views/CookiePolicyView.vue') },
  { path: '/guides', name: 'guides', component: () => import('../views/GuidesView.vue') },
  { path: '/blog', name: 'blog', component: () => import('../views/BlogIndexView.vue') },
  { path: '/blog/:slug', name: 'blog-post', component: () => import('../views/BlogPostView.vue') },
  { path: '/faq', name: 'faq', component: () => import('../views/FaqView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export const router = createRouter({
  history: isFileProtocol ? createWebHashHistory() : createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  }
})
