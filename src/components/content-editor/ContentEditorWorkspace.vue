<template>
  <aside class="w-80 bg-[#0b101d] border-l border-slate-800/80 flex flex-col h-full select-none text-slate-200 z-20 shadow-2xl">
    <!-- Header -->
    <div class="p-4 border-b border-slate-800 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Edit3 class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-white tracking-tight">Content Editor</h2>
          <span class="text-[10px] text-cyan-400 font-medium">Text, Images & Signatures</span>
        </div>
      </div>

      <span
        v-if="contentStore.totalPendingCount > 0"
        class="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-extrabold text-[10px] shadow-xs"
      >
        {{ contentStore.totalPendingCount }} Pending
      </span>
    </div>

    <!-- Tool Selector Tabs (Always available to switch creation mode) -->
    <div class="p-2 border-b border-slate-800 grid grid-cols-4 gap-1 bg-slate-950/60">
      <button
        @click="switchTool('text')"
        :class="[
          'flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-semibold transition',
          contentStore.activeTool === 'text' && !contentStore.selectedItem
            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
        ]"
        title="Add & edit text annotations"
      >
        <Type class="w-4 h-4 mb-1" />
        <span>Text</span>
      </button>

      <button
        @click="switchTool('image')"
        :class="[
          'flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-semibold transition',
          contentStore.activeTool === 'image' && !contentStore.selectedItem
            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-xs'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
        ]"
        title="Insert images, watermarks & logos"
      >
        <Image class="w-4 h-4 mb-1" />
        <span>Image</span>
      </button>

      <button
        @click="switchTool('draw')"
        :class="[
          'flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-semibold transition',
          contentStore.activeTool === 'draw' && !contentStore.selectedItem
            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-xs'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
        ]"
        title="Draw signature or pen strokes"
      >
        <PenTool class="w-4 h-4 mb-1" />
        <span>Signature</span>
      </button>

      <button
        @click="switchTool('stamp')"
        :class="[
          'flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-semibold transition',
          contentStore.activeTool === 'stamp' && !contentStore.selectedItem
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
        ]"
        title="Apply pre-made document stamps"
      >
        <Stamp class="w-4 h-4 mb-1" />
        <span>Stamps</span>
      </button>
    </div>

    <!-- Main Sidebar Content Body -->
    <div class="flex-1 overflow-y-auto p-4 space-y-5">
      <!-- 0. DEDICATED ELEMENT INSPECTOR (When an item is selected on canvas) -->
      <div v-if="contentStore.selectedItem" class="space-y-4">
        <!-- Inspector Card Header -->
        <div class="p-3 bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-indigo-950/40 border border-cyan-500/30 rounded-2xl flex items-center justify-between shadow-lg">
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Sliders class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-xs font-bold text-white uppercase tracking-wider">
                {{ selectedItemTypeTitle }}
              </h3>
              <span class="text-[10px] text-cyan-300">Page {{ (contentStore.selectedItem?.pageIndex || 0) + 1 }}</span>
            </div>
          </div>
          <button
            @click="contentStore.deselectItem"
            class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            title="Deselect (Esc)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Position & Size Transform -->
        <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 space-y-2.5">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Transform (pt)</span>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="text-[10px] text-slate-400 mb-0.5 block">X Position</label>
              <div class="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-2 py-1">
                <span class="text-[10px] text-slate-500 font-mono mr-1">X</span>
                <input
                  type="number"
                  min="0"
                  v-model.number="contentStore.selectedItem.x"
                  class="w-full bg-transparent text-white outline-hidden font-mono text-xs"
                />
              </div>
            </div>
            <div>
              <label class="text-[10px] text-slate-400 mb-0.5 block">Y Position</label>
              <div class="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-2 py-1">
                <span class="text-[10px] text-slate-500 font-mono mr-1">Y</span>
                <input
                  type="number"
                  min="0"
                  v-model.number="contentStore.selectedItem.y"
                  class="w-full bg-transparent text-white outline-hidden font-mono text-xs"
                />
              </div>
            </div>
            <div>
              <label class="text-[10px] text-slate-400 mb-0.5 block">Width</label>
              <div class="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-2 py-1">
                <span class="text-[10px] text-slate-500 font-mono mr-1">W</span>
                <input
                  type="number"
                  min="20"
                  v-model.number="contentStore.selectedItem.width"
                  @input="handleWidthChange"
                  class="w-full bg-transparent text-white outline-hidden font-mono text-xs"
                />
              </div>
            </div>
            <div>
              <label class="text-[10px] text-slate-400 mb-0.5 block">Height</label>
              <div class="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-2 py-1">
                <span class="text-[10px] text-slate-500 font-mono mr-1">H</span>
                <input
                  type="number"
                  min="16"
                  v-model.number="contentStore.selectedItem.height"
                  @input="handleHeightChange"
                  class="w-full bg-transparent text-white outline-hidden font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <!-- Nudge row -->
          <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Nudge (1pt):</span>
            <div class="flex items-center gap-1">
              <button
                @click="contentStore.nudgeSelectedItem(-1, 0)"
                class="p-1 rounded bg-slate-800 hover:bg-slate-700 hover:text-white transition"
                title="Nudge Left"
              >
                <ArrowLeft class="w-3 h-3" />
              </button>
              <button
                @click="contentStore.nudgeSelectedItem(0, -1)"
                class="p-1 rounded bg-slate-800 hover:bg-slate-700 hover:text-white transition"
                title="Nudge Up"
              >
                <ArrowUp class="w-3 h-3" />
              </button>
              <button
                @click="contentStore.nudgeSelectedItem(0, 1)"
                class="p-1 rounded bg-slate-800 hover:bg-slate-700 hover:text-white transition"
                title="Nudge Down"
              >
                <ArrowDown class="w-3 h-3" />
              </button>
              <button
                @click="contentStore.nudgeSelectedItem(1, 0)"
                class="p-1 rounded bg-slate-800 hover:bg-slate-700 hover:text-white transition"
                title="Nudge Right"
              >
                <ArrowRight class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <!-- 1. Text Properties when selectedItemType === 'text' -->
        <div v-if="selectedTextItem" class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 space-y-3">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Text Settings</span>
          <div>
            <label class="text-[10px] text-slate-400 mb-1 block">Content</label>
            <textarea
              v-model="selectedTextItem.text"
              rows="2"
              class="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-hidden focus:border-cyan-500 transition resize-none font-sans"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[10px] text-slate-400 mb-1 block">Font</label>
              <select
                v-model="selectedTextItem.fontFamily"
                class="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-hidden"
              >
                <option value="Helvetica">Helvetica</option>
                <option value="Helvetica-Bold">Helvetica Bold</option>
                <option value="Times-Roman">Times New Roman</option>
                <option value="Courier">Courier</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] text-slate-400 mb-1 block">
                Size ({{ selectedTextItem.fontSize }}pt)
              </label>
              <input
                type="range"
                min="8"
                max="72"
                v-model.number="selectedTextItem.fontSize"
                class="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label class="text-[10px] text-slate-400 mb-1 block">Color</label>
            <div class="flex items-center gap-2">
              <button
                v-for="color in textColors"
                :key="color"
                @click="selectedTextItem.color = color"
                class="w-5 h-5 rounded-full border border-slate-600 transition"
                :style="{ backgroundColor: color }"
                :class="{ 'ring-2 ring-cyan-400 scale-110': selectedTextItem.color === color }"
              ></button>
              <input
                type="color"
                v-model="selectedTextItem.color"
                class="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              />
            </div>
          </div>
        </div>

        <!-- 2. Image / Signature Properties when selectedItemType === 'image' -->
        <div v-else-if="selectedImageItem" class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 space-y-3">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Image Settings</span>
          <div class="h-24 bg-slate-950 rounded-xl p-2 flex items-center justify-center border border-slate-800">
            <img
              :src="selectedImageItem.previewUrl"
              class="max-h-full max-w-full object-contain"
              :style="{ opacity: selectedImageItem.opacity }"
            />
          </div>

          <div>
            <div class="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span class="text-[10px] text-slate-400">Opacity</span>
              <span class="font-mono text-[10px]">{{ Math.round(selectedImageItem.opacity * 100) }}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              v-model.number="selectedImageItem.opacity"
              class="w-full accent-indigo-400 cursor-pointer"
            />
          </div>

          <div class="flex items-center justify-between text-xs pt-1">
            <label class="flex items-center gap-2 cursor-pointer text-slate-300 text-[11px]">
              <input
                type="checkbox"
                v-model="lockAspectRatio"
                class="rounded accent-indigo-500"
              />
              <span>Lock Aspect Ratio</span>
            </label>
            <button
              @click="resetNaturalDimensions"
              class="text-[10px] text-indigo-400 hover:underline"
            >
              Reset Ratio
            </button>
          </div>
        </div>

        <!-- 3. Stamp Properties when selectedItemType === 'stamp' -->
        <div v-else-if="selectedStampItem" class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 space-y-3">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Stamp Settings</span>
          <div>
            <label class="text-[10px] text-slate-400 mb-1 block">Badge Text</label>
            <input
              type="text"
              v-model="selectedStampItem.label"
              class="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold uppercase text-xs focus:outline-hidden"
            />
          </div>

          <div>
            <label class="text-[10px] text-slate-400 mb-1 block">Stamp Preset</label>
            <div class="grid grid-cols-3 gap-1 text-[10px]">
              <button
                v-for="preset in presetStamps"
                :key="preset.label"
                @click="selectedStampItem.label = preset.label; selectedStampItem.color = preset.color"
                class="p-1 rounded-lg border font-bold text-center uppercase truncate transition hover:scale-102"
                :style="{
                  borderColor: preset.color,
                  color: preset.color,
                  backgroundColor: preset.color + '15'
                }"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>

          <div>
            <label class="text-[10px] text-slate-400 mb-1 block">Border & Text Color</label>
            <div class="flex items-center gap-2">
              <button
                v-for="preset in presetStamps"
                :key="preset.color"
                @click="selectedStampItem.color = preset.color"
                class="w-5 h-5 rounded-full border border-slate-600 transition"
                :style="{ backgroundColor: preset.color }"
                :class="{ 'ring-2 ring-emerald-400 scale-110': selectedStampItem.color === preset.color }"
              ></button>
              <input
                type="color"
                v-model="selectedStampItem.color"
                class="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons Row -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button
            @click="contentStore.duplicateSelectedItem"
            class="py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition"
            title="Duplicate element (Ctrl+D)"
          >
            <Copy class="w-3.5 h-3.5 text-cyan-400" />
            <span>Duplicate</span>
          </button>
          <button
            @click="contentStore.deleteSelectedItem"
            class="py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            title="Delete element (Del)"
          >
            <Trash2 class="w-3.5 h-3.5 text-rose-400" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <!-- CREATION TOOL PANELS (When no item is selected or user switches creation tool) -->
      <template v-else>
        <!-- 1. TEXT TOOL SETTINGS -->
        <div v-if="contentStore.activeTool === 'text' || !['image', 'draw', 'stamp'].includes(contentStore.activeTool)" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Text to Insert</label>
            <textarea
              v-model="newTextContent"
              rows="2"
              placeholder="Type text here..."
              class="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-hidden focus:border-cyan-500 transition resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Font Family</label>
              <select
                v-model="contentStore.activeFont"
                class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500"
              >
                <option value="Helvetica">Helvetica (Clean)</option>
                <option value="Helvetica-Bold">Helvetica Bold</option>
                <option value="Times-Roman">Times New Roman</option>
                <option value="Courier">Courier (Mono)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">
                Size ({{ contentStore.activeFontSize }}pt)
              </label>
              <input
                type="range"
                min="8"
                max="72"
                v-model.number="contentStore.activeFontSize"
                class="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Text Color</label>
            <div class="flex items-center gap-2">
              <button
                v-for="color in textColors"
                :key="color"
                @click="contentStore.activeTextColor = color"
                class="w-6 h-6 rounded-full border border-slate-600 transition"
                :style="{ backgroundColor: color }"
                :class="{ 'ring-2 ring-cyan-400 scale-110': contentStore.activeTextColor === color }"
              ></button>
              <input
                type="color"
                v-model="contentStore.activeTextColor"
                class="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                title="Custom color"
              />
            </div>
          </div>

          <button
            @click="insertTextOnPage"
            class="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <PlusCircle class="w-4 h-4" />
            <span>Place Text on Current Page</span>
          </button>

          <p class="text-[11px] text-slate-400 text-center italic">
            Tip: You can also click anywhere on the page to place text!
          </p>
        </div>

        <!-- 2. IMAGE TOOL SETTINGS -->
        <div v-else-if="contentStore.activeTool === 'image'" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Upload Image / Logo</label>
            <label class="cursor-pointer border-2 border-dashed border-slate-700 hover:border-indigo-400 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-slate-900/60 transition group">
              <UploadCloud class="w-6 h-6 text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
              <span class="text-xs font-medium text-slate-300">Choose PNG, JPG, or WebP</span>
              <span class="text-[10px] text-slate-500 mt-0.5">Transparent PNG supported</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                class="hidden"
                @change="handleImageUpload"
              />
            </label>
          </div>

          <!-- Image Preview if loaded -->
          <div v-if="uploadedPreview" class="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <div class="h-28 flex items-center justify-center bg-slate-950/80 rounded-lg p-2 overflow-hidden border border-slate-800">
              <img :src="uploadedPreview" alt="Preview" class="max-h-full max-w-full object-contain" />
            </div>

            <div>
              <div class="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span>Opacity</span>
                <span class="font-mono">{{ Math.round(contentStore.activeImageOpacity * 100) }}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                v-model.number="contentStore.activeImageOpacity"
                class="w-full accent-indigo-400 cursor-pointer"
              />
            </div>

            <button
              @click="insertUploadedImage"
              class="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <PlusCircle class="w-4 h-4" />
              <span>Place Image on Page</span>
            </button>
          </div>
        </div>

        <!-- 3. SIGNATURE / PEN TOOL SETTINGS -->
        <div v-else-if="contentStore.activeTool === 'draw'" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Draw Signature Below</label>
            <div class="border border-slate-700 rounded-2xl bg-white p-1 relative shadow-inner overflow-hidden">
              <canvas
                ref="signaturePadCanvas"
                width="280"
                height="110"
                class="w-full h-28 cursor-crosshair rounded-xl block bg-white touch-none"
                @mousedown="startSignature"
                @mousemove="drawSignature"
                @mouseup="endSignature"
                @mouseleave="endSignature"
                @touchstart.prevent="handleTouchStart"
                @touchmove.prevent="handleTouchMove"
                @touchend.prevent="endSignature"
              ></canvas>
            </div>
            <div class="flex items-center justify-between mt-1 text-[11px] text-slate-400">
              <span>Use mouse or stylus to sign</span>
              <button @click="clearSignaturePad" class="text-rose-400 hover:underline">
                Clear
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Pen Color</label>
              <div class="flex items-center gap-1.5">
                <button
                  v-for="color in penColors"
                  :key="color"
                  @click="contentStore.activeDrawColor = color"
                  class="w-5 h-5 rounded-full border border-slate-600 transition"
                  :style="{ backgroundColor: color }"
                  :class="{ 'ring-2 ring-blue-400 scale-110': contentStore.activeDrawColor === color }"
                ></button>
              </div>
            </div>

            <div class="w-28">
              <label class="block text-xs font-semibold text-slate-300 mb-1">
                Stroke ({{ contentStore.activeDrawThickness }}px)
              </label>
              <input
                type="range"
                min="1"
                max="6"
                v-model.number="contentStore.activeDrawThickness"
                class="w-full accent-blue-400 cursor-pointer"
              />
            </div>
          </div>

          <button
            @click="insertSignatureOnPage"
            class="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Check class="w-4 h-4" />
            <span>Insert Signature onto Page</span>
          </button>
        </div>

        <!-- 4. STAMPS TOOL SETTINGS -->
        <div v-else-if="contentStore.activeTool === 'stamp'" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-2">Preset Document Stamps</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="stamp in presetStamps"
                :key="stamp.label"
                @click="applyStampDirectly(stamp.label, stamp.color)"
                class="p-2.5 rounded-xl border font-bold text-xs uppercase tracking-wider text-center transition hover:scale-102 active:scale-98"
                :style="{
                  borderColor: stamp.color,
                  color: stamp.color,
                  backgroundColor: stamp.color + '15'
                }"
              >
                {{ stamp.label }}
              </button>
            </div>
          </div>
          <p class="text-[11px] text-slate-400 italic">
            Click any stamp above to stamp page {{ pdfStore.currentPageIndex + 1 }} instantly.
          </p>
        </div>
      </template>

      <!-- PENDING ITEMS ON CURRENT PAGE LIST -->
      <div v-if="currentPageAnnotationsCount > 0" class="pt-4 border-t border-slate-800 space-y-2">
        <div class="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
          <span>Page {{ pdfStore.currentPageIndex + 1 }} Items ({{ currentPageAnnotationsCount }})</span>
          <button @click="contentStore.clearAllPending" class="text-rose-400 hover:underline text-[10px]">
            Clear All
          </button>
        </div>

        <!-- Texts list -->
        <div
          v-for="t in pageTexts"
          :key="t.id"
          @click="contentStore.selectItem(t.id, 'text')"
          class="p-2 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 flex items-center justify-between text-xs cursor-pointer transition"
          :class="{ 'ring-1 ring-cyan-400 bg-cyan-950/20': contentStore.selectedItemId === t.id }"
        >
          <div class="flex items-center gap-1.5 overflow-hidden">
            <Type class="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span class="truncate text-slate-200 font-medium">{{ t.text }}</span>
          </div>
          <button @click.stop="contentStore.deleteText(t.id)" class="text-slate-500 hover:text-rose-400 p-1">
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Images list -->
        <div
          v-for="img in pageImages"
          :key="img.id"
          @click="contentStore.selectItem(img.id, 'image')"
          class="p-2 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 flex items-center justify-between text-xs cursor-pointer transition"
          :class="{ 'ring-1 ring-indigo-400 bg-indigo-950/20': contentStore.selectedItemId === img.id }"
        >
          <div class="flex items-center gap-1.5">
            <Image class="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span class="text-slate-200 font-medium">
              {{ img.isSignature ? 'Signature' : 'Image' }} ({{ img.width }}x{{ img.height }})
            </span>
          </div>
          <button @click.stop="contentStore.deleteImage(img.id)" class="text-slate-500 hover:text-rose-400 p-1">
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Stamps list -->
        <div
          v-for="s in pageStamps"
          :key="s.id"
          @click="contentStore.selectItem(s.id, 'stamp')"
          class="p-2 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 flex items-center justify-between text-xs cursor-pointer transition"
          :class="{ 'ring-1 ring-emerald-400 bg-emerald-950/20': contentStore.selectedItemId === s.id }"
        >
          <div class="flex items-center gap-1.5">
            <Stamp class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span class="text-slate-200 font-bold uppercase">{{ s.label }}</span>
          </div>
          <button @click.stop="contentStore.deleteStamp(s.id)" class="text-slate-500 hover:text-rose-400 p-1">
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Apply & Burn In Action Footer -->
    <div class="p-4 border-t border-slate-800 bg-slate-950/80 space-y-2">
      <button
        @click="handleApplyAll"
        :disabled="contentStore.totalPendingCount === 0 || contentStore.isApplying"
        class="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-xs shadow-lg shadow-cyan-500/25 transition active:scale-98 flex items-center justify-center gap-2"
      >
        <Save v-if="!contentStore.isApplying" class="w-4 h-4" />
        <Loader2 v-else class="w-4 h-4 animate-spin" />
        <span>Save & Embed into PDF ({{ contentStore.totalPendingCount }})</span>
      </button>

      <span class="text-[10px] text-slate-500 block text-center">
        Direct vector embedding. 100% reversible via Ctrl+Z.
      </span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Edit3,
  Type,
  Image,
  PenTool,
  Stamp,
  PlusCircle,
  UploadCloud,
  Check,
  Trash2,
  Save,
  Loader2,
  Sliders,
  Copy,
  X,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowRight
} from 'lucide-vue-next'
import { usePdfStore } from '../../stores/pdfStore'
import { useContentEditorStore, type ContentTool } from '../../stores/contentEditorStore'
import type { TextAnnotation, ImageAnnotation, StampAnnotation } from '../../modules/content-editor/types'

