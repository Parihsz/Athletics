<template>
  <input
    ref="locationInput"
    class="input"
    type="text"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: 'Enter a location' }
})

const emit = defineEmits(['update:modelValue', 'update:position'])
const locationInput = ref(null)

onMounted(async () => {
  await nextTick()

  if (!window.google || !window.google.maps || !window.google.maps.places) {
    console.warn('[LocationInput] Google Maps Places API not loaded')
    return
  }

  console.log('[LocationInput] Initializing Google Places Autocomplete...')

  const autocomplete = new google.maps.places.Autocomplete(locationInput.value, {
    types: ['geocode'], 
    fields: ['formatted_address', 'geometry']
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    console.log('[LocationInput] Place selected:', place)

    if (!place.geometry) {
      console.warn('[LocationInput] No geometry found for place')
      return
    }
    console.log('[LocationInput] Place geometry:', place.geometry)
    emit('update:modelValue', place.formatted_address)
    emit('update:position', {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    })
  })

  locationInput.value.addEventListener('focus', () => {
    console.log('[LocationInput] Focused input, autocomplete should show')
  })
})
</script>

<style scoped>
.pac-container {
  z-index: 99999 !important;
}
</style>
