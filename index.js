import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

// CORS manual (stabil di Vercel)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { apiKey, message } = req.body;
    if (!apiKey || !message) {
      return res.status(400).json({ reply: "API Key dan pesan wajib diisi" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(message);
    const text = result.response.text();

    return res.json({ reply: text });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ reply: "Gagal memanggil Gemini" });
  }
});

export default app;
