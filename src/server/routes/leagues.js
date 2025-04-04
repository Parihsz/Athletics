import express from 'express'
import League from '../models/League.js'

const router = express.Router()

router.post('/leagues', async (req, res) => {
  const { name, games } = req.body
  if (!name || !Array.isArray(games)) {
    return res.status(400).json({ message: 'Missing league name or games array' })
  }

  try {
    const league = new League({ name, games })
    await league.save()
    res.status(201).json({ message: 'League created', league })
  } catch (err) {
    res.status(500).json({ message: 'Error saving league', error: err.message })
  }
})

router.get('/leagues', async (req, res) => {
  try {
    const leagues = await League.find()
    res.json(leagues)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leagues', error: err.message })
  }
})

router.patch('/leagues/:id', async (req, res) => {
  const { name, games } = req.body
  if (!name || !Array.isArray(games)) {
    return res.status(400).json({ message: 'Missing league name or games array' })
  }

  try {
    const league = await League.findByIdAndUpdate(
      req.params.id,
      { name, games },
      { new: true }
    )
    if (!league) return res.status(404).json({ message: 'League not found' })
    res.json({ message: 'League updated', league })
  } catch (err) {
    res.status(500).json({ message: 'Error updating league', error: err.message })
  }
})

router.delete('/leagues/:id', async (req, res) => {
  try {
    const result = await League.findByIdAndDelete(req.params.id)
    if (!result) return res.status(404).json({ message: 'League not found' })
    res.json({ message: 'League deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting league', error: err.message })
  }
})

export default router
