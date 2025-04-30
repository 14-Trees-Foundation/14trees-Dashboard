// src/pages/Chatbot/Chatbot.jsx
import React from 'react';
import ChatbotV2 from '../../components/Chatbot/ChatBotV2';

const Chatbot = () => {
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Arial, sans-serif",
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      color: '#2c3e50',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    logo: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#2563eb',
      marginBottom: '8px',
      letterSpacing: '0.5px',
    },
    tagline: {
      color: '#4b5563',
      fontSize: '16px',
      marginBottom: '30px',
      lineHeight: '1.5',
    },
    chatbotContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '25px',
      minHeight: '500px',
      border: '1px solid #e5e7eb',
    },
    gettingStarted: {
      backgroundColor: '#f8fafc',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '25px',
      borderLeft: '4px solid #2563eb',
    },
    gettingStartedTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '12px',
    },
    gettingStartedText: {
      color: '#475569',
      lineHeight: '1.6',
      fontSize: '15px',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>LightHouse Supplier Portal</div>
        <p style={styles.tagline}>
          AI-powered supplier management system. 
          Start a conversation below to onboard suppliers or manage existing relationships.
        </p>
      </header>
      
      <div style={styles.chatbotContainer}>
        <div style={styles.gettingStarted}>
          <div style={styles.gettingStartedTitle}>Getting Started</div>
          <p style={styles.gettingStartedText}>
            Type your request in natural language or try:
            "Create a new supplier" • "Find supplier ABC123" • "Show active suppliers"
          </p>
        </div>
        <ChatbotV2 />
      </div>
    </div>
  );
};

export default Chatbot;