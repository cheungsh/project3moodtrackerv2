// Below we will use the Express Router to define a read only API endpoint
// Express will listen for API requests and respond accordingly
import express from 'express'
const router = express.Router()

// Prisma lets NodeJS communicate with MongoDB
// Let's import and initialize the Prisma client
// See also: https://www.prisma.io/docs
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Set this to match the model name in your Prisma schema
const model = 'mood'

/* ----- POST + Create------- */
//Posts the mood record to MongoDB
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
      console.log(err);
      res.status(500).send(err);
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
        suggestions: suggestions || '',
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