const pdfStore = usePdfStore()
const contentStore = useContentEditorStore()

const newTextContent = ref('Click to edit text')
const lockAspectRatio = ref(true)

const textColors = ['#000000', '#1e293b', '#dc2626', '#2563eb', '#16a34a', '#ffffff']
const penColors = ['#000000', '#2563eb', '#dc2626', '#16a34a']

const presetStamps = [
  { label: 'APPROVED', color: '#10b981' },
  { label: 'CONFIDENTIAL', color: '#ef4444' },
  { label: 'DRAFT', color: '#f59e0b' },
  { label: 'COMPLETED', color: '#3b82f6' },
  { label: 'VOID', color: '#b91c1c' },
  { label: 'FINAL', color: '#8b5cf6' }
]

function switchTool(tool: ContentTool) {
  contentStore.deselectItem()
  contentStore.activeTool = tool
}

const selectedTextItem = computed<TextAnnotation | null>(() => {
  return contentStore.selectedItemType === 'text' && contentStore.selectedItem
    ? (contentStore.selectedItem as TextAnnotation)
    : null
})

const selectedImageItem = computed<ImageAnnotation | null>(() => {
  return contentStore.selectedItemType === 'image' && contentStore.selectedItem
    ? (contentStore.selectedItem as ImageAnnotation)
    : null
})

