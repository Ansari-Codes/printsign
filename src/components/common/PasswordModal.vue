<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
    <div class="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 text-slate-200 shadow-2xl">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
          <KeyRound class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-white">Password Protected Document</h3>
          <p class="text-xs text-slate-400">Enter the decryption password to view and edit this PDF.</p>
        </div>
      </div>

      <div v-if="isIncorrect" class="mb-3 p-2 bg-rose-500/10 border border-rose-500/30 rounded text-rose-400 text-xs">
        Incorrect password. Please try again.
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Document Password</label>
          <input
            ref="inputRef"
            v-model="password"
            type="password"
            required
            autocomplete="off"
            placeholder="Enter password..."
            class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition"
          />
        </div>

        <p class="text-xs text-slate-500">
          Note: Your password is used purely in local memory to decrypt the file; it is never saved, cached, or transmitted.
        </p>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            @click="$emit('cancel')"
            class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition text-sm shadow-md"
          >
            Unlock PDF
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { KeyRound } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  isIncorrect?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', password: string): void
  (e: 'cancel'): void
}>()

const password = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

watch(() => props.isOpen, (val) => {
  if (val) {
    password.value = ''
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})

function handleSubmit() {
  if (password.value) {
    emit('submit', password.value)
  }
}
</script>
