<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api'
import EventTable from '@/components/eventTable.vue'
import LocationInput from '@/components/locationInput.vue'
import MapModal from '@/components/mapModal.vue'

// 🔥 Use preloaded leagues & games
import {
  getCachedLeagues,
  getCachedEvents,
  fetchLeaguesOnce
} from '@/client/services/leagueService'

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
  await fetchLeaguesOnce() // re-fetch if needed
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
