<template>
  <gmpx-place-autocomplete
    ref="autocompleteRef"
    class="input"
    placeholder="Enter a location"
    :value="localValue"
    @gmpx-placechange="onPlaceChange"
    @input="onInput"
  ></gmpx-place-autocomplete>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue', 'update:position'])

const autocompleteRef = ref(null)
const localValue = ref(props.modelValue || '')

watch(() => props.modelValue, (newVal) => {
  if (newVal !== localValue.value) {
    localValue.value = newVal
  }
})

function onInput(e) {
  localValue.value = e.target.value
  emit('update:modelValue', localValue.value)
  console.log('[LocationInput] Input changed manually:', localValue.value)
}

function onPlaceChange(event) {
  const place = event.detail
  console.log('[LocationInput] Place selected from autocomplete:', place)

  if (!place.geometry?.location) {
    console.warn('[LocationInput] No geometry found')
    return
  }

  localValue.value = place.formatted_address
  emit('update:modelValue', place.formatted_address)
  emit('update:position', {
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng()
  })
}
</script>
