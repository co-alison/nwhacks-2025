import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import theme from '../../styles/theme';
import BackButton from '../../components/BackButton';
import LearnPage from './module_pages/LearnPage';
import IntroductionPage from './module_pages/IntroductionPage';
import PracticeQuizPage from './module_pages/PracticeQuizPage';
import QuizPage from './module_pages/QuizPage';
import ModuleOverviewPage from './module_pages/ModuleOverviewPage';

const ModulePage = ({ modules }) => {
    const { moduleId } = useParams();
    const navigate = useNavigate();

    const currentIndex = modules.findIndex((mod) => mod.id === moduleId);
    const nextModule = modules[currentIndex + 1] || null;
    const module = modules[currentIndex];

    if (!module) {
        return <Typography variant="h5">Module not found</Typography>;
    }

    const renderPage = () => {
        switch (module.type) {
            case 'overview':
                return <ModuleOverviewPage />;
            case 'introduction':
                return <IntroductionPage module={module} />;
            case 'learn':
                return <LearnPage module={module} />;
            case 'practice-quiz':
                return <PracticeQuizPage module={module} nextModule={nextModule} />;
            case 'quiz':
                return <QuizPage module={module} nextModule={nextModule} />;
            default:
                return <Typography variant="h6">Unknown module type</Typography>;
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center',
                paddingTop: theme.spacing(8),
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: theme.spacing(4),
                    left: theme.spacing(4),
                }}
            >
                <BackButton />
            </Box>

            <Typography variant="h2" sx={{ fontSize: '3rem', marginBottom: theme.spacing(2) }}>
                {module.title}
            </Typography>

            <Box sx={{ width: '100%', maxWidth: '70rem', padding: theme.spacing(2) }}>
                {renderPage()}
            </Box>

            {module.type !== 'practice-quiz' && module.type !== 'quiz' && (
                <Button
                    variant="outlined"
                    sx={{
                        fontSize: '1.8rem',
                        color: theme.palette.custom.buttonBackground,
                        padding: '1rem',
                        width: '8rem',
                        height: '3.5rem',
                    }}
                    onClick={() => navigate(`/modules/${nextModule.id}`)}
                    disabled={!nextModule}
                >
                    Next
                </Button>
            )}
        </Box>
    );
};

export default ModulePage;