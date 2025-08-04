const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Стандартный токен — замени на свой Stratz API Token
const STRATZ_API_TOKEN = process.env.STRATZ_API_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiNGQzZWZkNmEtMjk2ZS00NDExLTkzYzItNDUzMTdjZGUxY2I1IiwiU3RlYW1JZCI6IjE0NDczMzQyOCIsIkFQSVVzZXIiOiJ0cnVlIiwibmJmIjoxNzU0MTQ5OTA2LCJleHAiOjE3ODU2ODU5MDYsImlhdCI6MTc1NDE0OTkwNiwiaXNzIjoiaHR0cHM6Ly9hcGkuc3RyYXR6LmNvbSJ9.eCUIrN44qvmccR92xlqzDSnlfCKMurB-QMaFoj72Pn8';

app.use(cors());

app.get('/player/:id', async (req, res) => {
  const playerId = req.params.id;

  try {
    const query = `
      query {
        player(steamAccountId: ${playerId}) {
          steamAccountId
          name
          rank
          isPro
          mmrEstimate {
            rank
            percentile
          }
          country
          avatar
        }
      }
    `;

    const response = await fetch('https://api.stratz.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRATZ_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error: 'Stratz API error', details: error });
    }

    const result = await response.json();
    return res.json(result.data.player);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
