<template>
  <section class="hero is-fullheight-with-navbar home-hero">
    <div class="hero-body">
      <div class="container">
        <Notifications ref="notifications_ref" />

        <h1 class="title has-text-centered animated fadeInDown">
          Welcome to the Athletics Portal
        </h1>
        <p class="subtitle has-text-centered animated fadeInUp delay-1s">
          Filter events & view your schedule with map & notifications!
        </p>

        <div class="columns is-multiline mt-6 animated fadeInUp delay-2s">
          <div class="column is-one-third">
            <div class="box filter-box">
              <h2 class="subtitle">Select Team(s)</h2>
              <div class="team-checkboxes" style="max-height: 300px; overflow-y: auto;">
                <div class="field mb-2" v-for="team in ALL_TEAMS" :key="team">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      class="checkbox mr-2"
                      :value="team"
                      v-model="selected_teams"
                    />
                    {{ team }}
                  </label>
                </div>
              </div>
              <p class="help mt-2">Select one or more teams</p>
            </div>
          </div>

          <div class="column">
            <div class="box filter-box">
              <h2 class="subtitle">Select the Opponent</h2>
              <div class="select is-fullwidth">
                <select v-model="selected_opponent">
                  <option v-for="opp in OPPONENTS" :key="opp" :value="opp">
                    {{ opp }}
                  </option>
                </select>
              </div>

              <h2 class="subtitle mt-5">Select the Date</h2>
              <div class="buttons is-flex is-flex-wrap-wrap">
                <button
                  v-for="(label, idx) in DATE_FILTERS"
                  :key="idx"
                  class="button is-dark mb-2 mr-2"
                  @click="APPLY_DATE_FILTER(label)"
                >
                  {{ label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="columns mt-6 animated fadeInUp delay-3s">
          <div class="column is-two-thirds">
            <EventTable
              :headers="HEADERS"
              :events="filtered_events"
              @rowClicked="handle_row_clicked"
            />
            <button class="button is-primary mt-3" @click="notify_user">
              Notify Me!
            </button>
          </div>

          <div class="column">
            <Map ref="map_ref" :events="filtered_events" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import Notifications from '@/components/notifications.vue'
import EventTable from '@/components/eventTable.vue'
import Map from '@/components/map.vue'

const ALL_TEAMS = [
  'Badminton Senior (Gr 9 - 12)',
  'Badminton U14 (Grades 6 - 8)',
  'Baseball Senior Boys',
  'Softball Girls Grades 5 - 6',
  'Softball Girls Grades 7 - 8',
  'Track & Field (Gr 6 - 12)',
  'Ultimate Frisbee (Gr 9 - 12)'
]
const OPPONENTS = [
  'All Opponents',
  'Lincoln HS',
  'Valley High',
  'North River HS'
]
const ALL_EVENTS = [
  {
    who: 'Badminton Senior (Gr 9 - 12)',
    when: 'Mar 20, 4:00 PM',
    what: 'Practice',
    where: 'Main Gym',
    vs: 'Lincoln HS',
    notes: 'Bring water bottle',
    position: { lat: 40.7128, lng: -74.0060 }
  },
  {
    who: 'Softball Girls Grades 5 - 6',
    when: 'Mar 21, 3:00 PM',
    what: 'Game',
    where: 'East Field',
    vs: 'Valley High',
    notes: 'Wear away jerseys',
    position: { lat: 40.7228, lng: -74.0160 }
  },
  {
    who: 'Baseball Senior Boys',
    when: 'Mar 22, 5:00 PM',
    what: 'Practice',
    where: 'Main Field',
    vs: 'North River HS',
    notes: 'Practice hard',
    position: { lat: 40.7328, lng: -74.0260 }
  }
]

const selected_teams = ref([])
const selected_opponent = ref('All Opponents')
const selected_date_range = ref('')

const DATE_FILTERS = ['Today', 'Tomorrow', 'This Week', 'Next Week', 'This Season']
const HEADERS = ['WHO', 'WHEN', 'WHAT', 'WHERE', 'VS', 'NOTES']

const SELECTED_DATE_LOOKUP = {
  'Today': eventDay => eventDay.isSame(dayjs(), 'day'),
  'Tomorrow': eventDay => eventDay.isSame(dayjs().add(1, 'day'), 'day'),
  'This Week': eventDay => eventDay.isSame(dayjs(), 'week'),
  'Next Week': eventDay => {
    const start = dayjs().add(1, 'week').startOf('week')
    const end = dayjs().add(1, 'week').endOf('week')
    return eventDay.isBetween(start, end, null, '[]')
  },
  'This Season': eventDay => {
    const currentYear = dayjs().year()
    const seasonStart = dayjs(`Mar 1, ${currentYear}`, 'MMM D, YYYY')
    const seasonEnd = dayjs(`May 31, ${currentYear}`, 'MMM D, YYYY')
    return eventDay.isBetween(seasonStart, seasonEnd, null, '[]')
  }
}

function APPLY_DATE_FILTER(label) {
  selected_date_range.value = label
}

const filtered_events = computed(() => {
  let filtered = [...ALL_EVENTS]
  if (selected_teams.value.length > 0) {
    filtered = filtered.filter(e => selected_teams.value.includes(e.who))
  }
  if (selected_opponent.value !== 'All Opponents') {
    filtered = filtered.filter(e => e.vs === selected_opponent.value)
  }
  if (selected_date_range.value) {
    filtered = filtered.filter(e => {
      const eventDay = dayjs(e.when, 'MMM D, h:mm A')
      return SELECTED_DATE_LOOKUP[selected_date_range.value](eventDay)
    })
  }
  return filtered
})

const notifications_ref = ref(null)
const map_ref = ref(null)

function notify_user() {
  notifications_ref.value?.addNotification('Upcoming event: Check the schedule!')
}

function handle_row_clicked(event) {
  map_ref.value?.focusOnEvent(event)
}
</script>

<style scoped>
.home-hero {
  background: #f7f9fc;
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.filter-box {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}
.animated {
  animation-duration: 0.6s;
  animation-fill-mode: both;
}
.fadeInDown {
  animation-name: fadeInDown;
}
.fadeInUp {
  animation-name: fadeInUp;
}
.delay-1s {
  animation-delay: 0.2s;
}
.delay-2s {
  animation-delay: 0.4s;
}
.delay-3s {
  animation-delay: 0.6s;
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .columns {
    flex-direction: column;
  }
  .filter-box {
    margin-bottom: 1rem;
  }
}
</style>
