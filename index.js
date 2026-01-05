import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
console.log("ENV KEYS:", Object.keys(process.env).filter(k => k.includes("GEMINI")));


const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(message);
    const response = result.response.text();

    res.json({ reply: response });
  } catch (error) {
  console.error("ERROR GEMINI ASLI:", error);
  res.status(500).json({
    reply: "Terjadi error saat memanggil Gemini",
  });
}

});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server Gemini berjalan di port ${PORT}`);
});

