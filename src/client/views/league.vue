<template>
  <section class="section">
    <div class="container">
      <h1 class="title has-text-centered mb-5 animated fadeInDown">League Manager</h1>

      <div class="box mb-6 animated fadeInUp">
        <div class="field">
          <label class="label">Select Existing League</label>
          <div class="select is-fullwidth">
            <select v-model="selected_league_id" @change="select_league(selected_league_id)">
              <option value="">Create New League</option>
              <option v-for="l in all_leagues" :key="l._id" :value="l._id">{{ l.name }}</option>
            </select>
          </div>
        </div>

        <div class="field mt-4">
          <label class="label">League Name</label>
          <input v-model="league_name" class="input" type="text" placeholder="e.g. D1 Basketball" />
        </div>

        <div v-for="(team, tIndex) in teams" :key="tIndex" class="box mb-5">
          <div class="field">
            <label class="label">Team {{ tIndex + 1 }} Name</label>
            <input v-model="team.name" class="input" placeholder="Team Name" />
          </div>

          <div v-for="(game, gIndex) in team.games" :key="gIndex" class="box game-card mt-3">
            <div class="is-flex is-justify-content-space-between is-align-items-center mb-2">
              <strong class="is-size-6">Game {{ gIndex + 1 }}</strong>
              <div>
                <button class="button is-info is-small mr-2" @click="open_editor(tIndex, gIndex)">Edit</button>
                <button class="button is-danger is-small" @click="remove_game(tIndex, gIndex)">Delete</button>
              </div>
            </div>
            <p class="is-size-7 has-text-grey">
              {{ game.date }} | {{ game.opponent }} | {{ game.location }}
              <button class="button is-text is-small ml-2" @click="open_map(game)">📍</button>
            </p>
          </div>

          <button class="button is-link is-light mt-3" @click="add_game(tIndex)">Add Game</button>
          <button class="button is-danger is-light mt-3" @click="remove_team(tIndex)">Remove Team</button>
        </div>

        <div class="buttons is-justify-content-space-between mt-5">
          <button class="button is-success is-light" @click="add_team">Add Team</button>
          <button class="button is-primary is-fullwidth animated bounceIn" @click="submit_league">
            {{ is_editing ? 'Update League' : 'Create League' }}
          </button>
        </div>

        <button
          v-if="is_editing"
          class="button is-danger is-fullwidth mt-3"
          @click="delete_league"
        >
          Delete League
        </button>
      </div>

      <div class="box mt-6 animated fadeIn">
        <h2 class="subtitle mb-4">Saved Leagues & Games</h2>
        <div v-if="all_games.length === 0" class="has-text-grey is-italic">No leagues yet</div>
        <EventTable
          v-else
          :headers="['WHO', 'WHEN', 'WHAT', 'WHERE', 'VS', 'NOTES']"
          :events="all_games"
          @rowClicked="open_map"
        />
      </div>

      <MapModal :event="map_event" :visible="show_map_modal" @close="close_map" />

      <div class="modal" :class="{ 'is-active': show_modal }">
        <div class="modal-background" @click="close_editor"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Edit Game</p>
            <button class="delete" @click="close_editor" aria-label="close"></button>
          </header>
          <section class="modal-card-body">
            <div class="field">
              <label class="label">Date</label>
              <input v-model="modal_game.date" type="date" class="input" />
            </div>
            <div class="field">
              <label class="label">Opponent</label>
              <input v-model="modal_game.opponent" class="input" />
            </div>
            <div class="field">
              <label class="label">Location</label>
              <LocationInput
                v-model="modal_game.location"
                @update:position="modal_game.position = $event"
              />
            </div>
            <div class="field">
              <label class="label">Notes</label>
              <textarea v-model="modal_game.notes" class="textarea"></textarea>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-success" @click="save_game_edits">Save</button>
            <button class="button" @click="close_editor">Cancel</button>
          </footer>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api'
import EventTable from '@/components/eventTable.vue'
import LocationInput from '@/components/locationInput.vue'
import MapModal from '@/components/mapModal.vue'

import {
  getCachedLeagues,
  getCachedEvents,
  fetchLeaguesOnce
} from '@/services/leagueService'