const selectedStampItem = computed<StampAnnotation | null>(() => {
  return contentStore.selectedItemType === 'stamp' && contentStore.selectedItem
    ? (contentStore.selectedItem as StampAnnotation)
    : null
})

const selectedItemTypeTitle = computed(() => {
  if (!contentStore.selectedItem) return 'Element Inspector'
  if (selectedTextItem.value) return 'Text Annotation'
  if (selectedStampItem.value) return 'Document Stamp'
  if (selectedImageItem.value) {
    return selectedImageItem.value.isSignature ? 'Digital Signature' : 'Image / Graphic'
  }
  return 'Element Inspector'
})

function handleWidthChange() {
  if (!selectedImageItem.value) return
  if (lockAspectRatio.value) {
    const ratio = selectedImageItem.value.aspectRatio || 1
    selectedImageItem.value.height = Math.round(selectedImageItem.value.width / ratio)
  }
}

function handleHeightChange() {
  if (!selectedImageItem.value) return
  if (lockAspectRatio.value) {
    const ratio = selectedImageItem.value.aspectRatio || 1
    selectedImageItem.value.width = Math.round(selectedImageItem.value.height * ratio)
  }
}

function resetNaturalDimensions() {
  if (!selectedImageItem.value) return
  const ratio = selectedImageItem.value.aspectRatio || 1
  selectedImageItem.value.width = 180
  selectedImageItem.value.height = Math.round(180 / ratio)
}

