import React from 'react';
import BackButton from '../../components/BackButton';
import theme from '../../styles/theme';
import { Box } from '@mui/material';
import { createTheme, ThemeProvider, Typography, Button } from "@mui/material";

const Instructions = () => {
  return (
    <Box
      sx={{
        padding: theme.spacing(4),
        maxWidth: "800px",
        margin: "0 auto",
        textAlign: "center", 
      }}
    >
      <Box sx={{ position: "absolute", top: theme.spacing(4), left: theme.spacing(4) }}>
        <BackButton />
      </Box>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <ThemeProvider theme={theme}>
          <Typography sx={{ color: theme.palette.custom.textPurple }} variant="h7">Instructions</Typography>
        </ThemeProvider>
        <Box
          sx={{
            border: `0.3rem solid #919bd9`,
            borderRadius: theme.shape.borderRadius,
            padding: theme.spacing(1),
            textAlign: "left",
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
          }}
        >
          <h2>Practice Mode</h2>
          <p>In Practice mode, the Braille display shows a random character for you to feel. After identifying the character, say it out loud. The software will tell you if you're correct. When ready, tap the Next button to move to the next character.</p>
          <h2>Learn Mode</h2>
          <p>In Learning mode, select a character to display on the Braille display by typing or saying it out loud. If you type the character, tap the Display button to update the Braille display. Then, feel the Braille display to learn how the character feels.</p>
          <h2>Quiz Mode</h2>
          <p>Test your knowledge of Braille through Quiz Mode. Select the number of characters you'd like to test yourself on. After a quiz attempt, you can choose to either test yourself on all of the characters, or test yourself only on the characters that you got incorrect last time or haven't seen yet.</p>
        </Box>
      </div>
    </Box>
  );
}

export default Instructions;