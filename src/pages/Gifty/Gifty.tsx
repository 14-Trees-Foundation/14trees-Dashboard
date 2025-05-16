import React, { useState } from "react";
import ChatbotV2 from "../../components/Chatbot/ChatBotV2";
import DynamicTable from "../../components/dynamic/Table";
import GiftFormDetails from "./components/GiftFormDetails";
import { Box, Typography, Paper } from "@mui/material";

export const Gifty: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [data, setData] = useState<any>(null);

  const onHtmlLoad = (htmlStr: string) => {
    setHtmlContent(htmlStr);
  };

  const onDataLoad = (data: string) => {
    setData(data);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header Section - Centered */}
      <Paper
        elevation={1}
        sx={{
          py: 1,
          px: 3,
          backgroundColor: "#f9f9f9",
          borderRadius: 0,
          width: "100%",
          boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
          Gift Request Summary
        </Typography>
      </Paper>

      {/* Main content */}
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        {data && Array.isArray(data) && (
          <Paper elevation={2} sx={{ padding: "20px", marginBottom: "20px" }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Recipient Data Table
            </Typography>
            <DynamicTable data={data} />
          </Paper>
        )}

        {data && !Array.isArray(data) && (
          <Paper elevation={2} sx={{ padding: "20px", marginBottom: "20px" }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Gift Details
            </Typography>
            <GiftFormDetails data={data} />
          </Paper>
        )}

        <Paper elevation={2} sx={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Gift Assistant
          </Typography>
          <ChatbotV2 onHtmlLoad={onHtmlLoad} onDataLoad={onDataLoad} />
        </Paper>

        {htmlContent && (
          <Paper elevation={2} sx={{ padding: "20px", marginBottom: "20px" }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Generated Content
            </Typography>
            <Box
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              sx={{
                maxWidth: "100%",
                overflow: "auto",
                padding: "10px",
                border: "1px solid #eee",
                borderRadius: "4px",
              }}
            />
          </Paper>
        )}
      </Box>
    </Box>
  );
};