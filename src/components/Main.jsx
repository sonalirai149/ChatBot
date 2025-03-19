import React, { useState, useRef } from "react";
import "./Main.css";

const Main = () => {
  const [searchText, setSearchText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [isChatBoxAtBottom, setIsChatBoxAtBottom] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const API_KEY = "AIzaSyAUBR7ulGO1RVyiXFnAMGJNvi8NDlmyDp0";

  const handleClick = async () => {
    if (!searchText.trim()) return;

    const userMessage = { question: searchText, answer: "..." };
    setChatHistory((prevChat) => [...prevChat, userMessage]);
    setSearchText("");
    setLoading(true);
    setIsChatBoxAtBottom(true);
    setIsClicked(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `User asked: \"${searchText}\". formate the output to show on my chatbot screen and give only relevent text in response, and also response should be final so it should directly be shown on chat bot, there should be no template or any thing like that I want ready and formatted string so I do not have to change` }],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      let aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't understand.";
      aiResponse = aiResponse.replace(/\*/g, '');

      setChatHistory((prevChat) =>
        prevChat.map((chat, index) =>
          index === prevChat.length - 1 ? { ...chat, answer: aiResponse } : chat
        )
      );
    } catch (error) {
      console.error("Error fetching response:", error.message);
      setChatHistory((prevChat) =>
        prevChat.map((chat, index) =>
          index === prevChat.length - 1 ? { ...chat, answer: "Error in fetching response" } : chat
        )
      );
    }

    setLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="chat-container">
      <div className="header">
        <h1>Welcome to ChatBot</h1>
        <h2>How can I help you?</h2>
      </div>

      <div className={`Body ${isChatBoxAtBottom ? "moveChatBox" : ""}`}>
        {isClicked && (
          <div className="chatContainer">
            {chatHistory.map((chat, index) => (
              <div key={index} className="chat-message">
                <div className="user-message">{chat.question}</div>
                <div className="bot-message">{chat.answer.split("\n").map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        <div className="chatBox">
          <input
            type="text"
            placeholder="Ask something"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="button" onClick={handleClick} disabled={loading}>
            ⬆
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
