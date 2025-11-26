import express from 'express'
import apiRoutes from './routes/api.js' // Your API routes file
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.static('public')) // Serve static files

// Use your API routes
app.use('/', apiRoutes)

// Export for Vercel
export default app

// Only listen locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Express is live at http://localhost:${PORT}`)
  })
}