import React, { useState, useEffect, useRef } from 'react';
import characters from '../../utils/characters';
import { states } from '../../utils/constants';
import {
    Box,
    TextField,
    Card,
    CardContent,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import { Keyboard, Mic } from '@mui/icons-material';
import theme from '../../styles/theme';
import StyledButton from '../../components/StyledButton';
import PageContainer from '../../components/PageContainer';
import StatusCard from '../../components/StatusCard';
import InstructionCard from '../../components/InstructionCard';
import { useStatusConfig } from '../../hooks/useStatusConfig';
import { sendChar } from '../../utils/serverApi';
import { startListeningWithTimer } from '../../utils/speechRecognition';

const Practice = () => {
    const [currentChar, setCurrentChar] = useState('');
    const [status, setStatus] = useState(null);
    const [charInput, setCharInput] = useState('');
    const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);
    const [mode, setMode] = useState('text');
    const [textInput, setTextInput] = useState('');
    const [error, setError] = useState(false);
    const recognitionRef = useRef(null);
    const timerRef = useRef(null);

    const voice =
    speechSynthesis
      .getVoices()
      .find((voice) => voice.name === "Google US English") || null;

    // Clear dots when component unmounts (leaving page)
    useEffect(() => {
        return () => {
            sendChar('.');
        };
    }, []);

    useEffect(() => {
        if (status === states.display && mode === 'text') {
            const char = getRandomChar();
            console.log('char: ', char);
            setCurrentChar(char);
            // send char to API
            sendChar(char);
        } else if (status === states.display && mode === 'speech') {
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
                currentChar,
                'letter'
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
    }, [status, mode]);

    const getRandomChar = () => {
        const index = Math.floor(Math.random() * characters.length);
        return characters[index];
    };

    const handleModeChange = (event, newMode) => {
        if (newMode !== null) {
            setMode(newMode);
            setError(false);
            setTextInput('');
            setCharInput('');
            setShowingCorrectAnswer(false);
            setCurrentChar('');
            setStatus(null);
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
            clearTimeout(timerRef.current);
        }
    };

    const startPractice = () => {
        setStatus(states.display);
    };

    const handleTextChange = (e) => {
        setTextInput(e.target.value);
        setError(false);
    };

    const submitTextAnswer = () => {
        if (textInput.length === 1) {
            setError(false);
            setCharInput(textInput.toLowerCase());
            if (textInput.toLowerCase() === currentChar.toLowerCase()) {
                setStatus(states.correct);
            } else {
                setStatus(states.incorrect);
            }
            setTextInput('');
        } else {
            setError(true);
        }
    };

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            submitTextAnswer();
        }
    };

    const reset = () => {
        const clear = '.';
        // sendChar(clear);
        setCurrentChar('');
        setCharInput('');
        setTextInput('');
        clearTimeout(timerRef.current);
        setShowingCorrectAnswer(false);
        setError(false);
        setStatus(null);
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }
        // Immediately start next practice
        setTimeout(() => {
            setStatus(states.display);
        }, 100);
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;
        utterance.voice = voice;
        speechSynthesis.speak(utterance);
    };

    const showCorrectAnswer = () => {
        speakText(`The correct answer was: ${currentChar.toUpperCase()}`);
        setShowingCorrectAnswer(true);
    };

    const statusConfig = useStatusConfig(status, charInput, currentChar);

    return (
        <PageContainer 
            title="Practice Braille"
            headerContent={
                <Card
                    sx={{
                        borderRadius: '12px',
                        backgroundColor: '#ffffff',
                        border: '2px solid #e2e8f0',
                    }}
                >
                    <CardContent sx={{ padding: '1.5rem', textAlign: 'center' }}>
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: '#1a1a1a',
                                marginBottom: '1rem',
                            }}
                        >
                            Choose Input Method
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ToggleButtonGroup
                                value={mode}
                                exclusive
                                onChange={handleModeChange}
                                aria-label="input method"
                                sx={{
                                    '& .MuiToggleButtonGroup-grouped': {
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '8px !important',
                                        margin: '0 0.5rem',
                                        padding: '0.75rem 1.5rem',
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        '&.Mui-selected': {
                                            backgroundColor: theme.palette.custom.buttonBackground,
                                            color: '#ffffff',
                                            borderColor: theme.palette.custom.buttonBackground,
                                            '&:hover': {
                                                backgroundColor: theme.palette.custom.buttonHover,
                                            },
                                        },
                                    },
                                }}
                            >
                                <ToggleButton value="text" aria-label="text input">
                                    <Keyboard sx={{ marginRight: '0.5rem' }} />
                                    Text Input
                                </ToggleButton>
                                <ToggleButton value="speech" aria-label="speech input">
                                    <Mic sx={{ marginRight: '0.5rem' }} />
                                    Speech Input
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </CardContent>
                </Card>
            }
        >
            {mode === 'speech' ? (
                statusConfig ? (
                    <StatusCard
                        statusConfig={statusConfig}
                        status={status}
                        showingCorrectAnswer={showingCorrectAnswer}
                        correctAnswerText={currentChar.toUpperCase()}
                        listenStates={[states.listen]}
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
                                {!showingCorrectAnswer && (
                                    <StyledButton 
                                        onClick={showCorrectAnswer}
                                        sx={{
                                            minWidth: '180px',
                                            fontSize: '1.125rem',
                                        }}
                                    >
                                        Show Answer
                                    </StyledButton>
                                )}
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
                    </StatusCard>
                ) : (
                    <Card
                        sx={{
                            borderRadius: '12px',
                            backgroundColor: '#ffffff',
                            border: '2px solid #e2e8f0',
                        }}
                    >
                        <CardContent
                            sx={{
                                padding: { xs: '1.5rem', md: '2rem' },
                                textAlign: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'rgba(94, 103, 191, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    color: theme.palette.custom.buttonBackground,
                                }}
                                aria-hidden="true"
                            >
                                <Mic sx={{ fontSize: '3rem' }} />
                            </Box>

                            <Typography
                                variant="h5"
                                component="h2"
                                sx={{
                                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                                    fontWeight: 600,
                                    color: '#1a1a1a',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                Speak Your Answer
                            </Typography>

                            <Typography
                                variant="body1"
                                component="p"
                                sx={{
                                    fontSize: { xs: '0.875rem', md: '1rem' },
                                    color: '#4a5568',
                                    marginBottom: '1rem',
                                    lineHeight: 1.5,
                                }}
                            >
                                Click the button and say "letter" followed by a single character (e.g., "letter A")
                            </Typography>

                            <StyledButton 
                                onClick={startPractice}
                                sx={{
                                    minWidth: '150px',
                                    fontSize: '1.125rem',
                                }}
                            >
                                Start Listening
                            </StyledButton>
                        </CardContent>
                    </Card>
                )
            ) : (
                <>
                    {!currentChar ? (
                        <Card
                            sx={{
                                borderRadius: '12px',
                                backgroundColor: '#ffffff',
                                border: '2px solid #e2e8f0',
                            }}
                        >
                            <CardContent
                                sx={{
                                    padding: { xs: '1.5rem', md: '2rem' },
                                    textAlign: 'center',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        background: 'rgba(94, 103, 191, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1rem',
                                        color: theme.palette.custom.buttonBackground,
                                    }}
                                    aria-hidden="true"
                                >
                                    <Keyboard sx={{ fontSize: '3rem' }} />
                                </Box>

                                <Typography
                                    variant="h5"
                                    component="h2"
                                    sx={{
                                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                                        fontWeight: 600,
                                        color: '#1a1a1a',
                                        marginBottom: '0.5rem',
                                    }}
                                >
                                    Type Your Answer
                                </Typography>

                                <Typography
                                    variant="body1"
                                    component="p"
                                    sx={{
                                        fontSize: { xs: '0.875rem', md: '1rem' },
                                        color: '#4a5568',
                                        marginBottom: '1rem',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    Click the button to start practicing
                                </Typography>

                                <StyledButton 
                                    onClick={startPractice}
                                    sx={{
                                        minWidth: '150px',
                                        fontSize: '1.125rem',
                                    }}
                                >
                                    Start Practicing
                                </StyledButton>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {status === states.display && (
                        <Card
                            sx={{
                                borderRadius: '12px',
                                backgroundColor: '#ffffff',
                                border: '2px solid #e2e8f0',
                            }}
                        >
                            <CardContent
                                sx={{
                                    padding: { xs: '1.5rem', md: '2rem' },
                                    textAlign: 'center',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        background: 'rgba(94, 103, 191, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1rem',
                                        color: theme.palette.custom.buttonBackground,
                                    }}
                                    aria-hidden="true"
                                >
                                    <Keyboard sx={{ fontSize: '3rem' }} />
                                </Box>

                                <Typography
                                    variant="h5"
                                    component="h2"
                                    sx={{
                                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                                        fontWeight: 600,
                                        color: '#1a1a1a',
                                        marginBottom: '0.5rem',
                                    }}
                                >
                                    Type Your Answer
                                </Typography>

                                <Typography
                                    variant="body1"
                                    component="p"
                                    sx={{
                                        fontSize: { xs: '0.875rem', md: '1rem' },
                                        color: '#4a5568',
                                        marginBottom: '1rem',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    Type the character displayed on your braille device
                                </Typography>

                                <Box sx={{ maxWidth: '400px', margin: '0 auto 1rem' }}>
                                    <TextField
                                        id="practice-text-input"
                                        label="Your Answer"
                                        error={error}
                                        helperText={
                                            error
                                                ? 'Please enter a single character'
                                                : ''
                                        }
                                        variant='outlined'
                                        value={textInput}
                                        onChange={handleTextChange}
                                        onKeyPress={onKeyPress}
                                        fullWidth
                                        placeholder="Type your answer..."
                                        autoComplete="off"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontSize: '1.25rem',
                                                padding: '0.25rem',
                                                borderRadius: '8px',
                                                '&:hover fieldset': {
                                                    borderColor: theme.palette.custom.buttonBackground,
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: theme.palette.custom.buttonBackground,
                                                    borderWidth: '2px',
                                                },
                                            },
                                            '& .MuiFormHelperText-root': {
                                                fontSize: '1rem',
                                            },
                                        }}
                                    />
                                </Box>

                                <StyledButton 
                                    onClick={submitTextAnswer}
                                    disabled={!textInput}
                                    sx={{
                                        minWidth: '150px',
                                        fontSize: '1.125rem',
                                    }}
                                >
                                    Submit Answer
                                </StyledButton>
                            </CardContent>
                        </Card>
                    )}

                    {(status === states.correct || status === states.incorrect) && (
                        <StatusCard
                            statusConfig={statusConfig}
                            status={status}
                            showingCorrectAnswer={showingCorrectAnswer}
                            correctAnswerText={currentChar.toUpperCase()}
                            listenStates={[]}
                        >
                            <StyledButton 
                                onClick={reset}
                                sx={{
                                    minWidth: '150px',
                                    fontSize: '1.125rem',
                                }}
                            >
                                Next Character
                            </StyledButton>
                        </StatusCard>
                    )}
                        </>
                    )}
                </>
            )}

            <InstructionCard title="How to Practice">
                <strong>Text Input:</strong><br />
                1. Feel the braille character displayed on your box<br />
                2. Type the character you think it is<br />
                3. Press Enter or click "Submit Answer"<br />
                4. Get instant feedback on your response<br />
                <br />
                <strong>Speech Input:</strong><br />
                1. Feel the braille character displayed on your box<br />
                2. When you hear "Listening", say "letter" followed by your answer<br />
                3. Get instant feedback on your response<br />
                4. Continue to the next character to keep practicing
            </InstructionCard>
        </PageContainer>
    );
};

export default Practice;
