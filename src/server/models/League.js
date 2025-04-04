import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
  date: String,
  opponent: String,
  location: String,
  notes: String
})

const leagueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  games: [gameSchema]
})

export default mongoose.model('League', leagueSchema)
