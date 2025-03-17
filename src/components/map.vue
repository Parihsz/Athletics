<template>
  <div class="map-container" id="map"></div>
</template>

<script setup>
import { ref, watch, onMounted, defineExpose } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  }
})

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY

const map = ref(null)
const markers_group = ref(null)

function ensure_position(ev) {
  return ev.position
    ? ev.position
    : { lat: 40.7128 + Math.random() * 0.01, lng: -74.0060 + Math.random() * 0.01 }
}

function update_markers() {
  if (!map.value) return
  if (markers_group.value) {
    markers_group.value.clearLayers()
  } else {
    markers_group.value = L.layerGroup().addTo(map.value)
  }
  props.events.forEach(ev => {
    const pos = ensure_position(ev)
    const marker = L.marker([pos.lat, pos.lng])
      .bindPopup(`<strong>${ev.who}</strong><br>${ev.when}<br>${ev.notes}`)
    markers_group.value.addLayer(marker)
  })

  if (
    markers_group.value &&
    typeof markers_group.value.getBounds === 'function' &&
    markers_group.value.getLayers().length > 0
  ) {
    const groupBounds = markers_group.value.getBounds()
    map.value.fitBounds(groupBounds, { padding: [20, 20] })
  }
}

function focus_on_event(ev) {
  const pos = ensure_position(ev)
  if (map.value) {
    map.value.setView([pos.lat, pos.lng], 15)
    L.popup()
      .setLatLng([pos.lat, pos.lng])
      .setContent(`<strong>${ev.who}</strong><br>${ev.when}<br>${ev.notes}`)
      .openOn(map.value)
  }
}
defineExpose({ focus_on_event })

watch(() => props.events, () => {
  update_markers()
}, { immediate: true })

onMounted(() => {
  map.value = L.map('map', {
    center: [40.7128, -74.0060], 
    zoom: 13
  })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value)
  update_markers()
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
