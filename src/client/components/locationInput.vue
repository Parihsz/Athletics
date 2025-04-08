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
import { ref, onMounted } from 'vue'

const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: 'Enter a location' }
})
const emit = defineEmits(['update:modelValue', 'update:position'])

const locationInput = ref(null)

onMounted(() => {
  if (!window.google || !window.google.maps) return

  const autocomplete = new google.maps.places.Autocomplete(locationInput.value, {
    types: ['geocode'],
    fields: ['formatted_address', 'geometry']
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    if (!place.geometry) return

    emit('update:modelValue', place.formatted_address)
    emit('update:position', {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    })
  })
})
</script>
