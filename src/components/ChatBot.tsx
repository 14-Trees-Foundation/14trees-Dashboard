import { useState, useRef, useEffect } from 'react';
import ApiClient from '../api/apiClient/apiClient';
import ReactMarkdown from 'react-markdown';
import { styled } from '@mui/material/styles';

// 4. 🤝 **Help you get connected** with someone from our team.
const defaultMessage = `**Hello! 🌿 Greetings from 14 Trees Foundation!**  
I'm your digital assistant, here to help you spread green joy through tree gifting. Here’s what I can help you with:

1. 🌱 **Create a Tree Gifting Request**  
   Gift trees to someone special with a personalized message and occasion.

2. 📝 **Update an Existing Request**  
   Edit the occasion, message, or recipient details of a tree gift you've already created.

3. 📋 **View Your Past Requests**  
   See all your previous tree gifting requests and their details.

4. 🎁 **Send Tree Cards or Dashboards**  
   Email tree cards or tree dashboards to recipients from your past requests.

5. 💬 **Get Support**  
   Connect with a team member for help or additional questions.
`

// const defaultMessage = `**Hello! 🌿 Greetings from 14 Trees Foundation!**  
// I'm your digital assistant, here to help you spread green joy. Here's what I can assist you with:

// 1. List your previous orders of giftable trees
// 2. List your previous gift trees actions
// 3. Fetch number of available giftable trees from your previos purchased orders

// How can I assist you today?`

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Styled Components
const ChatIcon = styled('div')({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#28a745',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  zIndex: 1000
});

const ChatContainer = styled('div')<{ isOpen: boolean }>(({ isOpen }) => ({
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
}));

const MessagesContainer = styled('div')<{ isOpen: boolean }>(({ isOpen }) => ({
  flex: 1,
  padding: '10px',
  overflowY: 'auto',
  backgroundColor: '#f9f9f9',
  display: isOpen ? 'block' : 'none'
}));

const MessageBubble = styled('div')({
  margin: '8px 0',
  padding: '8px 12px',
  borderRadius: '18px',
  maxWidth: '80%'
});

const UserMessage = styled(MessageBubble)({
  backgroundColor: '#28a745',
  color: 'white',
  marginLeft: 'auto',
  borderBottomRightRadius: '4px'
});

const BotMessage = styled(MessageBubble)({
  backgroundColor: '#e9ecef',
  color: 'black',
  marginRight: 'auto',
  borderBottomLeftRadius: '4px'
});

const InputContainer = styled('div')<{ isOpen: boolean }>(({ isOpen }) => ({
  display: isOpen ? 'flex' : 'none',
  padding: '10px',
  borderTop: '1px solid #ccc',
  backgroundColor: 'white'
}));

const TextInput = styled('input')({
  flex: 1,
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  marginRight: '8px'
});

const SendButton = styled('button')({
  padding: '8px 16px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
});

// Component
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: defaultMessage,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const typingMessage: Message = {
      id: 'typing',
      text: 'Typing',
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, typingMessage]);

    let tries = 3;
    while(tries--) {
      let botResponse: Message = { ...typingMessage };
      try {
        const message = await getBotResponse(inputValue, messages);
        botResponse.id = (Date.now() + 1).toString();
        botResponse.text = message;
      } catch {
        // Sleep for 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        botResponse.text = tries 
          ? "Something went wrong. Trying again\n"
          : "Failed to process you request please try again later!"

          if (tries === 0) {
            botResponse.id = (Date.now() + 1).toString();
          }
      }

      setMessages(prev => [
        ...prev.filter(msg => msg.id !== 'typing'),
        botResponse
      ]);

      if (botResponse.id !== 'typing') break;
    }
  };

  const getBotResponse = async (userInput: string, messages: Message[]): Promise<string> => {
    const apiClient = new ApiClient();
    const resp = await apiClient.serveUserQuery(userInput, messages);
    return resp.output;
  };

  const TypingAnimation = ({text}: { text?: string }) => {
    const [dots, setDots] = useState('');
    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);
      return () => clearInterval(interval);
    }, []);
    return <span>{text ? text : "Typing"}{dots}</span>;
  };

  return (
    <>
      <ChatIcon onClick={() => setIsOpen(!isOpen)} aria-label="Chat support">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </ChatIcon>

      <ChatContainer isOpen={isOpen}>
        <MessagesContainer isOpen={isOpen}>
          {messages.map((message) => (
            message.sender === 'user' ? (
              <UserMessage key={message.id}>
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </UserMessage>
            ) : (
              <BotMessage key={message.id}>
                {message.id === 'typing' ? (
                  <TypingAnimation text={message.text} />
                ) : (
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                )}
              </BotMessage>
            )
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer isOpen={isOpen}>
          <TextInput
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
          />
          <SendButton onClick={handleSendMessage}>Send</SendButton>
        </InputContainer>
      </ChatContainer>
    </>
  );
}
