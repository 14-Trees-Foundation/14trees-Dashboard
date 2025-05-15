// src/pages/Chatbot/Chatbot.jsx
import React from 'react';
import ChatbotV2 from '../../../components/ShipmentChatbot/ChatBotV2';

const Shipment = () => {
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Arial, sans-serif",
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      color: '#2c3e50',
      background: '#f5f7fa',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      padding: '25px',
      background: 'linear-gradient(135deg, #0f4c75, #3282b8)',
      borderRadius: '8px',
      color: 'white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    logo: {
      fontSize: '28px',
      fontWeight: '600',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
    },
    tagline: {
      color: '#e6f2ff',
      fontSize: '16px',
      lineHeight: '1.6',
      maxWidth: '700px',
      margin: '0 auto',
    },
    chatbotContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      padding: '25px',
      minHeight: '500px',
      border: '1px solid #d1dbe5',
    },
    gettingStarted: {
      backgroundColor: '#ebf5ff',
      padding: '20px',
      borderRadius: '6px',
      marginBottom: '25px',
      borderLeft: '4px solid #3282b8',
    },
    gettingStartedTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0f4c75',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    gettingStartedText: {
      color: '#4a6fa5',
      lineHeight: '1.6',
      fontSize: '15px',
    },
    exampleQueries: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '15px',
    },
    queryChip: {
      backgroundColor: '#d4e4f7',
      color: '#0f4c75',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '13px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: '1px solid #a8c6f0',
      '&:hover': {
        backgroundColor: '#bfd8f9',
      },
    },
    schemaHighlight: {
      backgroundColor: '#f0f7ff',
      padding: '15px',
      borderRadius: '6px',
      marginTop: '20px',
      border: '1px dashed #a8c6f0',
    },
    schemaTitle: {
      fontWeight: '600',
      color: '#0f4c75',
      marginBottom: '8px',
    },
  };

  const exampleQueries = [
    "Show cylinder performance for IMO 9876543",
    "What's the exhaust temp for cylinder 3 on IMO 1234567?",
    "List operating conditions for IMO 5555555",
    "What fuel type is IMO 8888888 using?",
    "Compare compression pressures across cylinders for IMO 1111111",
    "Show sulfur content for all ships using HFO",
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <span>🛥️</span>
          Marine Engine Performance Monitor
        </div>
        <p style={styles.tagline}>
          AI-powered analysis of ship engine data including cylinder performance, 
          operating conditions, and fuel/lubricant specifications from the Shipping database.
        </p>
      </header>
      
      <div style={styles.chatbotContainer}>
        <div style={styles.gettingStarted}>
          <div style={styles.gettingStartedTitle}>
            <span>⚙️</span> Engine Data Assistant
          </div>
          <p style={styles.gettingStartedText}>
            Query real-time engine performance metrics. Try these examples:
          </p>
          <div style={styles.exampleQueries}>
            {exampleQueries.map((query, index) => (
              <div key={index} style={styles.queryChip}>
                {query}
              </div>
            ))}
          </div>
          </div>
        <ChatbotV2 />
      </div>
    </div>
  );
};

export default Shipment;