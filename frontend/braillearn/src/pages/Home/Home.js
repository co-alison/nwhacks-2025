import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, Typography, Button } from "@mui/material";
import theme from '../../styles/theme';

function Home() {
  const [mode, setMode] = useState('practice');
  const navigate = useNavigate();

  const handleStart = () => {
    if (mode === 'learn') {
      navigate('/learn');
    } else if (mode === 'practice') {
      navigate('/practice');
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <header style={{ marginTop: "10rem", marginBottom: "2rem" }}>
        <ThemeProvider theme={theme}>
          <Typography sx={{ color: theme.palette.custom.textPurple }} variant="h7">Braillearn</Typography>
        </ThemeProvider>
        <div style={{ fontSize: "1.5rem", margin: "2rem 0", fontFamily: "Roboto, sans-serif" }}>
          <p>
            Welcome to Braillearn, an interactive platform for learning and practicing Braille.
          </p>
        </div>
        <div style={{ marginBottom: "2rem" }}>
          <label htmlFor="mode" style={{ fontSize: "1.5rem", marginRight: "1rem" }}>Choose Mode: </label>
          <select
            id="mode"
            name="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{ fontSize: "1.2rem", padding: "0.5rem" }}
          >
            <option value="practice">Practice</option>
            <option value="learn">Learn</option>
          </select>
        </div>
        <div>
          <Button
            onClick={handleStart}
            variant="outlined"
            sx={{
              fontSize: "1.5rem",
              color: theme.palette.custom.buttonBackground,
              padding: "1rem",
              width: "6rem",
              height: "3rem"
            }}
          >
            Start
          </Button>
        </div>
      </header>
    </div>
  );
}

export default Home;