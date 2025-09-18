import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Inject keyframes for loading dots
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      @keyframes blink {
        0% { opacity: 0.2; }
        20% { opacity: 1; }
        100% { opacity: 0.2; }
      }
    `;
    document.head.appendChild(styleTag);
  }, []);

  // Fetch history on refresh
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          "https://ektachatboatbackend-1.onrender.com/api/history"
        );
        setMessages(res.data.history);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      setLoading(true);
      const res = await axios.post(
        "https://ektachatboatbackend-1.onrender.com/api/chat",
        {
          userinput: input,
        }
      );
      setMessages(res.data.history);
      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  const dotStyle = (delay) => ({
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#00ff99",
    display: "inline-block",
    animation: `blink 1.4s ${delay}s infinite both`,
  });

  return (
    <div
      style={{
        maxWidth: "650px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "15px",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        boxShadow: "0 0 20px rgba(0, 255, 200, 0.3)",
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        fontFamily: "Consolas, monospace",
        color: "#00ff99",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Clear Button */}
      <button
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "#ff007f",
          color: "#fff",
          border: "none",
          padding: "10px 16px",
          borderRadius: "50px",
          fontSize: "14px",
          cursor: "pointer",
          boxShadow: "0 0 10px #ff007f",
          transition: "0.2s all",
          zIndex: 10,
        }}
        onClick={() => {
          const yes = confirm("Are you sure you want to delete all chat?");
          if (yes) {
            axios
              .get(
                "https://ektachatboatbackend-1.onrender.com/api/delete"
              )
              .then(() => {
                alert("Chat deleted");
                window.location.href = "/";
              })
              .catch((err) => console.log(err));
          }
        }}
        onMouseOver={(e) => (e.target.style.boxShadow = "0 0 15px #ff007f")}
        onMouseOut={(e) => (e.target.style.boxShadow = "0 0 10px #ff007f")}
      >
        Clear All
      </button>

      <h2
        style={{
          textAlign: "center",
          marginBottom: "15px",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#00ff99",
          textShadow: "0 0 5px #00ff99",
        }}
      >
        💬 Ekta Chat
      </h2>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          borderRadius: "12px",
          background: "#0a1a2e",
          padding: "15px",
          overflowY: "auto",
          marginBottom: "10px",
          boxShadow: "inset 0 0 10px rgba(0,255,150,0.3)",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px 14px",
                borderRadius: "12px",
                fontSize: "14px",
                lineHeight: "1.4",
                background:
                  msg.role === "user"
                    ? "linear-gradient(90deg, #006400, #00ff99)"
                    : "linear-gradient(90deg, #001f3f, #004080)",
                color: "#fff",
                boxShadow: "0 0 5px rgba(0,255,150,0.5)",
                wordWrap: "break-word",
              }}
            >
              <b>{msg.role === "user" ? "You" : "Ekta"}:</b>{" "}
              {msg.parts[0].text}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px 14px",
                borderRadius: "12px",
                fontSize: "14px",
                lineHeight: "1.4",
                background: "linear-gradient(90deg, #001f3f, #004080)",
                color: "#fff",
                boxShadow: "0 0 5px rgba(0,255,150,0.5)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <b>Ekta:</b>
              <span style={dotStyle(0)}></span>
              <span style={dotStyle(0.2)}></span>
              <span style={dotStyle(0.4)}></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "25px",
            border: "1px solid #00ff99",
            outline: "none",
            fontSize: "14px",
            background: "#0a1a2e",
            color: "#00ff99",
            boxShadow: "0 0 5px rgba(0,255,150,0.5)",
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          style={{
            background: "#00ff99",
            color: "#0a1a2e",
            border: "none",
            padding: "0 20px",
            borderRadius: "50%",
            fontSize: "16px",
            cursor: "pointer",
            transition: "0.2s all",
            boxShadow: "0 0 10px #00ff99",
          }}
          onMouseOver={(e) => (e.target.style.boxShadow = "0 0 15px #00ff99")}
          onMouseOut={(e) => (e.target.style.boxShadow = "0 0 10px #00ff99")}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
