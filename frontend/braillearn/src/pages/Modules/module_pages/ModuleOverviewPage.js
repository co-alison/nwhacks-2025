import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, ThemeProvider, Button } from '@mui/material';
import theme from '../../../styles/theme';
import BackButton from '../../../components/BackButton';
import { sendChar } from '../../../utils/serverApi';

const ModuleOverviewPage = ({ module /*isCompleted, onComplete*/ }) => {
    return (
        <Box>
            <ThemeProvider theme={theme}>
                <Typography variant='p'>Intro</Typography>
            </ThemeProvider>
            {/* <button onClick={onComplete} disabled={isCompleted}>
            {isCompleted ? 'Practice Quiz Completed' : 'Submit Practice Quiz'}
        </button> */}
        </Box>
    );
};

export default ModuleOverviewPage;
