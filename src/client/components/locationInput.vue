<template>
  <div>
    <input
      v-model="localValue"
      class="input"
      type="text"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: 'Enter a location' }
})
const emit = defineEmits(['update:modelValue', 'update:position'])

const localValue = ref(props.modelValue || '')

watch(() => props.modelValue, newVal => {
  if (newVal !== localValue.value) {
    localValue.value = newVal
  }
})

watch(localValue, newVal => {
  emit('update:modelValue', newVal)
})

</script>

<style scoped>
.input {
  width: 100%;
}
</style>
