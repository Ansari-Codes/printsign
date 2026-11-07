import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EditorView from '../views/EditorView.vue'
import FeaturesView from '../views/FeaturesView.vue'
import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue'
import TermsView from '../views/TermsView.vue'
import CookiePolicyView from '../views/CookiePolicyView.vue'
import GuidesView from '../views/GuidesView.vue'
import FaqView from '../views/FaqView.vue'
import GeneralEditorView from '../views/GeneralEditorView.vue'
import BlogIndexView from '../views/BlogIndexView.vue'
import BlogPostView from '../views/BlogPostView.vue'

const isFileProtocol = typeof window !== 'undefined' && window.location.protocol === 'file:'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/editor', name: 'editor', component: EditorView },
  { path: '/redact-pdf', name: 'tool-redact', component: EditorView, meta: { toolMode: 'redact' } },
  { path: '/scrub-pdf-metadata', name: 'tool-metadata', component: EditorView, meta: { toolMode: 'metadata' } },
  { path: '/merge-pdf', name: 'tool-merge', component: EditorView, meta: { toolMode: 'merge' } },
  { path: '/split-pdf', name: 'tool-split', component: EditorView, meta: { toolMode: 'split' } },
  { path: '/flatten-rasterize-pdf', name: 'tool-rasterize', component: EditorView, meta: { toolMode: 'rasterize' } },
  { path: '/reorder-rotate-pdf', name: 'tool-organize', component: EditorView, meta: { toolMode: 'organize' } },
  { path: '/compress-pdf', name: 'tool-compress', component: EditorView, meta: { toolMode: 'compress' } },
  { path: '/general-editor', name: 'general-editor', component: GeneralEditorView },
  { path: '/document-editor', redirect: '/general-editor' },
  { path: '/features', name: 'features', component: FeaturesView },
  { path: '/security-architecture', redirect: '/features' },
  { path: '/about-us', name: 'about', component: AboutView },
  { path: '/contact-us', name: 'contact', component: ContactView },
  { path: '/privacy-policy', name: 'privacy', component: PrivacyPolicyView },
  { path: '/terms-of-service', name: 'terms', component: TermsView },
  { path: '/cookie-policy', name: 'cookies', component: CookiePolicyView },
  { path: '/guides', name: 'guides', component: GuidesView },
  { path: '/blog', name: 'blog', component: BlogIndexView },
  { path: '/blog/:slug', name: 'blog-post', component: BlogPostView },
  { path: '/faq', name: 'faq', component: FaqView },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export const router = createRouter({
  history: isFileProtocol ? createWebHashHistory() : createWebHistory(),
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
