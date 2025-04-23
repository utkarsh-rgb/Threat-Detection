const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Route for prediction
app.post("/api/predict", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post("http://127.0.0.1:5000/predict", { text });
    res.json(response.data);
  } catch (error) {
    console.error("Error from Flask API (predict):", error.message);
    res.status(500).json({ error: "Failed to get prediction" });
  }
});

// Route for adding keyword
app.post("/api/add-keyword", async (req, res) => {
  const { keyword } = req.body;

  try {
    const response = await axios.post("http://127.0.0.1:5000/add-keyword", { keyword });
    res.json(response.data);
  } catch (error) {
    console.error("Error from Flask API (add-keyword):", error.message);
    res.status(500).json({ error: "Failed to add keyword" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Node server is running on http://localhost:${PORT}`);
});