// Current Page filter
const currentPage = computed(() => pdfStore.currentPageIndex)

const pageTexts = computed(() => {
  return contentStore.activeTexts.filter(t => t.pageIndex === currentPage.value)
})

const pageImages = computed(() => {
  return contentStore.activeImages.filter(img => img.pageIndex === currentPage.value)
})

const pageStamps = computed(() => {
  return contentStore.activeStamps.filter(s => s.pageIndex === currentPage.value)
})

const currentPageAnnotationsCount = computed(() => {
  return pageTexts.value.length + pageImages.value.length + pageStamps.value.length
})

// Insert text on page center
function insertTextOnPage() {
  contentStore.addText(currentPage.value, 80, 100, newTextContent.value || 'Click to edit text')
}

// Uploaded image state
const uploadedFile = ref<File | null>(null)
const uploadedPreview = ref<string | null>(null)

function handleImageUpload(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  uploadedFile.value = target.files[0]
  uploadedPreview.value = URL.createObjectURL(uploadedFile.value)
}

async function insertUploadedImage() {
  if (!uploadedFile.value) return
  await contentStore.addImageFromFile(currentPage.value, uploadedFile.value, 80, 120, false)
}

// Signature Pad State
const signaturePadCanvas = ref<HTMLCanvasElement | null>(null)
let isSigning = false
let sigPoints: Array<{ x: number; y: number }> = []

