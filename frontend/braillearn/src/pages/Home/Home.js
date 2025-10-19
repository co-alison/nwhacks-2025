import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeProvider, Container, Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { Visibility, Edit, QuestionAnswer, MenuBook } from '@mui/icons-material';
import theme from '../../styles/theme';
import BraillearnLogo from '../../braillearn_title.svg';

function Home() {
    const modeCards = [
        {
            title: 'Display',
            description: 'View and explore Braille characters with visual and audio feedback',
            icon: <Visibility sx={{ fontSize: '3rem' }} />,
            path: '/display',
            color: '#5e67bf',
        },
        {
            title: 'Practice',
            description: 'Practice reading and identifying Braille characters interactively',
            icon: <Edit sx={{ fontSize: '3rem' }} />,
            path: '/practice',
            color: '#6b7fd7',
        },
        {
            title: 'Quiz',
            description: 'Test your knowledge with randomized Braille character quizzes',
            icon: <QuestionAnswer sx={{ fontSize: '3rem' }} />,
            path: '/quiz',
            color: '#7997e3',
        },
        {
            title: 'Modules',
            description: 'Follow structured learning paths with guided lessons and assessments',
            icon: <MenuBook sx={{ fontSize: '3rem' }} />,
            path: '/modules',
            color: '#8ec6f7',
        },
    ];

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    minHeight: 'calc(100vh - 70px)',
                    background: 'linear-gradient(135deg, #f8f9fc 0%, #e8ecf7 100%)',
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        component="main"
                        role="main"
                        sx={{
                            paddingTop: '4rem',
                            paddingBottom: '4rem',
                        }}
                    >
                        {/* Hero Section */}
                        <Box
                            sx={{
                                textAlign: 'center',
                                marginBottom: '4rem',
                            }}
                        >
                            <img
                                src={BraillearnLogo}
                                alt='Braillearn - Interactive Braille Learning Platform'
                                style={{ 
                                    width: '100%',
                                    maxWidth: '400px',
                                    height: 'auto',
                                    marginBottom: '2rem',
                                }} 
                            />
                            <Typography
                                variant="h1"
                                component="h1"
                                sx={{
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                    fontWeight: 700,
                                    color: '#1a1a1a',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                Welcome to Braillearn
                            </Typography>
                            <Typography
                                variant="body1"
                                component="p"
                                sx={{
                                    fontSize: { xs: '1.125rem', md: '1.25rem' },
                                    color: '#4a5568',
                                    maxWidth: '700px',
                                    margin: '0 auto',
                                    lineHeight: 1.8,
                                    marginBottom: '1rem',
                                }}
                            >
                                An accessible, interactive platform designed to help you learn 
                                and master Braille through engaging exercises and structured lessons.
                            </Typography>
                            <Typography
                                variant="body2"
                                component="p"
                                sx={{
                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                    color: '#718096',
                                    fontWeight: 500,
                                }}
                                aria-live="polite"
                            >
                                Choose a learning mode below to begin your journey
                            </Typography>
                        </Box>

                        {/* Mode Cards */}
                        <Grid 
                            container 
                            spacing={3}
                            role="list"
                            aria-label="Learning modes"
                        >
                            {modeCards.map((mode, index) => (
                                <Grid 
                                    item 
                                    xs={12} 
                                    sm={6} 
                                    md={3} 
                                    key={mode.path}
                                    role="listitem"
                                >
                                    <Card
                                        component={Link}
                                        to={mode.path}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            textDecoration: 'none',
                                            transition: 'all 0.3s ease',
                                            border: '2px solid transparent',
                                            borderRadius: '12px',
                                            backgroundColor: '#ffffff',
                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 12px 24px rgba(94, 103, 191, 0.15)',
                                                borderColor: mode.color,
                                            },
                                            '&:focus': {
                                                outline: `3px solid ${mode.color}`,
                                                outlineOffset: '2px',
                                            },
                                            '&:focus:not(:focus-visible)': {
                                                outline: 'none',
                                            },
                                            '&:focus-visible': {
                                                outline: `3px solid ${mode.color}`,
                                                outlineOffset: '2px',
                                            },
                                        }}
                                        tabIndex={0}
                                        role="link"
                                        aria-label={`${mode.title}: ${mode.description}`}
                                    >
                                        <CardContent
                                            sx={{
                                                padding: '2rem',
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '50%',
                                                    background: `linear-gradient(135deg, ${mode.color}15 0%, ${mode.color}30 100%)`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginBottom: '1.5rem',
                                                    color: mode.color,
                                                }}
                                                aria-hidden="true"
                                            >
                                                {mode.icon}
                                            </Box>
                                            <Typography
                                                variant="h5"
                                                component="h2"
                                                sx={{
                                                    fontSize: '1.5rem',
                                                    fontWeight: 600,
                                                    color: '#1a1a1a',
                                                    marginBottom: '0.75rem',
                                                }}
                                            >
                                                {mode.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                component="p"
                                                sx={{
                                                    fontSize: '1rem',
                                                    color: '#4a5568',
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {mode.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Accessibility Notice */}
                        <Box
                            sx={{
                                marginTop: '4rem',
                                padding: '2rem',
                                backgroundColor: '#ffffff',
                                borderRadius: '12px',
                                border: '2px solid #e2e8f0',
                                textAlign: 'center',
                            }}
                            role="complementary"
                            aria-label="Accessibility information"
                        >
                            <Typography
                                variant="h6"
                                component="h2"
                                sx={{
                                    fontSize: '1.25rem',
                                    fontWeight: 600,
                                    color: '#1a1a1a',
                                    marginBottom: '1rem',
                                }}
                            >
                                Accessibility Features
                            </Typography>
                            <Typography
                                variant="body1"
                                component="p"
                                sx={{
                                    fontSize: '1rem',
                                    color: '#4a5568',
                                    lineHeight: 1.7,
                                    maxWidth: '800px',
                                    margin: '0 auto',
                                }}
                            >
                                Braillearn is designed with accessibility in mind. Navigate using keyboard 
                                (Tab, Enter, Arrow keys), enjoy full screen reader support, and benefit from 
                                high contrast ratios throughout the application. Audio feedback is available 
                                for all Braille characters.
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default Home;
