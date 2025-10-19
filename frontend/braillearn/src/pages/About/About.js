import React from 'react';
import BackButton from '../../components/BackButton';
import theme from '../../styles/theme';
import { Box } from '@mui/material';
import { ThemeProvider, Typography } from "@mui/material";

const About = () => {
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
          <Typography sx={{ color: theme.palette.custom.textPurple }} variant="h7">What is Braillearn?</Typography>
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
          <h2>Braillearn is created by:</h2>
          <ul>
            <li>Allison Co</li>
            <li>Cindy Cui</li>
            <li>Mayank Rastogi</li>
            <li>Tammy Kim</li>
          </ul>
          <h2>Motivation</h2>
          <p>Braille is a universal system available in every language.
            However, only 10% of blind individuals are Braille literate, while 90% of employed blind people are proficient in Braille.
            Among adults who don't know Braille, only one in three is employed.
            Proficiency in Braille is crucial for visually impaired children to compete with their sighted peers academically and succeed in the workforce. Braillearn aims to make learning Braille immersive and accessible, enabling more visually impaired individuals to learn Braille anytime, anywhere, improving communication and employability.
          </p>
        </Box>
      </div>
    </Box>
  );
};

export default About;