<template>
  <div class="fixed inset-0 flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans z-10">
    <!-- Privacy Header Banner -->
    <PrivacyBanner @open-privacy="isPrivacyModalOpen = true" />

    <!-- Application Top Navigation & Tabs Bar -->
    <Header
      @open-export="isExportModalOpen = true"
      @open-merge="isMergeModalOpen = true"
      @open-split="isSplitModalOpen = true"
      @open-website="router.push('/')"
    />

    <!-- Main Workspace Body -->
    <div class="flex-1 flex overflow-hidden relative">
      <!-- Left Thumbnail Navigation Sidebar -->
      <ThumbnailSidebar
        v-if="pdfStore.activeDocument"
        @open-crop="openCropModal"
        @confirm-delete="openDeleteConfirm"
      />

      <!-- Central Document Canvas Viewport -->
      <PdfViewer
        :tool-heading="seoData.h1"
        :tool-description="seoData.description"
      />

      <!-- Hidden semantic heading for search crawlers and a11y when document is active -->
      <h1 v-if="pdfStore.activeDocument" class="sr-only">
        {{ seoData.h1 }}
      </h1>

      <!-- Right Workspaces (Contextual) -->
      <template v-if="pdfStore.activeDocument">
        <!-- Content Editor Workspace -->
        <ContentEditorWorkspace v-if="pdfStore.activeWorkspaceTab === 'edit'" />

        <!-- Redaction Workspace -->
        <RedactionWorkspace v-if="pdfStore.activeWorkspaceTab === 'redact'" />

        <!-- Metadata Workspace -->
        <MetadataEditor v-if="pdfStore.activeWorkspaceTab === 'metadata'" />

        <!-- Rasterization Workspace -->
        <RasterizerWorkspace v-if="pdfStore.activeWorkspaceTab === 'rasterize'" />
      </template>
    </div>

    <!-- Bottom Status Bar -->
    <StatusBar />

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
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePdfStore } from '../stores/pdfStore'
import { useRedactionStore } from '../stores/redactionStore'
import { useKeyboardShortcuts } from '../composables/useKeyboardShortcuts'
import { useRouteSeo } from '../config/seoRoutes'

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
const route = useRoute()
const pdfStore = usePdfStore()
const redactionStore = useRedactionStore()

const { seoData } = useRouteSeo(() => route.path)

function syncToolMode(toolMode?: string | null) {
  const mode = toolMode || (route.meta.toolMode as string | undefined)
  if (!mode) return

  if (mode === 'redact') {
    pdfStore.activeWorkspaceTab = 'redact'
  } else if (mode === 'metadata') {
    pdfStore.activeWorkspaceTab = 'metadata'
  } else if (mode === 'rasterize') {
    pdfStore.activeWorkspaceTab = 'rasterize'
  } else if (mode === 'organize') {
    pdfStore.activeWorkspaceTab = 'view'
  } else if (mode === 'merge') {
    pdfStore.activeWorkspaceTab = 'view'
    if (pdfStore.activeDocument) {
      isMergeModalOpen.value = true
    }
  } else if (mode === 'split' || mode === 'extract') {
    pdfStore.activeWorkspaceTab = 'view'
    if (pdfStore.activeDocument) {
      isSplitModalOpen.value = true
    }
  } else if (mode === 'compress' || mode === 'decrypt') {
    pdfStore.activeWorkspaceTab = 'view'
    if (pdfStore.activeDocument) {
      isExportModalOpen.value = true
    }
  } else if (mode === 'sign' || mode === 'watermark') {
    pdfStore.activeWorkspaceTab = 'edit'
  }
}

onMounted(() => {
  syncToolMode()
})

watch(
  () => route.path,
  () => {
    syncToolMode()
  }
)

watch(
  () => pdfStore.activeDocument,
  (doc) => {
    if (doc) {
      syncToolMode()
    }
  }
)

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
