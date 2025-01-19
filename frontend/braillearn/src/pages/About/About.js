import React from 'react';
import BackButton from '../../components/BackButton';
import theme from '../../styles/theme';
import { Box } from '@mui/material';

const About = () => {
  return (
    <Box
      sx={{
        padding: theme.spacing(4),
        maxWidth: "800px",
        margin: "0 auto",
        textAlign: "center", // Center align content like Home page.
      }}
    >
      {/* Back button positioned at top left */}
      <Box sx={{ position: "absolute", top: theme.spacing(4), left: theme.spacing(4) }}>
        <BackButton />
      </Box>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1>About</h1>
        <h2>Meet Braillearn's Developers</h2>
        <p>Name, Name, Name, Name</p>
        <h2>Motivation</h2>
        <p>About page.</p>
      </div>
    </Box>
  );
};

export default About;