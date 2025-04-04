import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import leagueRoutes from './routes/leagues.js'
import authMiddleware from './middleware/auth.js'
import User from './models/User.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: 'https://athletics-frontend.onrender.com', 
  credentials: true 
}))
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected')

    const exists = await User.findOne({ username: 'parihsz' })
    if (!exists) {
      const newUser = new User({
        username: 'parihsz',
        password: 'password'
      })

      await newUser.save()
      console.log('👤 Seeded admin user: parihsz')
    } else {
      console.log('ℹ️ Admin user already exists')
    }
  })
  .catch(err => console.error('❌ MongoDB error:', err))

app.use('/api', authRoutes)
app.use('/api', leagueRoutes)

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you have access.` })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
