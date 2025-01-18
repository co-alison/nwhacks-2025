import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, Typography } from "@mui/material";

const theme = createTheme({
  typography: {
    h7: {
      fontSize: "3rem",
      fontWeight: 500,
      fontFamily: "sans-serif",
      fontStyle: "bold",
    },
  },
  palette: {
    custom: {
      textBlue: "#1e88e5",
    },
  },
});

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
    <div className="Home">
      <header className="Home-header">
        <ThemeProvider theme={theme}>
          <Typography sx={{ color: theme.palette.custom.textBlue }} variant="h7">
            Braillearn
          </Typography>
        </ThemeProvider>
        <div className="description-box">
          <p>
            Welcome to Braillearn, your interactive platform for learning and practicing Braille! More description to be added.
          </p>
        </div>
        <div className="mode-selector">
          <label htmlFor="mode">Choose Mode: </label>
          <select id="mode" name="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="practice">Practice</option>
            <option value="learn">Learn</option>
          </select>
        </div>
        <div className="start-button">
          <button onClick={handleStart}>Start</button>
        </div>
      </header>
    </div>
  );
}

export default Home;