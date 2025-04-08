<template>
  <gmpx-place-autocomplete
    class="input"
    placeholder="Enter a location"
    @gmpx-placechange="onPlaceChange"
  ></gmpx-place-autocomplete>
</template>

<script setup>
const emit = defineEmits(['update:modelValue', 'update:position'])

function onPlaceChange(event) {
  const place = event.detail
  console.log('[LocationInput] Place selected:', place)

  if (!place.geometry?.location) {
    console.warn('[LocationInput] No geometry found')
    return
  }

  emit('update:modelValue', place.formatted_address)
  emit('update:position', {
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng()
  })
}
</script>
