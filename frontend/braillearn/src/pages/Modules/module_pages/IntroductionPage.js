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
                <Typography variant='p'>{description}</Typography>
                <Typography>{module.charDescription}</Typography>
                <Typography>
                    This module contains Learn pages and Practice Quiz pages.
                </Typography>
                <Typography>
                    On each Learn page, the character being taught will
                    repeatedly appear and disappear on the braille display. Stay
                    on each Learn page as long as you need to become familiar
                    with the character.
                </Typography>
                <Typography>
                    Every few characters or so, there will be a Practice Quiz
                    page. Practice Quiz instructions will be provided upon
                    reaching the page.
                </Typography>
                <Typography>
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
