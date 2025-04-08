<template>
  <div v-if="visible" class="modal is-active">
    <div class="modal-background" @click="close" />
    <div class="modal-content">
      <div ref="mapContainer" class="google-map"></div>
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

function close() {
  emit('close')
}

watch(() => props.visible, async (newVal) => {
  if (newVal && props.event?.where) {
    await nextTick()
    if (!geocoder) geocoder = new google.maps.Geocoder()

    geocoder.geocode({ address: props.event.where }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location
        if (!map) {
          map = new google.maps.Map(mapContainer.value, {
            center: location,
            zoom: 15
          })
        } else {
          map.setCenter(location)
        }

        if (marker) marker.setMap(null)

        marker = new google.maps.Marker({
          map,
          position: location,
          title: props.event.what
        })
      }
    })
  }
})
</script>

<style scoped>
.google-map {
  width: 100%;
  height: 400px;
  border-radius: 8px;
}
</style>
