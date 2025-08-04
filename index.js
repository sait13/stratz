const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

const STRATZ_API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdWJqZWN0IjoiNGQzZWZkNmEtMjk2ZS00NDExLTkzYzItNDUzMTdjZGUxY2I1IiwiU3RlYW1JZCI6IjE0NDczMzQyOCIsIkFQSVVzZXIiOiJ0cnVlIiwibmJmIjoxNzU0MTQ5OTA2LCJleHAiOjE3ODU2ODU5MDYsImlhdCI6MTc1NDE0OTkwNiwiaXNzIjoiaHR0cHM6Ly9hcGkuc3RyYXR6LmNvbSJ9.eCUIrN44qvmccR92xlqzDSnlfCKMurB-QMaFoj72Pn8";

function steam64To32(steam64) {
  const steam64n = BigInt(steam64);
  const steam32 = steam64n - 76561197960265728n;
  return steam32.toString();
}

app.get("/player/:steamId64", async (req, res) => {
  try {
    const steamId64 = req.params.steamId64;
    const steamId32 = steam64To32(steamId64);

    const response = await fetch(`https://api.stratz.com/api/v1/Player/${steamId32}`, {
      headers: {
        Authorization: `Bearer ${STRATZ_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: "Stratz API Error", details: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
