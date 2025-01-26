import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, ThemeProvider, Button } from '@mui/material';
import theme from '../../styles/theme';
import BackButton from '../../components/BackButton';

// Individual page type components
const IntroductionPage = ({
    module /*isCompleted, onComplete*/,
    // charsCovered,
    // charsReviewed,
    // charDescription,
}) => {
    const reviews = module.charsReviewed
        ? ` and reviews characters ${module.charsReviewed}`
        : '';
    const moduleNumber = module.id[0];
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

const LearnPage = ({
    module /*isCompleted, onComplete*/,
    // char,
    // representation,
}) => {
    return (
        <Box>
            <Typography variant='p'>
                On this page, you will learn the character {module.char}, which
                is represented with {module.representation}. Place your finger
                over the braille display to feel the character appear and
                reappear. When you’re ready to proceed, tap the “Next” button.
            </Typography>
            {/* <button onClick={onComplete} disabled={isCompleted}>
            {isCompleted ? 'Completed' : 'Mark as Complete'}
        </button> */}
        </Box>
    );
};

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

const ModulePage = ({ modules /*completedModules, markComplete*/ }) => {
    const { moduleId } = useParams(); // get module id from parameters
    const navigate = useNavigate();

    // Find the current module and determine the next module
    const currentIndex = modules.findIndex((mod) => mod.id === moduleId);
    const nextModule = modules[currentIndex + 1] || null; // Get the next module, or null if none

    const module = modules[currentIndex];

    if (!module) {
        return <div>Module not found</div>;
    }

    // const isCompleted = completedModules[moduleId] || false;

    // Render the appropriate page type
    const renderPage = () => {
        switch (module.type) {
            case 'introduction':
                return (
                    <IntroductionPage
                        module={module}
                        // isCompleted={isCompleted}
                        // onComplete={() => markComplete(moduleId)}
                    />
                );
            case 'learn':
                return (
                    <LearnPage
                        module={module}
                        // isCompleted={isCompleted}
                        // onComplete={() => markComplete(moduleId)}
                    />
                );
            case 'practice-quiz':
                return (
                    <PracticeQuizPage
                        module={module}
                        // isCompleted={isCompleted}
                        // onComplete={() => markComplete(moduleId)}
                    />
                );
            case 'quiz':
                return (
                    <QuizPage
                        module={module}
                        // isCompleted={isCompleted}
                        // onComplete={() => markComplete(moduleId)}
                    />
                );
            default:
                return <div>Unknown module type</div>;
        }
    };

    return (
        <div>
            <Box
                sx={{
                    position: 'absolute',
                    top: theme.spacing(4),
                    left: theme.spacing(4),
                }}
            >
                <BackButton />
            </Box>
            <Typography variant='h2'>{module.title}</Typography>
            {renderPage()}
            <Button
                onClick={() => navigate(`/modules/${nextModule.id}`)}
                disabled={!nextModule}
            >
                Next
            </Button>
        </div>
    );
};

export default ModulePage;
