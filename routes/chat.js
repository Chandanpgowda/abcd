const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

let openai;
try {
  // Initialize Groq client only if API key is present
  if (!process.env.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY is missing in environment variables');
  } else {
    openai = new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
    });
    console.log('✅ Groq client initialized');
  }
} catch (err) {
  console.error('❌ Failed to initialize Groq client:', err.message);
}

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    console.log('Received messages count:', messages?.length);

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }

    // If Groq client isn't available, return a friendly error
    if (!openai) {
      return res.status(503).json({ error: 'AI service is currently unavailable. Please try again later.' });
    }

    const systemMessage = {
      role: 'system',
      content: 'You are the official AI assistant for TechSpark, the technical club at Navkis College of Engineering. You know that the club was founded in 2020, has over 100 members, and organizes events like coding competitions, robotics workshops, and gaming tournaments (BGMI, Free Fire). Our upcoming event is "Spark Arena" on March 28, 2026. Be enthusiastic, concise, and helpful. If asked about events, direct users to the Events page.'
    };

    const fullMessages = [systemMessage, ...messages];

    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('Full error details:', error);
    let errorMessage = 'Something went wrong. Please try again later.';
    if (error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please wait a moment.';
    } else if (error.status === 401) {
      errorMessage = 'Invalid API key.';
    }
    res.status(500).json({ error: errorMessage });
  }
});

module.exports = router;