const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const STRATZ_TOKEN = process.env.STRATZ_TOKEN;

app.get("/player/:steamId32", async (req, res) => {
  try {
    const id = req.params.steamId32;
    const response = await axios.get(`https://api.stratz.com/api/v1/Player/${id}`, {
      headers: {
        Authorization: `Bearer ${STRATZ_TOKEN}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || {},
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Proxy running on port", PORT));
