<template>
  <div class="event-table-container">
    <h2 class="title is-4 has-text-centered">Event Schedule</h2>
    <div class="table-wrapper">
      <table class="table is-fullwidth is-hoverable eventstable">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(event, idx) in events"
            :key="idx"
            class="fade-in clickable-row"
            @click="$emit('rowClicked', event)"
          >
            <td>{{ event.who }}</td>
            <td>{{ event.when }}</td>
            <td>{{ event.what }}</td>
            <td>{{ event.where }}</td>
            <td>{{ event.vs }}</td>
            <td>{{ event.notes }}</td>
          </tr>
          <tr v-if="events.length === 0">
            <td colspan="6" class="has-text-centered">No events found!</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  headers: Array,
  events: Array
})
</script>

<style scoped>
.event-table-container {
  padding: 1rem;
  animation: fadeIn 0.5s ease-out;
}
.table-wrapper {
  overflow-x: auto;
  margin-top: 1rem;
}
table.eventstable {
  border-collapse: separate;
  border-spacing: 0;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
table.eventstable thead {
  background-color: #222;
}
table.eventstable thead th {
  color: #fff;
  padding: 0.75rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
table.eventstable tbody td {
  padding: 0.75rem;
  font-size: 0.9rem;
  color: #222;
}
table.eventstable tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.04);
  transition: background-color 0.3s ease;
}
.fade-in { animation: fadeInRow 0.5s ease-in; }
.clickable-row { cursor: pointer; }
@keyframes fadeInRow {
  from { opacity: 0; }
  to { opacity: 1; }
}
h1.title, p.subtitle {
  color: #222;
}

@media (prefers-color-scheme: dark) {
  h1.title, p.subtitle {
    color: #000000;
  }
}
</style>
