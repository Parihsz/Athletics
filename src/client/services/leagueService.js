import api from '@/api'

let cachedData = {
  leagues: [],
  events: [],
  isLoaded: false
}

export async function fetchLeaguesOnce() {
  if (cachedData.isLoaded) return cachedData

  const { data } = await api.get('/api/leagues')
  cachedData.leagues = data
  cachedData.events = data.flatMap(league =>
    league.teams.flatMap(team =>
      team.games.map(game => ({
        league: league.name,
        team: team.name,
        when: game.date,
        what: 'Game',
        where: game.location,
        vs: game.opponent,
        notes: game.notes,
        position: game.position ?? null
      }))
    )
  )
  cachedData.isLoaded = true
  return cachedData
}

export function getCachedLeagues() {
  return cachedData.leagues
}

export function getCachedEvents() {
  return cachedData.events
}
