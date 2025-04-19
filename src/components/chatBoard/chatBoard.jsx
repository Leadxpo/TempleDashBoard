import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, TextField, IconButton, Avatar, Paper,  MenuItem, Menu } from "@mui/material";
import {  Send, Close, Language, Mic } from "@mui/icons-material";
import axios from "axios";

export default function ChatBot({ onClose }) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [suggestions, setSuggestions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (message.trim()) {
      fetchSuggestions(message);
    } else {
      setSuggestions([]);
    }
  }, [message]);

  const fetchSuggestions = async (input) => {
    try {
      const response = await axios.get("https://temple.signaturecutz.in/web/chat/get-Suggestions", { params: { query: input } });
      setSuggestions(response.data?.suggestions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setChatHistory([...chatHistory, { sender: "user", message }]);
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("https://temple.signaturecutz.in/web/chat/get-Answer-by-Question", { Questions: message, language });
      const botMessage = response.data?.data?.data?.Answers || "Sorry, I didn't get that. Can you try again?";
      setChatHistory((prevChatHistory) => [...prevChatHistory, { sender: "bot", message: botMessage }]);
    } catch (error) {
      console.error("Error calling API:", error);
      setChatHistory((prevChatHistory) => [...prevChatHistory, { sender: "bot", message: "Something went wrong. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (selectedLanguage) => {
    if (selectedLanguage) {
      setLanguage(selectedLanguage);
    }
    setAnchorEl(null);
  };

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#f0f8ff" }}>
      <AppBar position="static" sx={{ backgroundColor: "#0b4f85" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            {/* <Home /> */}
          </IconButton>
          <Avatar src="/path-to-avatar.png" alt="Disha" sx={{ marginRight: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Ask Me <Typography component="span" sx={{ fontSize: 12, marginLeft: 1 }}>2.0</Typography></Typography>
          <IconButton onClick={onClose} color="inherit">
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, padding: 1, overflowY: "auto" }}>
        {chatHistory.map((msg, index) => (
          <Box key={index} sx={{ display: "flex", marginBottom: 2, alignSelf: msg.sender === "user" ? "flex-end" : "flex-start" }}>
            <Avatar src={msg.sender === "user" ? "/path-to-avatar.png" : "/path-to-avatar.png"} alt={msg.sender} sx={{ marginRight: 1 }} />
            <Paper sx={{ padding: 2, backgroundColor: msg.sender === "user" ? "#0b4f85" : "#e9f5ff", color: msg.sender === "user" ? "#fff" : "inherit", borderRadius: 3 }}>
              <Typography>{msg.message}</Typography>
            </Paper>
          </Box>
        ))}
        {loading && <Typography align="center">Loading...</Typography>}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", padding: 1, borderTop: "1px solid #ccc" }}>
        <IconButton onClick={handleClick}>
          <Language sx={{ color: "#0b4f85", fontSize: 35 }} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleClose(null)}>
          <MenuItem onClick={() => handleClose("en")}>English</MenuItem>
          <MenuItem onClick={() => handleClose("hi")}>Hindi</MenuItem>
          <MenuItem onClick={() => handleClose("es")}>Telugu</MenuItem>
        </Menu>

        <TextField
          fullWidth
          placeholder="Type here to chat..."
          variant="outlined"
          size="small"
          sx={{ backgroundColor: "#fff", borderRadius: 3 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <IconButton>
          <Mic sx={{ color: "#0b4f85", fontSize: 35 }} />
        </IconButton>
        <IconButton onClick={handleSendMessage}>
          <Send sx={{ color: "#0b4f85", fontSize: 35 }} />
        </IconButton>
      </Box>
       {suggestions.length > 0 && (
              <Box sx={{ backgroundColor: "#ffffff", borderTop: "1px solid #ccc", padding: 1 ,overflowX: "auto", maxHeight: "100px" }}>
                {suggestions.map((suggestion, index) => (
                  <Typography key={index} sx={{ cursor: "pointer", padding: 1 }} onClick={() => setMessage(suggestion)}>
                    {suggestion}
                  </Typography>
                ))}
              </Box>
            )}
    </Box>
  );
}