const league_name = ref('')
const teams = ref([])
const all_leagues = ref([])
const all_games = ref([])
const selected_league_id = ref('')
const is_editing = computed(() => !!selected_league_id.value)

const show_modal = ref(false)
const show_map_modal = ref(false)
const map_event = ref(null)

const modal_game = ref({})
const modal_team_index = ref(null)
const modal_game_index = ref(null)

function open_map(event) {
  map_event.value = event
  show_map_modal.value = true
}

function close_map() {
  show_map_modal.value = false
}

function open_editor(teamIndex, gameIndex) {
  modal_team_index.value = teamIndex
  modal_game_index.value = gameIndex
  modal_game.value = { ...teams.value[teamIndex].games[gameIndex] }
  show_modal.value = true
}

async function save_game_edits() {
  if (modal_game.value.location && window.google?.maps?.Geocoder) {
    const geocoder = new google.maps.Geocoder()
    try {
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: modal_game.value.location }, (res, status) => {
          if (status === 'OK' && res[0]?.geometry?.location) {
            resolve(res[0])
          } else {
            reject('Geocode failed: ' + status)
          }
        })
      })
      modal_game.value.position = {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng()
      }
    } catch (err) {
      modal_game.value.position = null
    }
  }
  teams.value[modal_team_index.value].games[modal_game_index.value] = { ...modal_game.value }
  close_editor()
}

function close_editor() {
  show_modal.value = false
  modal_game.value = {}
  modal_team_index.value = null
  modal_game_index.value = null
}

function add_team() {
  teams.value.push({ name: '', games: [{ date: '', opponent: '', location: '', notes: '', position: null }] })
}
function remove_team(index) {
  teams.value.splice(index, 1)
}
function add_game(teamIndex) {
  teams.value[teamIndex].games.push({ date: '', opponent: '', location: '', notes: '', position: null })
}
function remove_game(teamIndex, gameIndex) {
  teams.value[teamIndex].games.splice(gameIndex, 1)
}
function select_league(id) {
  const found = all_leagues.value.find(l => l._id === id)
  if (!found) return
  league_name.value = found.name
  teams.value = found.teams || []
}

function reset_form() {
  selected_league_id.value = ''
  league_name.value = ''
  teams.value = []
}

async function submit_league() {
  if (!league_name.value || teams.value.length === 0) {
    alert('Please enter a league name and at least one team.')
    return
  }
  try {
    const payload = { name: league_name.value, teams: teams.value }
    if (is_editing.value) {
      await api.patch(`/api/leagues/${selected_league_id.value}`, payload)
      alert('League updated!')
    } else {
      await api.post('/api/leagues', payload)
      alert('League created!')
    }
    reset_form()
    await reload_leagues()
  } catch (err) {
    alert(`Error: ${err.response?.data?.message || err.message}`)
    console.error(err)
  }
}

async function delete_league() {
  if (!selected_league_id.value) return
  if (!confirm('Are you sure you want to delete this league?')) return
  try {
    await api.delete(`/api/leagues/${selected_league_id.value}`)
    alert('League deleted!')
    reset_form()
    await reload_leagues()
  } catch (err) {
    alert(`Error deleting league: ${err.response?.data?.message || err.message}`)
    console.error(err)
  }
}

async function reload_leagues() {
  await fetchLeaguesOnce()
  all_leagues.value = getCachedLeagues()
  all_games.value = getCachedEvents().map(e => ({
    who: `${e.league} - ${e.team}`,
    when: e.when,
    what: e.what,
    where: e.where,
    vs: e.vs,
    notes: e.notes,
    position: e.position ?? null
  }))
}

onMounted(reload_leagues)
</script>

<style scoped>
.box {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.game-card {
  border-left: 4px solid #3273dc;
  border-radius: 6px;
  padding: 1.25rem;
  transition: box-shadow 0.2s;
}
.game-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}
.animated {
  animation-duration: 0.5s;
  animation-fill-mode: both;
}
.fadeInDown { animation-name: fadeInDown; }
.fadeInUp { animation-name: fadeInUp; }
.bounceIn { animation-name: bounceIn; }
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
h1.title, p.subtitle { color: #222; }
@media (prefers-color-scheme: dark) {
  h1.title, p.subtitle { color: #000; }
}
</style>
