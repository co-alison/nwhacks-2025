import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, ThemeProvider, Button } from '@mui/material';
import theme from '../../../styles/theme';
import BackButton from '../../../components/BackButton';
import { sendChar } from '../../../utils/serverApi';

const IntroductionPage = ({ module /*isCompleted, onComplete*/ }) => {
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
            {/* <button onClick={onComplete} disabled={isCompleted}>
            {isCompleted ? 'Practice Quiz Completed' : 'Submit Practice Quiz'}
        </button> */}
        </Box>
    );
};

export default IntroductionPage;
