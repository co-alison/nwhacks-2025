import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, ThemeProvider, Button } from '@mui/material';
import theme from '../../../styles/theme';
import BackButton from '../../../components/BackButton';
import { sendChar } from '../../../utils/serverApi';

const PracticeQuizPage = ({ module /*isCompleted, onComplete*/ }) => (
    <Box>
        <Typography variant='p'>
            You will now take a practice quiz on the characters {module.chars}.
            The braille display will show a character. Guess what the character
            is by speaking your answer into the microphone. The “Next” button
            will appear when you get each character correct 3 times. Tap "Start"
            to begin.
        </Typography>
        {/* <button onClick={onComplete} disabled={isCompleted}>
            {isCompleted ? 'Practice Quiz Completed' : 'Submit Practice Quiz'}
        </button> */}
    </Box>
);

export default PracticeQuizPage;
