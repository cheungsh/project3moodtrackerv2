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

/* ----- POST Regular Mood ------- */
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
      streak
    } = req.body;

    // validate required fields
    if (!name || !moodValue) {
      return res.status(400).json({ error: "name and moodValue are required" })
    }

    /* ----- Prompt for Gemini ------ */
    const prompt = `A user feels ${moodValue}. 
    They slept for ${sleepHours || "unknown"} hours yesterday. 
    They have eaten: ${meal && meal.length > 0 ? meal.join(', ') : "unknown"}. 
    They ${social && (Array.isArray(social) ? social.includes('alone') : social === "alone") ? "didn't" : "did"} socialize.
    They did: ${exercise && exercise.length > 0 ? exercise.join(", ") : "no exercise or unknown"}.
    They enjoyed hobbies: ${hobby && hobby.length > 0 ? hobby.join(", ") : "none or unknown"}.
    Weather was: ${weather && weather.length > 0 ? weather.join(", ") : "unknown"}.
    They are${period ? "" : " not"} on their period.
    
    Generate a kind, specific, helpful suggestion to enhance their mood if they chose negative moods and encouragements to encourage them to keep doing what makes them feel happy if they chose positive moods. 
    Sound supportive, friendly and casual. 
    Limit your response to a maximum of 3 sentences only.
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
    const newMood = await prisma[model].create({
      data: {
        name: name || 'Anonymous',
        date: new Date(),
        moodValue,
        exercise: exercise || [],
        hobby: hobby || [],
        meal: meal || [],
        social: social || [],
        weather: weather || [],
        period: Boolean(period),
        scannedMood: null,
        scannedStreak: 0,
        scannedSuggestion: null,
        sleepStart: sleepStart ? new Date(sleepStart) : null,
        sleepEnd: sleepEnd ? new Date(sleepEnd) : null,
        sleepHours: sleepHours ? parseFloat(sleepHours) : null,
        streak: streak || 0,
        suggestions: geminiSuggestion,
      },
    });
    console.log('Mood saved:', newMood);
    
    res.status(201).json(newMood);

  } catch (err) {
    console.error('Error in /mood:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ----- POST Scanned Mood ------- */
router.post('/scannedMood', async (req, res) => {
  try {
    const {
      name,
      scannedMoodValue,
      scannedStreak
    } = req.body;

    console.log('Received scanned mood data:', { name, scannedMoodValue, scannedStreak });

    // validate required fields
    if (!name || !scannedMoodValue) {
      return res.status(400).json({ error: "name and scannedMoodValue are required" })
    }

    /* ----- Prompt for Gemini ------ */
    const prompt = `A user's facial expression was scanned and detected as ${scannedMoodValue}. 
    Based on their detected emotion of ${scannedMoodValue}.
    
    Generate a kind, specific, helpful suggestion to enhance their mood if they detected negative moods and generate encouragements to encourage them to keep doing what makes them feel happy if they detected positive moods. 
    Sound supportive, friendly and casual. 
    Limit your response to a maximum of 3 sentences only.
    
    `

    // ------ Call Gemini ------
    let geminiSuggestion2 = `You scanned as ${scannedMoodValue}! Keep tracking your emotions.`
    try {
      const geminiRes = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      geminiSuggestion2 = geminiRes.text || geminiRes.candidates?.[0]?.content?.parts?.[0]?.text || geminiSuggestion2;
    } catch (err) {
      console.error("Gemini suggestion generation failed:", err)
      // remains as default suggestion
    }

    /* ----- CREATE ------- */
    const newScannedMood = await prisma[model].create({
      data: {
        name: name || 'Anonymous',
        date: new Date(),
        moodValue: null,
        scannedMood: scannedMoodValue,
        scannedStreak: scannedStreak || 0,
        scannedSuggestion: geminiSuggestion2,
        // Set default/null values for other fields
        exercise: [],
        hobby: [],
        meal: [],
        social: [],
        weather: [],
        period: null,
        sleepStart: null,
        sleepEnd: null,
        sleepHours: null,
        streak: 0,
        suggestions: null,
      },
    });
    console.log('Scanned mood saved:', newScannedMood);
    
    res.status(201).json(newScannedMood);

  } catch (err) {
    console.error('Error in /scannedMood:', err);
    res.status(500).json({ error: err.message });
  }
});

// export the api routes for use elsewhere in our app 
export default router;