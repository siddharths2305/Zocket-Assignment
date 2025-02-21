const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/suggest-task", async (req, res) => {
  const { userInput } = req.body;
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: `Suggest a task for: ${userInput}` }],
  });

  res.json({ suggestion: response.choices[0].message.content });
});

module.exports = router;
