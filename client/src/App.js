import "./normal.css"
import "./App.css"
import React from 'react';

function App() {
  const [input, setInput] = React.useState("");
  const [chatLog, setChatLog] = React.useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return; // Prevent empty submissions
    
    const newMessage = { user: 'Me', message: input };
    setChatLog([...chatLog, newMessage]);
    
    // Clear the input box
    setInput("");
    
    try {
      console.log("Sending request to backend...");
      const response = await fetch('http://localhost:3080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      console.log("Received response from backend:", data);
      setChatLog(prevChatLog => [...prevChatLog, { user: 'AI', message: data.response }]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button">
          <span>+</span>
          New Chat
        </div>
      </aside>

      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <div key={index} className={`chat-message ${message.user === 'Me' ? '' : 'chatgpt'}`}>
              <div className="chat-message-center">
                <div className={message.user === 'Me' ? "Avatar-me" : "Avatar-ai"}>
                  {message.user}
                </div>
                <div className="message">
                  {message.message}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <textarea
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="chat-input-textarea"
              placeholder="Type your message to Blallen here"
            ></textarea>
            <button type="submit" className="chat-input-submit-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default App
