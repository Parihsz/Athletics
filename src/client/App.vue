<template>
  <Navbar />
  <google-maps-modal
    :event="selectedEvent"
    :visible="mapModalVisible"
    @close="mapModalVisible = false"
  />
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import Navbar from '@/components/navbar.vue'
import GoogleMapsModal from '@/components/googleMapsModal.vue'

import { ref } from 'vue'

const mapModalVisible = ref(false)
const selectedEvent = ref(null)

function openMapModal(event) {
  selectedEvent.value = event
  mapModalVisible.value = true
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
