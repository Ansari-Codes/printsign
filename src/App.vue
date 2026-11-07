<template>
  <div class="min-h-screen w-full bg-[#070b14] text-slate-100 font-sans">
    <router-view />

    <!-- Global Password Decryption Modal -->
    <PasswordModal
      :is-open="isPasswordModalOpen"
      :is-incorrect="passwordIncorrect"
      @submit="handlePasswordSubmit"
      @cancel="handlePasswordCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePdfStore } from './stores/pdfStore'
import PasswordModal from './components/common/PasswordModal.vue'
import { useRouteSeo } from './config/seoRoutes'

const route = useRoute()
useRouteSeo(() => route.path)

const pdfStore = usePdfStore()

const isPasswordModalOpen = ref(false)
const passwordIncorrect = ref(false)
let passwordResolve: ((pw: string | null) => void) | null = null

pdfStore.setPasswordPromptHandler((reason) => {
  return new Promise((resolve) => {
    passwordIncorrect.value = reason === 'incorrect_password'
    isPasswordModalOpen.value = true
    passwordResolve = resolve
  })
})

function handlePasswordSubmit(pw: string) {
  if (passwordResolve) {
    passwordResolve(pw)
    passwordResolve = null
  }
  isPasswordModalOpen.value = false
  passwordIncorrect.value = false
}

function handlePasswordCancel() {
  if (passwordResolve) {
    passwordResolve(null)
    passwordResolve = null
  }
  isPasswordModalOpen.value = false
  passwordIncorrect.value = false
}
</script>
