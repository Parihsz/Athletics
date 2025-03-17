<template>
  <transition-group name="notification-list" tag="div" class="notification-list">
    <div
      v-for="(note, index) in notifications"
      :key="note.id"
      class="notification is-light is-dark"
    >
      <button class="delete" @click="remove_notification(note.id)"></button>
      {{ note.message }}
    </div>
  </transition-group>
</template>

<script setup>
import { ref, defineExpose } from 'vue'

const notifications = ref([])

function add_notification(msg) {
  const id = Date.now()
  notifications.value.push({ id, message: msg })
}

function remove_notification(id) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

defineExpose({ add_notification, remove_notification })
</script>

<style scoped>
.notification-list {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 9999;
}
.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 0.4s;
}
.notification-list-enter-from,
.notification-list-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>
