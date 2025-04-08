<template>
  <div>
    <input
      class="input"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
      @blur="geocodeLocation"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: 'Enter a location' }
})
const emit = defineEmits(['update:modelValue', 'update:position'])

function handleInput(event) {
  emit('update:modelValue', event.target.value)
}

function geocodeLocation() {
  if (!window.google || !window.google.maps) {
    console.warn('[LocationInput] Google Maps JS API not loaded')
    return
  }

  const geocoder = new google.maps.Geocoder()
  const address = props.modelValue

  console.log('[LocationInput] Geocoding:', address)

  geocoder.geocode({ address }, (results, status) => {
    if (status !== 'OK') {
      console.warn('[LocationInput] Geocode failed:', status)
      return
    }

    const result = results[0]
    const location = result.geometry.location
    console.log('[LocationInput] First geocode result:', result)

    emit('update:modelValue', result.formatted_address)
    emit('update:position', {
      lat: location.lat(),
      lng: location.lng()
    })
  })
}
</script>
