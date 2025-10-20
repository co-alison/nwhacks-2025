import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent } from '@mui/material';
import PageContainer from '../../components/PageContainer';
import StyledButton from '../../components/StyledButton';
import { ArrowForward } from '@mui/icons-material';
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
        return (
            <PageContainer title="Module Not Found">
                <Card
                    sx={{
                        borderRadius: '12px',
                        backgroundColor: '#ffffff',
                        border: '2px solid #ef4444',
                    }}
                >
                    <CardContent sx={{ padding: '2rem', textAlign: 'center' }}>
                        <Typography 
                            variant="h5"
                            sx={{
                                color: '#ef4444',
                                fontSize: '1.5rem',
                                fontWeight: 600,
                            }}
                        >
                            Module not found
                        </Typography>
                    </CardContent>
                </Card>
            </PageContainer>
        );
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
                return (
                    <Card
                        sx={{
                            borderRadius: '12px',
                            backgroundColor: '#ffffff',
                            border: '2px solid #f59e0b',
                        }}
                    >
                        <CardContent sx={{ padding: '2rem', textAlign: 'center' }}>
                            <Typography 
                                variant="h6"
                                sx={{
                                    color: '#f59e0b',
                                    fontSize: '1.25rem',
                                    fontWeight: 600,
                                }}
                            >
                                Unknown module type
                            </Typography>
                        </CardContent>
                    </Card>
                );
        }
    };

    return (
        <PageContainer title={module.title}>
            <Box sx={{ maxWidth: '70rem', margin: '0 auto' }}>
                {renderPage()}
            </Box>

            {module.type !== 'practice-quiz' && module.type !== 'quiz' && nextModule && (
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        marginTop: '2rem' 
                    }}
                >
                    <StyledButton
                        onClick={() => navigate(`/modules/${nextModule.id}`)}
                        endIcon={<ArrowForward />}
                        sx={{
                            fontSize: '1.125rem',
                            minWidth: '150px',
                        }}
                    >
                        Next
                    </StyledButton>
                </Box>
            )}
        </PageContainer>
    );
};

export default ModulePage;