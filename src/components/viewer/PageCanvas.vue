<template>
  <div
    ref="pageContainerRef"
    class="relative bg-white shadow-[0_12px_45px_rgba(0,0,0,0.7),0_0_25px_rgba(56,189,248,0.06)] ring-1 ring-slate-700/60 rounded-md transition-all duration-150 select-none overflow-hidden"
    :style="{
      width: `${displayWidth}px`,
      height: `${displayHeight}px`,
      margin: '0 auto 28px auto'
    }"
  >
    <!-- Lazy loaded Canvas when in or near viewport (overscan buffer) -->
    <canvas
      v-if="isNearViewport"
      ref="canvasRef"
      class="block w-full h-full rounded-md"
    ></canvas>

    <!-- Lightweight Skeleton Placeholder when outside viewport buffer -->
    <div
      v-else
      class="w-full h-full flex flex-col items-center justify-center bg-slate-950/40 text-slate-400 font-mono text-xs gap-2 select-none"
    >
      <div class="w-7 h-7 rounded-full border-2 border-slate-800 border-t-cyan-400 animate-spin"></div>
      <span class="text-[11px] text-slate-400">Page {{ pageIndex + 1 }}</span>
    </div>

    <!-- Content Annotations Layer (rendered when in viewport) -->
    <div
      v-if="isNearViewport"
      class="absolute inset-0 overflow-visible"
      :class="{
        'cursor-default pointer-events-auto': isEditMode,
        'pointer-events-none': !isEditMode
      }"
      @mousedown="isEditMode ? handleCanvasClick($event) : undefined"
    >
      <!-- Text Items -->
      <div
        v-for="item in pageTexts"
        :key="item.id"
        class="absolute select-none group"
        :class="[
          contentStore.selectedItemId === item.id
            ? 'ring-2 ring-cyan-400 bg-cyan-950/20 shadow-2xl z-40'
            : isEditMode
              ? 'hover:ring-1 hover:ring-cyan-400/60 cursor-move z-20'
              : 'z-10'
        ]"
        :style="{
          left: `${item.x * props.scale}px`,
          top: `${item.y * props.scale}px`,
          width: `${item.width * props.scale}px`,
          height: `${item.height * props.scale}px`
        }"
        @mousedown.stop="isEditMode ? selectAndStartDrag(item, 'text', $event) : undefined"
      >
        <textarea
          v-if="isEditMode && contentStore.selectedItemId === item.id"
          v-model="item.text"
          class="w-full h-full bg-slate-900/90 text-white border-0 outline-hidden resize-none p-1 rounded font-sans cursor-text shadow-inner"
          :style="{
            fontSize: `${item.fontSize * props.scale}px`,
            color: item.color,
            fontFamily: getCssFontFamily(item.fontFamily),
            lineHeight: 1.25
          }"
          @mousedown.stop
        />
        <div
          v-else
          class="w-full h-full whitespace-pre-wrap break-words p-1 leading-tight select-none overflow-hidden"
          :style="{
            fontSize: `${item.fontSize * props.scale}px`,
            color: item.color,
            fontFamily: getCssFontFamily(item.fontFamily),
            lineHeight: 1.25
          }"
        >
          {{ item.text }}
        </div>

        <!-- Resize Handles & Floating Toolbar when selected in edit mode -->
        <template v-if="isEditMode && contentStore.selectedItemId === item.id">
          <!-- 8 Resize handles -->
          <div
            class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-cyan-400 rounded-full cursor-nwse-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(item, 'nw', $event)"
          />
          <div
            class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-cyan-400 rounded-full cursor-nesw-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(item, 'ne', $event)"
          />
          <div
            class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-cyan-400 rounded-full cursor-nwse-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(item, 'se', $event)"
          />
          <div
            class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-cyan-400 rounded-full cursor-nesw-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(item, 'sw', $event)"
          />
          <div
            class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-cyan-400 rounded-full cursor-ns-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(item, 'n', $event)"
          />
          <div
            class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-cyan-400 rounded-full cursor-ns-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(item, 's', $event)"
          />
          <div
            class="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-cyan-400 rounded-full cursor-ew-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(item, 'w', $event)"
          />
          <div
            class="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-cyan-400 rounded-full cursor-ew-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(item, 'e', $event)"
          />

          <!-- Floating quick toolbar -->
          <div
            class="absolute left-0 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 px-2 py-1 rounded-xl shadow-2xl flex items-center gap-1.5 z-50 text-white whitespace-nowrap"
            :class="item.y * props.scale < 42 ? 'top-full mt-2' : '-top-11'"
            @mousedown.stop
          >
            <button
              @click.stop="adjustTextFontSize(item, -2)"
              class="px-1.5 py-0.5 hover:bg-slate-800 rounded text-[11px] font-bold text-slate-300 hover:text-white"
              title="Smaller font"
            >
              A-
            </button>
            <span class="text-[10px] font-mono text-cyan-400 px-1">{{ item.fontSize }}pt</span>
            <button
              @click.stop="adjustTextFontSize(item, 2)"
              class="px-1.5 py-0.5 hover:bg-slate-800 rounded text-[11px] font-bold text-slate-300 hover:text-white"
              title="Larger font"
            >
              A+
            </button>
            <div class="w-px h-3 bg-slate-700 mx-0.5"></div>
            <button
              @click.stop="contentStore.duplicateSelectedItem"
              class="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400 transition"
              title="Duplicate (Ctrl+D)"
            >
              <Copy class="w-3.5 h-3.5" />
            </button>
            <button
              @click.stop="contentStore.deleteSelectedItem"
              class="p-1 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-400 transition"
              title="Delete (Del)"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </template>
      </div>

      <!-- Image Items -->
      <div
        v-for="img in pageImages"
        :key="img.id"
        class="absolute select-none group"
        :class="[
          contentStore.selectedItemId === img.id
            ? 'ring-2 ring-indigo-400 shadow-2xl z-40'
            : isEditMode
              ? 'hover:ring-1 hover:ring-indigo-400/60 cursor-move z-20'
              : 'z-10'
        ]"
        :style="{
          left: `${img.x * props.scale}px`,
          top: `${img.y * props.scale}px`,
          width: `${img.width * props.scale}px`,
          height: `${img.height * props.scale}px`
        }"
        @mousedown.stop="isEditMode ? selectAndStartDrag(img, 'image', $event) : undefined"
      >
        <img
          :src="img.previewUrl"
          class="w-full h-full object-contain pointer-events-none select-none"
          :style="{ opacity: img.opacity }"
        />

        <!-- Resize Handles & Floating Toolbar when selected in edit mode -->
        <template v-if="isEditMode && contentStore.selectedItemId === img.id">
          <!-- 8 Resize handles -->
          <div
            class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-400 rounded-full cursor-nwse-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(img, 'nw', $event)"
          />
          <div
            class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-400 rounded-full cursor-nesw-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(img, 'ne', $event)"
          />
          <div
            class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-400 rounded-full cursor-nwse-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(img, 'se', $event)"
          />
          <div
            class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-400 rounded-full cursor-nesw-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(img, 'sw', $event)"
          />
          <div
            class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-indigo-400 rounded-full cursor-ns-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(img, 'n', $event)"
          />
          <div
            class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-indigo-400 rounded-full cursor-ns-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(img, 's', $event)"
          />
          <div
            class="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-indigo-400 rounded-full cursor-ew-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(img, 'w', $event)"
          />
          <div
            class="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-indigo-400 rounded-full cursor-ew-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(img, 'e', $event)"
          />

          <!-- Floating quick toolbar -->
          <div
            class="absolute left-0 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 px-2 py-1 rounded-xl shadow-2xl flex items-center gap-1.5 z-50 text-white whitespace-nowrap"
            :class="img.y * props.scale < 42 ? 'top-full mt-2' : '-top-11'"
            @mousedown.stop
          >
            <span class="text-[10px] font-mono text-indigo-300 px-1">{{ Math.round(img.opacity * 100) }}%</span>
            <button
              @click.stop="cycleImageOpacity(img)"
              class="px-1.5 py-0.5 hover:bg-slate-800 rounded text-[10px] text-slate-300 hover:text-white"
              title="Cycle Opacity"
            >
              Opacity
            </button>
            <div class="w-px h-3 bg-slate-700 mx-0.5"></div>
            <button
              @click.stop="contentStore.duplicateSelectedItem"
              class="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-400 transition"
              title="Duplicate (Ctrl+D)"
            >
              <Copy class="w-3.5 h-3.5" />
            </button>
            <button
              @click.stop="contentStore.deleteSelectedItem"
              class="p-1 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-400 transition"
              title="Delete (Del)"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </template>
      </div>

      <!-- Stamp Items -->
      <div
        v-for="stamp in pageStamps"
        :key="stamp.id"
        class="absolute select-none flex items-center justify-center font-bold uppercase tracking-wider text-center shadow-lg rounded-md border-2 group"
        :class="[
          contentStore.selectedItemId === stamp.id
            ? 'ring-2 ring-emerald-400 shadow-2xl z-40'
            : isEditMode
              ? 'hover:ring-1 hover:ring-emerald-400/60 cursor-move z-20'
              : 'z-10'
        ]"
        :style="{
          left: `${stamp.x * props.scale}px`,
          top: `${stamp.y * props.scale}px`,
          width: `${stamp.width * props.scale}px`,
          height: `${stamp.height * props.scale}px`,
          borderColor: stamp.color,
          color: stamp.color,
          backgroundColor: stamp.color + '20',
          fontSize: `${Math.max(8, Math.min(28, Math.round(stamp.height * 0.42))) * props.scale}px`
        }"
        @mousedown.stop="isEditMode ? selectAndStartDrag(stamp, 'stamp', $event) : undefined"
      >
        <span class="pointer-events-none truncate px-1">{{ stamp.label }}</span>

        <!-- Resize Handles & Floating Toolbar when selected in edit mode -->
        <template v-if="isEditMode && contentStore.selectedItemId === stamp.id">
          <!-- 8 Resize handles -->
          <div
            class="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-emerald-400 rounded-full cursor-nwse-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(stamp, 'nw', $event)"
          />
          <div
            class="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-emerald-400 rounded-full cursor-nesw-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(stamp, 'ne', $event)"
          />
          <div
            class="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-emerald-400 rounded-full cursor-nwse-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(stamp, 'se', $event)"
          />
          <div
            class="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-emerald-400 rounded-full cursor-nesw-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(stamp, 'sw', $event)"
          />
          <div
            class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-emerald-400 rounded-full cursor-ns-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(stamp, 'n', $event)"
          />
          <div
            class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-emerald-400 rounded-full cursor-ns-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(stamp, 's', $event)"
          />
          <div
            class="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-emerald-400 rounded-full cursor-ew-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(stamp, 'w', $event)"
          />
          <div
            class="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-emerald-400 rounded-full cursor-ew-resize shadow-sm z-50 hover:scale-125 transition-transform"
            @mousedown.stop.prevent="startResize(stamp, 'e', $event)"
          />

          <!-- Floating quick toolbar -->
          <div
            class="absolute left-0 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 px-2 py-1 rounded-xl shadow-2xl flex items-center gap-1.5 z-50 text-white whitespace-nowrap"
            :class="stamp.y * props.scale < 42 ? 'top-full mt-2' : '-top-11'"
            @mousedown.stop
          >
            <span class="text-[10px] font-bold uppercase text-emerald-400 px-1">{{ stamp.label }}</span>
            <div class="w-px h-3 bg-slate-700 mx-0.5"></div>
            <button
              @click.stop="contentStore.duplicateSelectedItem"
              class="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-400 transition"
              title="Duplicate (Ctrl+D)"
            >
              <Copy class="w-3.5 h-3.5" />
            </button>
            <button
              @click.stop="contentStore.deleteSelectedItem"
              class="p-1 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-400 transition"
              title="Delete (Del)"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Interactive Redaction Overlay Layer (when in redaction mode and in viewport) -->
    <div
      v-if="isRedactionMode && isNearViewport"
      ref="overlayRef"
      class="absolute inset-0 cursor-crosshair overflow-hidden rounded-md z-30"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
    >
      <!-- Existing Redaction Boxes on this page -->
      <div
        v-for="box in pageBoxes"
        :key="box.id"
        :class="[
          'group absolute flex items-center justify-center transition border-2 border-rose-500 shadow-lg shadow-rose-500/30',
          box.preset === 'solid' ? 'bg-black' : 'bg-black/95 text-white font-bold'
        ]"
        :style="getBoxStyle(box)"
      >
        <span
          v-if="box.preset === 'redacted_text'"
          class="text-[9px] tracking-widest pointer-events-none select-none text-rose-200 bg-rose-950/80 px-1 py-0.5 rounded border border-rose-500/40 uppercase font-mono"
        >
          REDACTED
        </span>

        <!-- Delete button on hover -->
        <button
          @click.stop="redactionStore.removeBox(box.id)"
          class="absolute -top-2.5 -right-2.5 w-5 h-5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg shadow-rose-500/40 z-10"
          title="Delete redaction box"
        >
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Currently drawing rectangle preview -->
      <div
        v-if="isDrawing && currentRect"
        class="absolute bg-gradient-to-br from-rose-500/25 to-pink-500/25 border-2 border-rose-400 shadow-xl shadow-rose-500/30 pointer-events-none rounded-xs"
        :style="{
          left: `${currentRect.x}px`,
          top: `${currentRect.y}px`,
          width: `${currentRect.w}px`,
          height: `${currentRect.h}px`
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { X, Copy, Trash2 } from 'lucide-vue-next'
import { usePdfStore } from '../../stores/pdfStore'
import { useRedactionStore } from '../../stores/redactionStore'
import { useContentEditorStore } from '../../stores/contentEditorStore'
import type { RedactionBox } from '../../modules/redactor'

