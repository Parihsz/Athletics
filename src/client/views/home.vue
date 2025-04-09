<template>
  <section class="hero is-fullheight-with-navbar home-hero">
    <div class="hero-body">
      <div class="container">

        <h1 class="title has-text-centered animated fadeInDown">
          Athletics Portal (better than dcipher)
        </h1>
        <p class="subtitle has-text-centered animated fadeInUp delay-1s">
          Filter events and view schedules <3
        </p>

        <!-- League Selector -->
        <div class="box filter-box mb-5 animated fadeInUp delay-2s">
          <h2 class="subtitle">Select League</h2>
          <div class="select is-fullwidth">
            <select v-model="selected_league">
              <option value="">All Leagues</option>
              <option v-for="league in leagueNames" :key="league" :value="league">
                {{ league }}
              </option>
            </select>
          </div>
        </div>

        <!-- Filters Section (Fixed columns) -->
        <div class="columns is-multiline animated fadeInUp delay-2s">
          <!-- Team Filter -->
          <div class="column is-one-third">
            <div class="box filter-box">
              <h2 class="subtitle">Select Team(s)</h2>
              <div class="team-checkboxes" style="max-height: 300px; overflow-y: auto;">
                <div
                  class="field mb-2"
                  v-for="team in ALL_TEAMS"
                  :key="team"
                >
                  <label class="checkbox" style="display: flex; align-items: center;">
                    <input
                      type="checkbox"
                      class="mr-2"
                      :value="team"
                      v-model="selected_teams"
                      style="margin-right: 0.5rem;"
                    />
                    {{ team }}
                  </label>
                </div>
              </div>
              <p class="help mt-2">Select one or more teams</p>
            </div>
          </div>

          <!-- Opponent and Date Filter -->
          <div class="column">
            <div class="box filter-box">
              <h2 class="subtitle">Select the Opponent</h2>
              <div class="select is-fullwidth">
                <select v-model="selected_opponent">
                  <option>All Opponents</option>
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

        <!-- Event Table -->
        <div class="columns is-centered mt-6 animated fadeInUp delay-3s">
          <div class="column is-11">
            <EventTable
              :headers="['LEAGUE', 'TEAM', 'WHEN', 'WHAT', 'WHERE', 'VS', 'NOTES']"
              :events="filtered_events"
              @rowClicked="handle_row_clicked"
            />
            <div class="has-text-centered">
              <button class="button is-primary mt-5" @click="notify_user">Notify Me!</button>
            </div>
          </div>
        </div>

        <!-- Map Modal -->
        <MapModal
          v-if="map_event"
          :event="map_event"
          :visible="show_map_modal"
          @close="close_map_modal"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import EventTable from '@/components/eventTable.vue'
import MapModal from '@/components/mapModal.vue'

import {
  getCachedLeagues,
  getCachedEvents
} from '@/services/leagueService'

const selected_league = ref('')
const selected_teams = ref([])
const selected_opponent = ref('All Opponents')
const selected_date_range = ref('')
const all_leagues_raw = ref([])
const all_events = ref([])

const map_event = ref(null)
const show_map_modal = ref(false)

const DATE_FILTERS = ['Today', 'Tomorrow', 'This Week', 'Next Week', 'This Season']

const leagueNames = computed(() =>
  Array.from(new Set(all_leagues_raw.value.map(l => l.name)))
)

const ALL_TEAMS = computed(() => {
  const leagues = selected_league.value
    ? all_leagues_raw.value.filter(l => l.name === selected_league.value)
    : all_leagues_raw.value
  return Array.from(new Set(leagues.flatMap(l => l.teams.map(t => t.name))))
})

const OPPONENTS = computed(() => {
  const leagues = selected_league.value
    ? all_leagues_raw.value.filter(l => l.name === selected_league.value)
    : all_leagues_raw.value
  const games = leagues.flatMap(l => l.teams.flatMap(t => t.games))
  return ['All Opponents', ...Array.from(new Set(games.map(g => g.opponent)))]
})

const SELECTED_DATE_LOOKUP = {
  Today: d => d.isSame(dayjs(), 'day'),
  Tomorrow: d => d.isSame(dayjs().add(1, 'day'), 'day'),
  'This Week': d => d.isSame(dayjs(), 'week'),
  'Next Week': d => {
    const start = dayjs().add(1, 'week').startOf('week')
    const end = dayjs().add(1, 'week').endOf('week')
    return d.isBetween(start, end, null, '[]')
  },
  'This Season': d => {
    const year = dayjs().year()
    return d.isBetween(dayjs(`Mar 1, ${year}`, 'MMM D, YYYY'), dayjs(`May 31, ${year}`, 'MMM D, YYYY'), null, '[]')
  }
}

const filtered_events = computed(() => {
  let filtered = [...all_events.value]
  if (selected_league.value) filtered = filtered.filter(e => e.league === selected_league.value)
  if (selected_teams.value.length > 0) filtered = filtered.filter(e => selected_teams.value.includes(e.team))
  if (selected_opponent.value !== 'All Opponents') filtered = filtered.filter(e => e.vs === selected_opponent.value)
  if (selected_date_range.value) {
    filtered = filtered.filter(e =>
      SELECTED_DATE_LOOKUP[selected_date_range.value](dayjs(e.when, 'YYYY-MM-DD'))
    )
  }
  return filtered
})

function APPLY_DATE_FILTER(label) {
  selected_date_range.value = label
}

function handle_row_clicked(event) {
  console.log('[handle_row_clicked]', event)
  map_event.value = event
  show_map_modal.value = true
}

function close_map_modal() {
  show_map_modal.value = false
}

onMounted(() => {
  all_leagues_raw.value = getCachedLeagues()
  all_events.value = getCachedEvents()
})
</script>
