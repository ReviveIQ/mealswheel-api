const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from your GitHub Pages site
app.use(cors({
  origin: [
    'https://reviveiq.github.io',
    'http://localhost:3000',
    'http://127.0.0.1:5500'  // for local testing
  ]
}));

app.use(express.json());

// Health check — Railway uses this to confirm the server is running
app.get('/', (req, res) => {
  res.json({ status: 'MealsWheel API is running 🍽️' });
});

// Recipe generation endpoint
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Anthropic API error' });
    }

    res.json(data);

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error — please try again' });
  }
});

app.listen(PORT, () => {
  console.log(`MealsWheel API running on port ${PORT}`);
});