function startSignature(e: MouseEvent) {
  isSigning = true
  const rect = signaturePadCanvas.value?.getBoundingClientRect()
  if (!rect) return
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  sigPoints = [{ x, y }]
  drawDot(x, y)
}

function drawSignature(e: MouseEvent) {
  if (!isSigning || !signaturePadCanvas.value) return
  const rect = signaturePadCanvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  sigPoints.push({ x, y })
  drawLineSegment()
}

function endSignature() {
  isSigning = false
}

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length === 0) return
  isSigning = true
  const rect = signaturePadCanvas.value?.getBoundingClientRect()
  if (!rect) return
  const x = e.touches[0].clientX - rect.left
  const y = e.touches[0].clientY - rect.top
  sigPoints = [{ x, y }]
  drawDot(x, y)
}

function handleTouchMove(e: TouchEvent) {
  if (!isSigning || e.touches.length === 0 || !signaturePadCanvas.value) return
  const rect = signaturePadCanvas.value.getBoundingClientRect()
  const x = e.touches[0].clientX - rect.left
  const y = e.touches[0].clientY - rect.top
  sigPoints.push({ x, y })
  drawLineSegment()
}

function drawDot(x: number, y: number) {
  const ctx = signaturePadCanvas.value?.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = contentStore.activeDrawColor
  ctx.beginPath()
  ctx.arc(x, y, contentStore.activeDrawThickness / 2, 0, Math.PI * 2)
  ctx.fill()
}

