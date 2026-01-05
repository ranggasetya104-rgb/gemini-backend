import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

console.log("API KEY ADA:", !!process.env.GEMINI_API_KEY);

const app = express();

/* === CORS HARUS DI ATAS & EKSPLISIT === */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

/* === HANDLE PREFLIGHT === */
app.options("*", cors());

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Pesan kosong" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(message);
    const response = result.response.text();

    return res.json({ reply: response });

  } catch (error) {
    console.error("ERROR GEMINI ASLI:", error);
    return res.status(500).json({
      reply: "Terjadi error saat memanggil Gemini"
    });
  }
});

/* === UNTUK TEST DI BROWSER (OPSIONAL) === */
app.get("/", (req, res) => {
  res.send("Backend Gemini berjalan");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server Gemini berjalan di port ${PORT}`);
});
