const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant'; // ✅ Updated active model

async function callGroq(model, systemPrompt, userPrompt) {
  const response = await axios.post(
    GROQ_URL,
    {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 400
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.choices?.[0]?.message?.content || '';
}

// POST /api/ai/summary
router.post('/summary', auth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'No content provided' });

  try {
    const summary = await callGroq(
      MODEL,
      'You are a helpful assistant that summarizes notes concisely.',
      `Summarize this note in 3–5 bullet points:\n\n${content}`
    );
    res.json({ summary });
  } catch (err) {
    console.error('Groq summary error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Groq API error', error: err.message });
  }
});

// POST /api/ai/improve
router.post('/improve', auth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'No content provided' });

  try {
    const improved = await callGroq(
      MODEL,
      'You are a writing assistant that improves clarity and grammar.',
      `Improve this note for clarity and grammar. Keep the same meaning:\n\n${content}`
    );
    res.json({ improved });
  } catch (err) {
    console.error('Groq improve error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Groq API error', error: err.message });
  }
});

// POST /api/ai/tags
router.post('/tags', auth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'No content provided' });

  try {
    const tagsText = await callGroq(
      MODEL,
      'You are a tagging assistant that generates 5–7 relevant keywords.',
      `Generate 5 short, single-word tags (comma separated) for this note:\n\n${content}`
    );
    const tags = tagsText.split(/[,\\n]/).map(t => t.trim()).filter(Boolean).slice(0, 7);
    res.json({ tags });
  } catch (err) {
    console.error('Groq tags error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Groq API error', error: err.message });
  }
});

module.exports = router;
