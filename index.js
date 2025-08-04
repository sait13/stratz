import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 10000;

// Замените на свой Stratz API ключ
const STRATZ_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiNGQzZWZkNmEtMjk2ZS00NDExLTkzYzItNDUzMTdjZGUxY2I1IiwiU3RlYW1JZCI6IjE0NDczMzQyOCIsIkFQSVVzZXIiOiJ0cnVlIiwibmJmIjoxNzU0MTQ5OTA2LCJleHAiOjE3ODU2ODU5MDYsImlhdCI6MTc1NDE0OTkwNiwiaXNzIjoiaHR0cHM6Ly9hcGkuc3RyYXR6LmNvbSJ9.eCUIrN44qvmccR92xlqzDSnlfCKMurB-QMaFoj72Pn8';

app.get('/player/:steamId64', async (req, res) => {
  const { steamId64 } = req.params;
  const url = `https://api.stratz.com/api/v1/Player/${steamId64}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${STRATZ_TOKEN}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Stratz API Error', details: await response.text() });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
