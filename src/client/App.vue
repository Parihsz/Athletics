<template>
  <Navbar />

  <GoogleMapsModal
    v-if="selectedEvent"
    :event="selectedEvent"
    :visible="mapModalVisible"
    @close="handleCloseMapModal"
  />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>


<script setup>
import { ref } from 'vue'
import Navbar from '@/components/navbar.vue'
import GoogleMapsModal from '@/components/mapModal.vue'

const mapModalVisible = ref(false)
const selectedEvent = ref(null)

function openMapModal(event) {
  console.log('[App] Opening map modal for event:', event)
  selectedEvent.value = event
  mapModalVisible.value = true
}

function handleCloseMapModal() {
  console.log('[App] Closing map modal')
  mapModalVisible.value = false
  selectedEvent.value = null
}

defineExpose({ openMapModal })
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
