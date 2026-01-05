import { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!prompt) return;

    setLoading(true);
    setReply("");

    try {
      const response = await fetch("https://gemini-backend-plum-six.vercel.app/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();
      setReply(data.reply);
    } catch (error) {
      setReply("Gagal menghubungi server");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>Gemini App (Local Test)</h2>

      <textarea
        placeholder="Tulis pesan..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", height: 120, padding: 10 }}
      />

      <button
        onClick={sendMessage}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        {loading ? "Mengirim..." : "Kirim"}
      </button>

      {reply && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            background: "#f0f0f0",
            borderRadius: 5,
          }}
        >
          <strong>Balasan Server:</strong>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}

export default App;

