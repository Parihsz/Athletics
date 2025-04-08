<template>
  <div>
    <label for="locationInput">Enter a location:</label>
    <input id="locationInput" ref="locationInput" class="input" type="text" :placeholder="placeholder" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  placeholder: { type: String, default: 'Enter a location' }
});

const emit = defineEmits(['update:modelValue', 'update:position']);
const locationInput = ref(null);

onMounted(() => {
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    console.warn('[LocationInput] Google Maps Places API not loaded');
    return;
  }

  console.log('[LocationInput] Initializing PlaceAutocompleteElement...');

  const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement();
  placeAutocomplete.id = 'place-autocomplete';
  placeAutocomplete.setAttribute('placeholder', props.placeholder);

  locationInput.value.appendChild(placeAutocomplete);

  placeAutocomplete.addEventListener('gmp-placeselect', async (event) => {
    const place = await event.place;
    if (!place.geometry) {
      console.warn('[LocationInput] No geometry found for place');
      return;
    }
    console.log('[LocationInput] Place selected:', place);
    emit('update:modelValue', place.formatted_address);
    emit('update:position', {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    });
  });

  placeAutocomplete.addEventListener('focus', () => {
    console.log('[LocationInput] Focused input, autocomplete should show');
  });
});
</script>

<style scoped>
#place-autocomplete {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
