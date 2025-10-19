import React, { useState, useEffect, useRef } from 'react';
import characters from '../../utils/characters';
import { states } from '../../utils/constants';
import { Box, Typography, Container, Card, CardContent, LinearProgress, Chip } from '@mui/material';
import { Mic, CheckCircle, Cancel, VolumeUp, Refresh } from '@mui/icons-material';
import StyledButton from '../../components/StyledButton';
import { sendChar } from '../../utils/serverApi';
import { startListeningWithTimer } from '../../utils/speechRecognition';

const Practice = () => {
    const [currentChar, setCurrentChar] = useState('');
    const [status, setStatus] = useState(states.display);
    const [charInput, setCharInput] = useState('');
    const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);
    const recognitionRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (status === states.display) {
            const char = getRandomChar();
            console.log('char: ', char);
            setCurrentChar(char);

            // send char to API
            sendChar(char, () => {
                setStatus(states.listen);
            });
            setStatus(states.listen);
        } else if (status === states.listen) {
            startListeningWithTimer(
                timerRef,
                recognitionRef,
                setStatus,
                setCharInput,
                currentChar
            );
        } else if (status === states.correct) {
            speakText('Correct!');
        } else if (status === states.incorrect) {
            speakText(
                `Incorrect, the correct answer was: ${currentChar.toUpperCase()}`
            );
        } else if (status === states.retry) {
            speakText(
                "Sorry, we didn't catch that. Please say 'letter' before your answer, like 'letter A.'"
            );
        } else if (status === states.noInput) {
            speakText('No input received.');
        }

        return () => {};
    }, [status]);

    const getRandomChar = () => {
        const index = Math.floor(Math.random() * characters.length);
        return characters[index];
    };

    const reset = () => {
        const clear = '.';
        // sendChar(clear);
        setCurrentChar('');
        setCharInput('');
        clearTimeout(timerRef.current);
        setShowingCorrectAnswer(false);
        setStatus(states.display);
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;
        utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google US English') || null;
        speechSynthesis.speak(utterance);
    };

    const showCorrectAnswer = () => {
        speakText(`The correct answer was: ${currentChar.toUpperCase()}`);
        setShowingCorrectAnswer(true);
    };

    const getStatusConfig = () => {
        switch (status) {
            case states.display:
                return {
                    icon: <VolumeUp sx={{ fontSize: '4rem' }} />,
                    title: 'Displaying Character',
                    subtitle: 'Feel the Braille pattern on your device',
                    color: '#5e67bf',
                    bgColor: 'rgba(94, 103, 191, 0.1)',
                };
            case states.listen:
                return {
                    icon: <Mic sx={{ fontSize: '4rem' }} />,
                    title: 'Listening',
                    subtitle: 'Say "letter" followed by your answer (e.g., "letter A")',
                    color: '#5e67bf',
                    bgColor: 'rgba(94, 103, 191, 0.1)',
                    showProgress: true,
                };
            case states.correct:
                return {
                    icon: <CheckCircle sx={{ fontSize: '4rem' }} />,
                    title: 'Correct!',
                    subtitle: `You said: ${charInput.toUpperCase()}`,
                    color: '#10b981',
                    bgColor: 'rgba(16, 185, 129, 0.1)',
                };
            case states.incorrect:
                return {
                    icon: <Cancel sx={{ fontSize: '4rem' }} />,
                    title: 'Incorrect',
                    subtitle: `You said: ${charInput.toUpperCase()}`,
                    correctAnswer: currentChar.toUpperCase(),
                    color: '#ef4444',
                    bgColor: 'rgba(239, 68, 68, 0.1)',
                };
            case states.noInput:
                return {
                    icon: <Cancel sx={{ fontSize: '4rem' }} />,
                    title: 'No Input Received',
                    subtitle: 'We didn\'t hear a response',
                    color: '#f59e0b',
                    bgColor: 'rgba(245, 158, 11, 0.1)',
                };
            case states.retry:
                return {
                    icon: <Refresh sx={{ fontSize: '4rem' }} />,
                    title: 'We Didn\'t Catch That',
                    subtitle: `Please say "letter" before your answer (e.g., "letter A")`,
                    color: '#f59e0b',
                    bgColor: 'rgba(245, 158, 11, 0.1)',
                };
            default:
                return {};
        }
    };

    const statusConfig = getStatusConfig();

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 70px)',
                background: 'linear-gradient(135deg, #f8f9fc 0%, #e8ecf7 100%)',
                paddingBottom: '4rem',
            }}
        >
            <Container maxWidth="md">
                <Box
                    component="main"
                    role="main"
                    sx={{
                        paddingTop: '2rem',
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '3rem',
                        }}
                    >
                        <Typography
                            variant='h4'
                            component="h1"
                            sx={{
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                fontWeight: 700,
                                color: '#1a1a1a',
                                textAlign: 'center',
                                flex: 1,
                            }}
                        >
                            Practice Braille
                        </Typography>
                    </Box>

                    {/* Main Card */}
                    <Card
                        sx={{
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            border: '2px solid #e2e8f0',
                            overflow: 'visible',
                        }}
                    >
                        <CardContent
                            sx={{
                                padding: { xs: '2rem', md: '3rem' },
                                textAlign: 'center',
                            }}
                        >
                            {/* Status Icon */}
                            <Box
                                sx={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    background: statusConfig.bgColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 2rem',
                                    color: statusConfig.color,
                                    animation: status === states.listen ? 'pulse 2s ease-in-out infinite' : 'none',
                                    '@keyframes pulse': {
                                        '0%, 100%': {
                                            opacity: 1,
                                            transform: 'scale(1)',
                                        },
                                        '50%': {
                                            opacity: 0.8,
                                            transform: 'scale(1.05)',
                                        },
                                    },
                                }}
                                aria-hidden="true"
                            >
                                {statusConfig.icon}
                            </Box>

                            {/* Status Title */}
                            <Typography
                                variant="h5"
                                component="h2"
                                sx={{
                                    fontSize: { xs: '1.75rem', md: '2rem' },
                                    fontWeight: 600,
                                    color: '#1a1a1a',
                                    marginBottom: '1rem',
                                }}
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                {statusConfig.title}
                            </Typography>

                            {/* Status Subtitle */}
                            <Typography
                                variant="body1"
                                component="p"
                                sx={{
                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                    color: '#4a5568',
                                    marginBottom: '1.5rem',
                                    lineHeight: 1.6,
                                }}
                            >
                                {statusConfig.subtitle}
                            </Typography>

                            {/* Correct Answer Display */}
                            {statusConfig.correctAnswer && (
                                <Chip
                                    label={`Correct Answer: ${statusConfig.correctAnswer}`}
                                    sx={{
                                        fontSize: '1.125rem',
                                        padding: '1.5rem 1rem',
                                        height: 'auto',
                                        backgroundColor: '#10b98115',
                                        color: '#059669',
                                        fontWeight: 600,
                                        marginBottom: '1.5rem',
                                        border: '2px solid #10b981',
                                    }}
                                />
                            )}

                            {/* Showing Correct Answer for No Input */}
                            {status === states.noInput && showingCorrectAnswer && (
                                <Chip
                                    label={`Correct Answer: ${currentChar.toUpperCase()}`}
                                    sx={{
                                        fontSize: '1.125rem',
                                        padding: '1.5rem 1rem',
                                        height: 'auto',
                                        backgroundColor: '#10b98115',
                                        color: '#059669',
                                        fontWeight: 600,
                                        marginBottom: '1.5rem',
                                        border: '2px solid #10b981',
                                    }}
                                />
                            )}

                            {/* Progress Bar for Listening */}
                            {statusConfig.showProgress && (
                                <Box sx={{ width: '100%', marginTop: '2rem' }}>
                                    <LinearProgress
                                        sx={{
                                            height: '8px',
                                            borderRadius: '4px',
                                            backgroundColor: '#e2e8f0',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: statusConfig.color,
                                            },
                                        }}
                                    />
                                </Box>
                            )}

                            {/* Action Buttons */}
                            <Box
                                sx={{
                                    marginTop: '2.5rem',
                                    display: 'flex',
                                    gap: '1rem',
                                    justifyContent: 'center',
                                    flexWrap: 'wrap',
                                }}
                            >
                                {status === states.correct && (
                                    <StyledButton 
                                        onClick={reset}
                                        sx={{
                                            minWidth: '150px',
                                            fontSize: '1.125rem',
                                        }}
                                    >
                                        Next Character
                                    </StyledButton>
                                )}

                                {status === states.incorrect && (
                                    <StyledButton 
                                        onClick={reset}
                                        sx={{
                                            minWidth: '150px',
                                            fontSize: '1.125rem',
                                        }}
                                    >
                                        Next Character
                                    </StyledButton>
                                )}

                                {status === states.noInput && (
                                    <>
                                        <StyledButton 
                                            onClick={showCorrectAnswer}
                                            sx={{
                                                minWidth: '180px',
                                                fontSize: '1.125rem',
                                            }}
                                        >
                                            Show Answer
                                        </StyledButton>
                                        <StyledButton 
                                            onClick={reset}
                                            sx={{
                                                minWidth: '150px',
                                                fontSize: '1.125rem',
                                            }}
                                        >
                                            Next Character
                                        </StyledButton>
                                    </>
                                )}

                                {status === states.retry && (
                                    <StyledButton 
                                        onClick={() => setStatus(states.listen)}
                                        sx={{
                                            minWidth: '150px',
                                            fontSize: '1.125rem',
                                        }}
                                    >
                                        Try Again
                                    </StyledButton>
                                )}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Instructions Card */}
                    <Card
                        sx={{
                            marginTop: '2rem',
                            borderRadius: '12px',
                            backgroundColor: '#ffffff',
                            border: '2px solid #e2e8f0',
                        }}
                    >
                        <CardContent sx={{ padding: '1.5rem' }}>
                            <Typography
                                variant="h6"
                                component="h3"
                                sx={{
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    color: '#1a1a1a',
                                    marginBottom: '0.75rem',
                                }}
                            >
                                How to Practice
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
                                1. Feel the Braille character displayed on your device<br />
                                2. When you hear "Listening", say "letter" followed by your answer<br />
                                3. Get instant feedback on your response<br />
                                4. Continue to the next character to keep practicing
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
};

export default Practice;
