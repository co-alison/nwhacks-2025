import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, ThemeProvider, Button } from '@mui/material';
import theme from '../../../styles/theme';
import BackButton from '../../../components/BackButton';
import { sendChar } from '../../../utils/serverApi';

const QuizPage = ({ module /*isCompleted, onComplete*/ }) => (
    <Box>
        <Typography variant='p'>
            This quiz covers the characters {module.chars} and contains{' '}
            {module.questionCount} questions. To pass this quiz and continue,
            you must achieve a score of at least {module.passingPercentage}%.
            Tap "Start" to begin.
        </Typography>
        {/* <button onClick={onComplete} disabled={isCompleted}>
            {isCompleted ? 'Quiz Completed' : 'Submit Quiz'}
        </button> */}
    </Box>
);

export default QuizPage;
