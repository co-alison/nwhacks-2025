import React from 'react';
import { Box, Typography, ThemeProvider } from '@mui/material';
import theme from '../../../styles/theme';

const IntroductionPage = ({ module }) => {
    const reviews = module.charsReviewed
        ? ` and reviews characters ${module.charsReviewed}`
        : '';
    var description = `This module covers the characters ${module.charsCovered}${reviews}.`;

    return (
        <Box>
            <ThemeProvider theme={theme}>
                <Typography variant='p' sx={{ fontSize: '1.5rem' }}>{description}{" "}</Typography>
                <Typography variant='p' sx={{ fontSize: '1.5rem' }}>{module.charDescription}</Typography>
                <Typography vairant='p' sx={{ fontSize: '1.5rem' }}>
                    When you’re ready to proceed, tap the “Next” button.
                </Typography>
            </ThemeProvider>

        </Box>
    );
};

export default IntroductionPage;
