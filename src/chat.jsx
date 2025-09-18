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
        const res = await axios.get("https://ektachatboatbackend.onrender.com/api/history");
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
      const res = await axios.post("https://ektachatboatbackend.onrender.com/api/chat", {
        userinput: input,
      });
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
    background: "#555",
    display: "inline-block",
    animation: `blink 1.4s ${delay}s infinite both`,
  });

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #e0f7fa, #fce4ec)",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        💬 Ekta Chat
      </h2>
       <button
         
          style={{
            background: "#25d366",
            color: "#fff",
            border: "none",
            padding: "0 20px",
            borderRadius: "50%",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
            onClick={()=>{
                   
                           const  yes = confirm("are you want to delete all chat?");
                           if(yes){

                            axios.get('https://ektachatboatbackend.onrender.com/api/delete')
                            .then((res)=>{
                                 alert("chat deleted")
                                 window.location.href = '/'
                            })
                            .catch((err)=>{
                                 console.log(err)
                            })
                           }
                  
            }}
        >
          clear all
        </button>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          borderRadius: "10px",
          background: "#fff",
          padding: "15px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px 14px",
                borderRadius: "15px",
                fontSize: "14px",
                lineHeight: "1.4",
                background: msg.role === "user" ? "#d9fdd3" : "#e4e6eb",
                color: "#111",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
                wordWrap: "break-word",
              }}
            >
              <b>{msg.role === "user" ? "You" : "Ekta"}:</b> {msg.parts[0].text}
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
                borderRadius: "15px",
                fontSize: "14px",
                lineHeight: "1.4",
                background: "#e4e6eb",
                color: "#111",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
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
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "14px",
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          style={{
            background: "#25d366",
            color: "#fff",
            border: "none",
            padding: "0 20px",
            borderRadius: "50%",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
          onMouseOver={(e) => (e.target.style.background = "#1ebc57")}
          onMouseOut={(e) => (e.target.style.background = "#25d366")}
        >
          ➤
        </button>
        
      </div>
    </div>
  );
}
