<template>
  <div class="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
    <!-- If active document exists, show full-screen Content Editor -->
    <div
      v-if="pdfStore.activeDocument"
      class="fixed inset-0 flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans z-10"
    >
      <!-- Privacy Header Banner -->
      <PrivacyBanner @open-privacy="isPrivacyModalOpen = true" />

      <!-- Top Navigation & Tabs Bar -->
      <Header
        @open-export="isExportModalOpen = true"
        @open-merge="isMergeModalOpen = true"
        @open-split="isSplitModalOpen = true"
        @open-website="router.push('/')"
      />

      <!-- Workspace Body -->
      <div class="flex-1 flex overflow-hidden relative">
        <ThumbnailSidebar
          @open-crop="openCropModal"
          @confirm-delete="openDeleteConfirm"
        />

        <PdfViewer />

        <!-- Always render Content Editor when on this dedicated route unless user switches tab -->
        <ContentEditorWorkspace v-if="pdfStore.activeWorkspaceTab === 'edit'" />
        <RedactionWorkspace v-else-if="pdfStore.activeWorkspaceTab === 'redact'" />
        <MetadataEditor v-else-if="pdfStore.activeWorkspaceTab === 'metadata'" />
        <RasterizerWorkspace v-else-if="pdfStore.activeWorkspaceTab === 'rasterize'" />
      </div>

      <StatusBar />
    </div>

    <!-- Empty State: Dedicated General Purpose Editor Landing -->
    <template v-else>
      <SiteNavbar @file-loaded="onFileLoaded" />

      <main class="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-6">
          <Edit3 class="w-4 h-4" />
          <span>GENERAL PURPOSE PDF CONTENT EDITOR</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
          Add Text, Insert Images, Signatures & Stamps
        </h1>

        <p class="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The 100% private in-browser document editor. Add crisp vector typography, insert corporate watermarks and logos, draw digital signatures, and apply document status badges.
        </p>

        <!-- Dedicated Dropzone -->
        <div
          class="w-full max-w-2xl mx-auto bg-gradient-to-b from-slate-900/90 to-[#0b101d]/90 border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl transition group mb-12"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <div class="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText class="w-8 h-8" />
          </div>

          <h2 class="text-2xl font-bold text-white mb-2">Drop your PDF document here to start editing</h2>
          <p class="text-xs text-slate-400 mb-6">Zero server uploads. 100% confidential in-memory processing.</p>

          <div class="flex items-center gap-3">
            <label class="cursor-pointer px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs shadow-xl shadow-cyan-500/25 transition flex items-center gap-2">
              <FolderOpen class="w-4 h-4" />
              <span>Select PDF File</span>
              <input
                type="file"
                accept="application/pdf"
                class="hidden"
                @change="handleFileInput"
              />
            </label>

            <button
              @click="loadSamplePdf"
              class="px-5 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-medium rounded-2xl text-xs border border-slate-700 transition flex items-center gap-2"
            >
              <Sparkles class="w-4 h-4 text-cyan-400" />
              <span>Try Demo Sample</span>
            </button>
          </div>
        </div>

        <!-- Tool Highlights Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left mb-16">
          <div class="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
            <Type class="w-6 h-6 text-cyan-400 mb-3" />
            <h3 class="text-sm font-bold text-white mb-1">True Vector Text</h3>
            <p class="text-xs text-slate-400">Embed Helvetica, Times, or Courier with customizable point size and color.</p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
            <Image class="w-6 h-6 text-indigo-400 mb-3" />
            <h3 class="text-sm font-bold text-white mb-1">Images & Logos</h3>
            <p class="text-xs text-slate-400">Insert transparent PNG logos, company watermarks with opacity controls.</p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
            <PenTool class="w-6 h-6 text-blue-400 mb-3" />
            <h3 class="text-sm font-bold text-white mb-1">Digital Signatures</h3>
            <p class="text-xs text-slate-400">Draw signature with stylus or mouse and stamp onto any signature block.</p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
            <Stamp class="w-6 h-6 text-emerald-400 mb-3" />
            <h3 class="text-sm font-bold text-white mb-1">Approval Badges</h3>
            <p class="text-xs text-slate-400">One-click stamps: APPROVED, CONFIDENTIAL, DRAFT, VOID, and FINAL.</p>
          </div>
        </div>

        <AdSenseSlot
          slot-name="General Editor Bottom Banner"
          format="horizontal"
          description="Google AdSense responsive placement."
        />
      </main>

      <SiteFooter />
    </template>

    <!-- Modals -->
    <PrivacyModal
      :is-open="isPrivacyModalOpen"
      @close="isPrivacyModalOpen = false"
    />

    <VerificationModal
      :is-open="redactionStore.showVerificationModal"
      :report="redactionStore.lastVerificationReport"
      :gc-stats="redactionStore.lastGcStats"
      @close="redactionStore.showVerificationModal = false"
    />

    <ConfirmModal
      :is-open="isDeleteConfirmOpen"
      title="Delete Page(s)"
      :message="`Are you sure you want to delete ${pagesToDelete.length} page(s)? This action can be undone with Ctrl+Z.`"
      confirm-text="Delete"
      :is-destructive="true"
      @confirm="executeDeletePages"
      @cancel="isDeleteConfirmOpen = false"
    />

    <CropModal
      :is-open="isCropModalOpen"
      :target-page-index="cropTargetPage"
      @close="isCropModalOpen = false"
    />

    <SplitModal
      :is-open="isSplitModalOpen"
      @close="isSplitModalOpen = false"
    />

    <MergeModal
      :is-open="isMergeModalOpen"
      @close="isMergeModalOpen = false"
    />

    <ExportModal
      :is-open="isExportModalOpen"
      @close="isExportModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Edit3,
  FileText,
  FolderOpen,
  Sparkles,
  Type,
  Image,
  PenTool,
  Stamp
} from 'lucide-vue-next'
import { usePdfStore } from '../stores/pdfStore'
import { useRedactionStore } from '../stores/redactionStore'
import { useKeyboardShortcuts } from '../composables/useKeyboardShortcuts'
import { createSyntheticFixturePdf } from '../../tests/fixtures/create-synthetic-pdf'

