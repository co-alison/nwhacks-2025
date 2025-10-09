import React from 'react';
import { Box, Typography } from '@mui/material';

const QuizPage = ({ module }) => (
    <Box>
        <Typography variant='p' sx={{ fontSize: '1.5rem' }}>
            This quiz covers the characters {module.chars} and contains{' '}
            {module.questionCount} questions. To pass this quiz and continue,
            you must achieve a score of at least {module.passingPercentage}%.
            Tap "Start" to begin.
        </Typography>
    </Box>
);

export default QuizPage;
