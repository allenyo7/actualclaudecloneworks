import "./normal.css"
import "./App.css"
import React from 'react';

const API_URL = 'https://actualclaudecloneworks-server.vercel.app/api/chat';

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
      const response = await fetch(API_URL, {
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
      {/* Rest of your component JSX remains the same */}
    </div>
  )
}

export default App