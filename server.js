const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const USE_MOCK = String(process.env.USE_MOCK || '').toLowerCase() === 'true';

// Basic hardening: limit JSON body size and enable CORS for local testing
app.use(express.json({ limit: '10kb' }));
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));

// Rate limiter for API endpoints
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Serve static files (the static guide) so the client and API are same origin
app.use(express.static(path.join(__dirname)));

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body?.message;
  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid message in body' });
  }

  // Basic input length check to avoid very large prompts
  if (userMessage.length > 1000) {
    return res.status(400).json({ error: 'Message too long' });
  }

  // If mock mode is enabled, return a canned reply for offline testing.
  if (USE_MOCK) {
    const canned = `Typical visa required documents include: a valid passport (usually 6+ months validity), passport-sized photos that meet specifications, the completed application form, proof of funds (bank statements), travel itinerary and accommodation details, invitation/acceptance or employment letter if applicable, and any required medical or police certificates.`;
    return res.json({ reply: canned });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Server missing OPENAI_API_KEY in environment' });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a concise, helpful visa application assistant.' },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 400
    });

    const reply = completion?.choices?.[0]?.message?.content || 'No reply from LLM.';
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI API error', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'OpenAI API error', detail: err?.response?.data || err.message || String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
