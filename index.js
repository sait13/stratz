import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 10000;
const STRATZ_TOKEN = process.env.STRATZ_TOKEN; // Добавь переменную окружения STRATZ_TOKEN

app.use(express.json());

app.get('/api/*', async (req, res) => {
  const stratzUrl = `https://api.stratz.com/${req.params[0]}`;
  try {
    const response = await fetch(stratzUrl, {
      headers: {
        Authorization: `Bearer ${STRATZ_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: 'Stratz API Error',
        details: text,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Proxy Server Error',
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
