import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, ThemeProvider, Button } from '@mui/material';
import theme from '../../styles/theme';
import BackButton from '../../components/BackButton';
import { sendChar } from '../../utils/serverApi';
import LearnPage from './module_pages/LearnPage';
import IntroductionPage from './module_pages/IntroductionPage';
import PracticeQuizPage from './module_pages/PracticeQuizPage';
import QuizPage from './module_pages/QuizPage';

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
                        nextModule={nextModule}
                        // isCompleted={isCompleted}
                        // onComplete={() => markComplete(moduleId)}
                    />
                );
            case 'quiz':
                return (
                    <QuizPage
                        module={module}
                        nextModule={nextModule}
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
            {module.type === 'introduction' || module.type == 'learn' ? (
                // Practice Quiz and Quiz are responsible for displaying their own Next button
                <Button
                    onClick={() => navigate(`/modules/${nextModule.id}`)}
                    disabled={!nextModule}
                >
                    Next
                </Button>
            ) : null}
        </div>
    );
};

export default ModulePage;
