import { useState, useRef, useEffect, CSSProperties } from 'react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: 'Hi! How can I help you today?', 
      sender: 'bot', 
      timestamp: new Date() 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response (replace with actual API call)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! How can I assist you?";
    } else if (input.includes('gift') && input.includes('tree')) {
      return "I can help with that! What's the recipient's name?";
    }
    return "I'm not sure I understand. Could you rephrase that?";
  };

  // Styles
  const styles: Record<string, CSSProperties> = {
    chatIcon: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#28a745 ',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 1000
    },
    chatContainer: {
      position: 'fixed',
      bottom: '90px',
      right: '20px',
      width: '350px',
      height: isOpen ? '500px' : '0',
      border: isOpen ? '1px solid #ccc' : 'none',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'white',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      zIndex: 1000,
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
    },
    messages: {
      flex: 1,
      padding: '10px',
      overflowY: 'auto',
      backgroundColor: '#f9f9f9',
      display: isOpen ? 'block' : 'none'
    },
    message: {
      margin: '8px 0',
      padding: '8px 12px',
      borderRadius: '18px',
      maxWidth: '80%'
    },
    userMessage: {
      backgroundColor: '#007bff',
      color: 'white',
      marginLeft: 'auto',
      borderBottomRightRadius: '4px'
    },
    botMessage: {
      backgroundColor: '#e9ecef',
      color: 'black',
      marginRight: 'auto',
      borderBottomLeftRadius: '4px'
    },
    inputContainer: {
      display: isOpen ? 'flex' : 'none',
      padding: '10px',
      borderTop: '1px solid #ccc',
      backgroundColor: 'white'
    },
    input: {
      flex: 1,
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      marginRight: '8px'
    },
    button: {
      padding: '8px 16px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  };

  return (
    <>
      {/* Chat Icon */}
      <div 
        style={styles.chatIcon}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat support"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>

      {/* Chat Container */}
      <div style={styles.chatContainer}>
        <div style={styles.messages}>
          {messages.map((message) => (
            <div 
              key={message.id} 
              style={{
                ...styles.message,
                ...(message.sender === 'user' ? styles.userMessage : styles.botMessage)
              }}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            style={styles.input}
          />
          <button 
            onClick={handleSendMessage}
            style={styles.button}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}