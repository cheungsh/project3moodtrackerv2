import express from 'express'
import apiRoutes from './routes/api.js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()

// Get the directory name (needed for ES modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// API Routes
app.use('/', apiRoutes)

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Export for Vercel
export default app

// Local development server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Express is live at http://localhost:${PORT}`)
  })
}