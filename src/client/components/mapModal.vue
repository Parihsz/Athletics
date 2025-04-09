<template>
  <div v-if="visible" class="modal is-active">
    <div class="modal-background" @click="close" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ event?.what || 'Location' }}</p>
        <button class="delete" @click="close" aria-label="close" />
      </header>
      <section class="modal-card-body">
        <div v-if="loading" class="has-text-centered py-6">
          <p class="is-size-6 has-text-grey">Loading map...</p>
        </div>
        <div v-show="!loading" ref="mapContainer" class="google-map" />
      </section>
    </div>
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

const loading = ref(true)

function close() {
  emit('close')
}

watch(() => props.visible, async (newVal) => {
  if (!newVal || !props.event?.where) return

  loading.value = true
  await nextTick()

  const address = props.event.where
  const title = props.event.what || 'Event'

  if (!geocoder) geocoder = new google.maps.Geocoder()
  const cached = locationCache.get(address)

  if (cached) {
    renderMap(cached, title)
    return
  }

  geocoder.geocode({ address }, (results, status) => {
    if (status === 'OK' && results[0]?.geometry?.location) {
      const location = results[0].geometry.location
      locationCache.set(address, location)
      renderMap(location, title)
    } else {
      console.warn('[MapModal] Failed geocode:', status)
      loading.value = false
    }
  })
})

function renderMap(location, title) {
  setTimeout(() => {
    if (map) {
      map = null // Clear stale map
      mapContainer.value.innerHTML = '' // Clear DOM
    }

    map = new google.maps.Map(mapContainer.value, {
      center: location,
      zoom: 15
    })

    marker = new google.maps.Marker({
      map,
      position: location,
      title
    })

    google.maps.event.trigger(map, 'resize') // fix for incorrect center sometimes

    loading.value = false
  }, 100)
}
</script>

<style scoped>
.modal-card {
  width: 90vw;
  max-width: 700px;
  border-radius: 8px;
  overflow: hidden;
}
.google-map {
  width: 100%;
  height: 400px;
  border-radius: 8px;
}
</style>
