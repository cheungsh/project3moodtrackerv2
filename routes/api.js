// Express will listen for API requests and respond accordingly
import express from 'express'
const router = express.Router()

// Load environment variables from .env
import dotenv from 'dotenv'
dotenv.config()

// Gemini GenAI SDK
import { GoogleGenAI } from '@google/genai'
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// Prisma lets NodeJS communicate with MongoDB
// Let's import and initialize the Prisma client
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Set this to match the model name in your Prisma schema
const model = 'mood'

/* ----- POST + Create------- */
//Posts the mood record to MongoDB, generating suggestion with Gemini AI
/* ----- POST ------- */
router.post('/mood', async (req, res) => {
  try {
    const {
      name,
      moodValue,
      exercise,
      hobby,
      meal,
      social,
      weather,
      period,
      sleepStart,
      sleepEnd,
      sleepHours,
      streak,
      suggestions
    } = req.body;

    // validate required fields
    if (!name ||!moodValue) {
      return res.status(400).json({ error: "name and moodValue are required" })
    }

    /* ----- Prompt fot Gemini ------ */
    // ------ Gemini PROMPT Construction ------
    // You can make this prompt as detailed as you wish!
    const prompt = `A user feels ${moodValue}. 
    They slept for ${sleepHours || "unknown"} hours yesterday. 
    They have eaten: ${meal && meal.length > 0 ? meal.join(', ') : "unknown"}. 
    They ${social && (Array.isArray(social) ? social.includes('alone') : social === "alone") ? "didn't" : "did"} socialize.
    They did: ${exercise && exercise.length > 0 ? exercise.join(", ") : "no exercise or unknown"}.
    They enjoyed hobbies: ${hobby && hobby.length > 0 ? hobby.join(", ") : "none or unknown"}.
    Weather was: ${weather && weather.length > 0 ? weather.join(", ") : "unknown"}.
    They are${period ? "" : " not"} on their period.
    
    Generate a kind, specific, helpful suggestion to enhance their mood. Use supportive language.
    `

    // ------ Call Gemini ------
    let geminiSuggestion = "Generating..."
    try {
      const geminiRes = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      geminiSuggestion = geminiRes.text || geminiRes.candidates?.[0]?.content?.parts?.[0]?.text || geminiSuggestion;
    } catch (err) {
      console.error("Gemini suggestion generation failed:", err)
      // remains as default suggestion
    }

    /* ----- CREATE ------- */
    //Create a new mood record in MongoDB
    const newMood = await prisma[model].create({
      data: {
        name: name || 'Anonymous',
        date: new Date(),
        moodValue,
        exercise: exercise || '',
        hobby: hobby || '',
        meal: meal || '',
        social: social || '',
        weather: weather || '',
        period: Boolean(period),
        sleepStart: sleepStart ? new Date(sleepStart) : new Date(),
        sleepEnd: sleepEnd ? new Date(sleepEnd) : new Date(),
        sleepHours: sleepHours ? parseFloat(sleepHours) : 0,
        streak: streak || 0,
        suggestions: geminiSuggestion,
      },
    });
    console.log('Mood saved:', newMood);
    
    res.status(201).json(newMood);

  } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// export the api routes for use elsewhere in our app 
// (e.g. in index.js )
export default router;