const props = defineProps<{
  pageIndex: number
  scale: number
}>()

const pdfStore = usePdfStore()
const redactionStore = useRedactionStore()
const contentStore = useContentEditorStore()

const pageContainerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const overlayRef = ref<HTMLDivElement | null>(null)

const isNearViewport = ref(false)
const isDrawing = ref(false)
const drawStart = ref<{ x: number; y: number } | null>(null)
const currentRect = ref<{ x: number; y: number; w: number; h: number } | null>(null)

let renderTask: any = null
let observer: IntersectionObserver | null = null

const pageDim = computed(() => {
  return pdfStore.pageDimensions[props.pageIndex] || { width: 612, height: 792, rotate: 0 }
})

const displayWidth = computed(() => Math.round(pageDim.value.width * props.scale))
const displayHeight = computed(() => Math.round(pageDim.value.height * props.scale))

const isRedactionMode = computed(() => pdfStore.activeWorkspaceTab === 'redact')
const isEditMode = computed(() => pdfStore.activeWorkspaceTab === 'edit')

const pageBoxes = computed(() => {
  return redactionStore.boxesByPage.get(props.pageIndex) || []
})

const pageTexts = computed(() => {
  return contentStore.activeTexts.filter(t => t.pageIndex === props.pageIndex)
})