import SiteNavbar from '../components/website/SiteNavbar.vue'
import SiteFooter from '../components/website/SiteFooter.vue'
import AdSenseSlot from '../components/website/AdSenseSlot.vue'
import PrivacyBanner from '../components/common/PrivacyBanner.vue'
import Header from '../components/common/Header.vue'
import StatusBar from '../components/common/StatusBar.vue'
import PrivacyModal from '../components/common/PrivacyModal.vue'
import ConfirmModal from '../components/common/ConfirmModal.vue'
import ThumbnailSidebar from '../components/sidebar/ThumbnailSidebar.vue'
import PdfViewer from '../components/viewer/PdfViewer.vue'
import ContentEditorWorkspace from '../components/content-editor/ContentEditorWorkspace.vue'
import RedactionWorkspace from '../components/redaction/RedactionWorkspace.vue'
import VerificationModal from '../components/redaction/VerificationModal.vue'
import MetadataEditor from '../components/metadata/MetadataEditor.vue'
import RasterizerWorkspace from '../components/rasterizer/RasterizerWorkspace.vue'
import CropModal from '../components/page-ops/CropModal.vue'
import SplitModal from '../components/page-ops/SplitModal.vue'
import MergeModal from '../components/page-ops/MergeModal.vue'
import ExportModal from '../components/export/ExportModal.vue'

const router = useRouter()
const pdfStore = usePdfStore()
const redactionStore = useRedactionStore()

// Modals State
const isPrivacyModalOpen = ref(false)
const isExportModalOpen = ref(false)
const isMergeModalOpen = ref(false)
const isSplitModalOpen = ref(false)
const isCropModalOpen = ref(false)
const cropTargetPage = ref(0)

const isDeleteConfirmOpen = ref(false)
const pagesToDelete = ref<number[]>([])

useKeyboardShortcuts(() => {
  if (pdfStore.activeDocument) {
    isExportModalOpen.value = true
  }
})

onMounted(() => {
  // When entering general editor, default to the 'edit' workspace tab
  if (pdfStore.activeDocument) {
    pdfStore.activeWorkspaceTab = 'edit'
  }
})

function onFileLoaded() {
  pdfStore.activeWorkspaceTab = 'edit'
}

async function handleFileInput(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  for (let i = 0; i < target.files.length; i++) {
    await pdfStore.loadDocument(target.files[i])
  }
  pdfStore.activeWorkspaceTab = 'edit'
  target.value = ''
}

async function handleDrop(e: DragEvent) {
  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return
  for (let i = 0; i < files.length; i++) {
    if (files[i].type === 'application/pdf' || files[i].name.toLowerCase().endsWith('.pdf')) {
      await pdfStore.loadDocument(files[i])
    }
  }
  pdfStore.activeWorkspaceTab = 'edit'
}

async function loadSamplePdf() {
  const bytes = await createSyntheticFixturePdf()
  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
  const file = new File([blob], 'Sample_Document_For_Editing.pdf', { type: 'application/pdf' })
  await pdfStore.loadDocument(file)
  pdfStore.activeWorkspaceTab = 'edit'
}

function openCropModal(pageIndex: number) {
  cropTargetPage.value = pageIndex
  isCropModalOpen.value = true
}

function openDeleteConfirm(indices: number[]) {
  pagesToDelete.value = indices
  isDeleteConfirmOpen.value = true
}

async function executeDeletePages() {
  isDeleteConfirmOpen.value = false
  if (pagesToDelete.value.length > 0) {
    await pdfStore.deletePages(pagesToDelete.value)
    pagesToDelete.value = []
  }
}
</script>
