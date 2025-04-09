<template>
  <div v-if="visible" class="modal is-active">
    <div class="modal-background" @click="close" />
    <div class="modal-content">
      <div ref="mapContainer" class="google-map" />
    </div>
    <button class="modal-close is-large" @click="close" />
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  event: Object,
  visible: Boolean
})
const emit = defineEmits(['close'])

const mapContainer = ref(null)
let map = null
let marker = null
let geocoder = null
const locationCache = new Map()

function close() {
  emit('close')
}

watch(() => props.visible, async (isVisible) => {
  if (!isVisible || !props.event?.where) return

  await nextTick()

  const address = props.event.where
  const title = props.event.what || 'Event'

  if (!geocoder) geocoder = new google.maps.Geocoder()

  const useCached = locationCache.get(address)

  if (useCached) {
    console.log('[MapModal] Using cached location:', address)
    renderMap(useCached, title)
    return
  }

  geocoder.geocode({ address }, (results, status) => {
    if (status === 'OK' && results[0]?.geometry?.location) {
      const loc = results[0].geometry.location
      locationCache.set(address, loc)
      renderMap(loc, title)
    } else {
      console.warn('[MapModal] Failed to geocode:', status)
    }
  })
})

function renderMap(location, title) {
  setTimeout(() => {
    if (!map) {
      map = new google.maps.Map(mapContainer.value, {
        center: location,
        zoom: 15
      })
    } else {
      map.setCenter(location)
      google.maps.event.trigger(map, 'resize')
    }

    if (marker) marker.setMap(null)

    marker = new google.maps.Marker({
      map,
      position: location,
      title
    })
  }, 100)
}
</script>

<style scoped>
.modal-content {
  max-width: 90%;
  max-height: 80vh;
  margin: auto;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  padding: 1rem;
}

.google-map {
  width: 100%;
  height: 400px;
  border-radius: 8px;
}
</style>