function drawLineSegment() {
  const ctx = signaturePadCanvas.value?.getContext('2d')
  if (!ctx || sigPoints.length < 2) return
  const p1 = sigPoints[sigPoints.length - 2]
  const p2 = sigPoints[sigPoints.length - 1]
  ctx.strokeStyle = contentStore.activeDrawColor
  ctx.lineWidth = contentStore.activeDrawThickness
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}

function clearSignaturePad() {
  const canvas = signaturePadCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  sigPoints = []
}

async function insertSignatureOnPage() {
  const canvas = signaturePadCanvas.value
  if (!canvas || sigPoints.length < 2) return

  const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'))
  if (!blob) return

  const file = new File([blob], 'signature.png', { type: 'image/png' })
  await contentStore.addImageFromFile(currentPage.value, file, 100, 200, true)
  clearSignaturePad()
}

function applyStampDirectly(label: string, color: string) {
  contentStore.addStamp(currentPage.value, label, 80, 80, color)
}

async function handleApplyAll() {
  await contentStore.applyAllPendingAnnotations()
}

// Global Keyboard Shortcuts
function handleGlobalKeyDown(e: KeyboardEvent) {
  if (pdfStore.activeWorkspaceTab !== 'edit') return
  if (!contentStore.selectedItem) return

  const activeEl = document.activeElement
  const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')

  // Escape to deselect
  if (e.key === 'Escape') {
    contentStore.deselectItem()
    return
  }

  // Delete or Backspace
  if ((e.key === 'Delete' || e.key === 'Backspace') && !isTyping) {
    e.preventDefault()
    contentStore.deleteSelectedItem()
    return
  }

  // Ctrl+D or Cmd+D to duplicate
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && !isTyping) {
    e.preventDefault()
    contentStore.duplicateSelectedItem()
    return
  }

  // Arrow keys to nudge
  if (!isTyping && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault()
    const step = e.shiftKey ? 10 : 1
    if (e.key === 'ArrowUp') contentStore.nudgeSelectedItem(0, -step)
    if (e.key === 'ArrowDown') contentStore.nudgeSelectedItem(0, step)
    if (e.key === 'ArrowLeft') contentStore.nudgeSelectedItem(-step, 0)
    if (e.key === 'ArrowRight') contentStore.nudgeSelectedItem(step, 0)
  }
}

onMounted(() => {
  if (!contentStore.activeTool || contentStore.activeTool === 'select') {
    contentStore.activeTool = 'text'
  }
  window.addEventListener('keydown', handleGlobalKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown)
})
</script>
