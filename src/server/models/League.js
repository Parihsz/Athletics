import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
  date: String,
  opponent: String,
  location: String,
  notes: String,
  position: Object 
})

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  games: [gameSchema]
})

const leagueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teams: [teamSchema]
})

export default mongoose.model('League', leagueSchema)