const pageImages = computed(() => {
  return contentStore.activeImages.filter(img => img.pageIndex === props.pageIndex)
})

const pageStamps = computed(() => {
  return contentStore.activeStamps.filter(s => s.pageIndex === props.pageIndex)
})

function getCssFontFamily(family: string): string {
  if (family === 'Courier') return 'Courier, monospace'
  if (family.includes('Times')) return '"Times New Roman", Times, serif'
  return 'Helvetica, Arial, sans-serif'
}

// --- Interactive Selection & Dragging ---
function selectAndStartDrag(item: any, type: 'text' | 'image' | 'stamp', e: MouseEvent) {
  contentStore.selectItem(item.id, type)

  const startX = e.clientX
  const startY = e.clientY
  const initialItemX = item.x
  const initialItemY = item.y

  function onMouseMove(moveEvent: MouseEvent) {
    const deltaX = (moveEvent.clientX - startX) / props.scale
    const deltaY = (moveEvent.clientY - startY) / props.scale
    const maxX = pageDim.value.width - (item.width || 40)
    const maxY = pageDim.value.height - (item.height || 20)

    item.x = Math.max(0, Math.min(maxX, Math.round(initialItemX + deltaX)))
    item.y = Math.max(0, Math.min(maxY, Math.round(initialItemY + deltaY)))
  }

  function onMouseUp() {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

// --- Interactive 8-Handle Resizing ---
interface ResizeState {
  item: any
  type: 'text' | 'image' | 'stamp'
  handle: 'nw' | 'ne' | 'se' | 'sw' | 'n' | 'e' | 's' | 'w'
  startX: number
  startY: number
  initialX: number
  initialY: number
  initialWidth: number
  initialHeight: number
  initialFontSize?: number
  aspectRatio: number
}
let resizingState: ResizeState | null = null

function startResize(item: any, handle: 'nw' | 'ne' | 'se' | 'sw' | 'n' | 'e' | 's' | 'w', e: MouseEvent) {
  const type = item.label ? 'stamp' : item.previewUrl ? 'image' : 'text'
  contentStore.selectItem(item.id, type)
  const aspectRatio = item.aspectRatio || (item.width / Math.max(1, item.height))

  resizingState = {
    item,
    type,
    handle,
    startX: e.clientX,
    startY: e.clientY,
    initialX: item.x,
    initialY: item.y,
    initialWidth: item.width,
    initialHeight: item.height,
    initialFontSize: item.fontSize,
    aspectRatio
  }

  function onMouseMove(moveEvent: MouseEvent) {
    if (!resizingState) return
    const deltaX = (moveEvent.clientX - resizingState.startX) / props.scale
    const deltaY = (moveEvent.clientY - resizingState.startY) / props.scale
    const h = resizingState.handle
    const isImage = resizingState.type === 'image'
    const isText = resizingState.type === 'text'
    const isStamp = resizingState.type === 'stamp'
    const minW = isText ? 40 : isStamp ? 60 : 30
    const minH = isText ? 20 : isStamp ? 24 : 20

    let newW = resizingState.initialWidth
    let newH = resizingState.initialHeight
    let newX = resizingState.initialX
    let newY = resizingState.initialY

    // 1. East/West
    if (h === 'e' || h === 'se' || h === 'ne') {
      newW = Math.max(minW, resizingState.initialWidth + deltaX)
    } else if (h === 'w' || h === 'sw' || h === 'nw') {
      newW = Math.max(minW, resizingState.initialWidth - deltaX)
      newX = resizingState.initialX + (resizingState.initialWidth - newW)
    }

    // 2. South/North
    if (h === 's' || h === 'se' || h === 'sw') {
      newH = Math.max(minH, resizingState.initialHeight + deltaY)
    } else if (h === 'n' || h === 'ne' || h === 'nw') {
      newH = Math.max(minH, resizingState.initialHeight - deltaY)
      newY = resizingState.initialY + (resizingState.initialHeight - newH)
    }

    // 3. Aspect ratio lock for corner resize of images
    if (isImage && (h === 'se' || h === 'sw' || h === 'ne' || h === 'nw')) {
      newH = Math.round(newW / resizingState.aspectRatio)
      if (h === 'ne' || h === 'nw') {
        newY = resizingState.initialY + (resizingState.initialHeight - newH)
      }
    }

    // 4. Text proportional scaling on corner drag
    if (isText && (h === 'se' || h === 'sw' || h === 'ne' || h === 'nw') && resizingState.initialFontSize) {
      const scaleFactor = newW / resizingState.initialWidth
      const computedFont = Math.max(8, Math.min(96, Math.round(resizingState.initialFontSize * scaleFactor)))
      item.fontSize = computedFont
    }

    // Boundary clamp
    newX = Math.max(0, Math.min(pageDim.value.width - newW, newX))
    newY = Math.max(0, Math.min(pageDim.value.height - newH, newY))

    item.x = Math.round(newX)
    item.y = Math.round(newY)
    item.width = Math.round(newW)
    item.height = Math.round(newH)
  }

  function onMouseUp() {
    resizingState = null
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

function adjustTextFontSize(item: any, delta: number) {
  const newSize = Math.max(8, Math.min(96, item.fontSize + delta))
  item.fontSize = newSize
  contentStore.activeFontSize = newSize
}

function cycleImageOpacity(item: any) {
  const steps = [1.0, 0.75, 0.5, 0.25]
  const currentIdx = steps.findIndex(s => Math.abs(s - item.opacity) < 0.1)
  const nextIdx = (currentIdx + 1) % steps.length
  item.opacity = steps[nextIdx]
  contentStore.activeImageOpacity = steps[nextIdx]
}

function handleCanvasClick(e: MouseEvent) {
  if (contentStore.activeTool === 'text') {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const clickX = (e.clientX - rect.left) / props.scale
    const clickY = (e.clientY - rect.top) / props.scale
    contentStore.addText(props.pageIndex, clickX, clickY)
  } else if (contentStore.activeTool === 'stamp') {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const clickX = (e.clientX - rect.left) / props.scale
    const clickY = (e.clientY - rect.top) / props.scale
    contentStore.addStamp(props.pageIndex, contentStore.activeStamp, clickX, clickY)
  } else {
    contentStore.deselectItem()
  }
}

// Convert box 1.0x viewport coordinates to current screen CSS pixel coordinates in overlay
function getBoxStyle(box: RedactionBox) {
  const left = box.x * props.scale
  const top = box.y * props.scale
  const width = box.width * props.scale
  const height = box.height * props.scale

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`
  }
}

// Mouse events for drawing redactions
function handleMouseDown(e: MouseEvent) {
  if (!overlayRef.value || !isRedactionMode.value) return
  const rect = overlayRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  isDrawing.value = true
  drawStart.value = { x, y }
  currentRect.value = { x, y, w: 0, h: 0 }
}

function handleMouseMove(e: MouseEvent) {
  if (!isDrawing.value || !drawStart.value || !overlayRef.value) return
  const rect = overlayRef.value.getBoundingClientRect()
  const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
  const mouseY = Math.max(0, Math.min(rect.height, e.clientY - rect.top))

  const x = Math.min(drawStart.value.x, mouseX)
  const y = Math.min(drawStart.value.y, mouseY)
  const w = Math.abs(mouseX - drawStart.value.x)
  const h = Math.abs(mouseY - drawStart.value.y)

  currentRect.value = { x, y, w, h }
}

function handleMouseUp() {
  if (!isDrawing.value || !currentRect.value) {
    isDrawing.value = false
    drawStart.value = null
    currentRect.value = null
    return
  }

  if (currentRect.value.w > 4 && currentRect.value.h > 4) {
    const boxX = currentRect.value.x / props.scale
    const boxY = currentRect.value.y / props.scale
    const boxW = currentRect.value.w / props.scale
    const boxH = currentRect.value.h / props.scale

    redactionStore.addBox({
      id: `box_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      pageIndex: props.pageIndex,
      x: Math.round(boxX),
      y: Math.round(boxY),
      width: Math.round(boxW),
      height: Math.round(boxH),
      preset: redactionStore.activePreset
    })
  }

  isDrawing.value = false
  drawStart.value = null
  currentRect.value = null
}

// Render Page via pdfjs-dist
async function renderPage() {
  const proxy = toRaw(pdfStore.activePdfProxy)
  if (!isNearViewport.value || !proxy || !canvasRef.value) return
  if (props.pageIndex >= pdfStore.pageDimensions.length) return

  if (renderTask) {
    try {
      renderTask.cancel()
    } catch {
      // ignore
    }
    renderTask = null
  }

  try {
    const page = await proxy.getPage(props.pageIndex + 1)
    const viewport = page.getViewport({ scale: props.scale })

    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.floor(viewport.width * dpr)
    canvas.height = Math.floor(viewport.height * dpr)

    ctx.save()
    ctx.scale(dpr, dpr)

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, viewport.width, viewport.height)

    renderTask = page.render({
      canvasContext: ctx,
      viewport
    })

    await renderTask.promise
    ctx.restore()
  } catch (err: any) {
    if (err?.name !== 'RenderingCancelledException') {
      console.warn('Page render error:', err)
    }
  }
}

watch(canvasRef, (el) => {
  if (el) {
    nextTick(() => renderPage())
  }
})

onMounted(() => {
  if (pageContainerRef.value) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isNearViewport.value = true
          nextTick(() => renderPage())
        } else {
          isNearViewport.value = false
          if (renderTask) {
            try {
              renderTask.cancel()
            } catch {
              // ignore
            }
            renderTask = null
          }
        }
      })
    }, { rootMargin: '900px 0px 900px 0px' })

    observer.observe(pageContainerRef.value)
  }
})

onUnmounted(() => {
  if (observer && pageContainerRef.value) {
    observer.unobserve(pageContainerRef.value)
    observer.disconnect()
  }
  if (renderTask) {
    try {
      renderTask.cancel()
    } catch {
      // ignore
    }
  }
})

watch(() => [props.scale, pdfStore.documentVersion, pdfStore.activeDocumentId], async () => {
  if (isNearViewport.value) {
    await nextTick()
    renderPage()
  }
})
</script>
