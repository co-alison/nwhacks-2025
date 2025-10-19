import React, { useState, useEffect, useRef } from 'react';
import characters from '../../utils/characters';
import { states } from '../../utils/constants';
import theme from '../../styles/theme';
import { Box, Typography, Container, Card, CardContent, LinearProgress, Chip } from '@mui/material';
import { Mic, CheckCircle, Cancel, VolumeUp, Refresh } from '@mui/icons-material';
import StyledButton from '../../components/StyledButton';
import CustomNumberInput from '../../components/NumberPicker';
import { sendChar } from '../../utils/serverApi';
import { startListeningWithTimer } from '../../utils/speechRecognition';

const Quiz = () => {
    const [currentChar, setCurrentChar] = useState('');
    const [status, setStatus] = useState(states.quizMenu);
    const [charInput, setCharInput] = useState('');
    const recognitionRef = useRef(null);
    const timerRef = useRef(null);

    const [quizQuestionCount, setQuizQuestionCount] = useState(5);
    const [quizQuestionsLeft, setQuizQuestionsLeft] = useState(-1);
    const [correctQuizAnswers, setCorrectQuizAnswers] = useState(0);

    const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);
    const [retakeQuizCharPool, setRetakeQuizCharPool] = useState([
        ...characters,
    ]);

    const [seenCharacters, setSeenCharacters] = useState(new Set());
    const [incorrectCharacters, setIncorrectCharacters] = useState(new Set());

    const [isRetakingQuiz, setIsRetakingQuiz] = useState(false);

    useEffect(() => {
        if (status === states.display) {
            const char = getRandomChar();
            console.log('char: ', char);
            setCurrentChar(char);
            
            // Track that we've seen this character
            setSeenCharacters((prev) => new Set([...prev, char]));

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
            // Update quiz score
            setCorrectQuizAnswers((prev) => {
                console.log('Updating correct answers from', prev, 'to', prev + 1);
                return prev + 1;
            });
            // Remove from incorrect set if it was there
            setIncorrectCharacters((prev) => {
                const newSet = new Set(prev);
                newSet.delete(currentChar);
                return newSet;
            });
            // Update questions remaining
            setQuizQuestionsLeft((prev) => {
                const newCount = prev - 1;
                console.log('Questions remaining:', newCount);
                return newCount;
            });
        } else if (status === states.incorrect) {
            speakText(
                `Incorrect, the correct answer was: ${currentChar.toUpperCase()}`
            );
            // Add to incorrect characters
            setIncorrectCharacters((prev) => new Set([...prev, currentChar]));
            // Update questions remaining
            setQuizQuestionsLeft((prev) => {
                const newCount = prev - 1;
                console.log('Questions remaining:', newCount);
                return newCount;
            });
        } else if (status === states.retry) {
            speakText(
                "Sorry, we didn't catch that. Please say 'letter' before your answer, like 'letter A.'"
            );
        } else if (status === states.noInput) {
            speakText('No input received.');
            // Treat no input as incorrect
            setIncorrectCharacters((prev) => new Set([...prev, currentChar]));
            // Update questions remaining
            setQuizQuestionsLeft((prev) => {
                const newCount = prev - 1;
                console.log('Questions remaining:', newCount);
                return newCount;
            });
        }

        return () => {};
    }, [status, currentChar]);

    const getRandomChar = () => {
        const chars = isRetakingQuiz ? retakeQuizCharPool : characters;
        console.log('choosing characters from', chars);
        const index = Math.floor(Math.random() * chars.length);
        return chars[index];
    };

    const reset = () => {
        const clear = '.';
        setCurrentChar('');
        setCharInput('');
        clearTimeout(timerRef.current);
        setShowingCorrectAnswer(false);
        
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }

        // Check if quiz is done
        if (quizQuestionsLeft === 0) {
            setStatus(states.quizDone);
        } else if (quizQuestionsLeft > 0) {
            setStatus(states.display);
        }
    };

    const showCorrectAnswer = () => {
        speakText(`The correct answer was: ${currentChar.toUpperCase()}`);
        setShowingCorrectAnswer(true);
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;
        utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google US English') || null;
        speechSynthesis.speak(utterance);
    };

    const handleQuizQuestionChange = (event, val) => {
        console.log('number of questions chosen', val);
        setQuizQuestionCount(val);
    };

    const startQuiz = () => {
        if (quizQuestionCount > 0) {
            setQuizQuestionsLeft(quizQuestionCount);
            setCorrectQuizAnswers(0);
            console.log('questions left: ', quizQuestionCount);
            console.log('total question count: ', quizQuestionCount);
            console.log('quiz started');
            setStatus(states.display);
        }
    };

    const takeNewQuiz = () => {
        setRetakeQuizCharPool([...characters]);
        setSeenCharacters(new Set());
        setIncorrectCharacters(new Set());
        setIsRetakingQuiz(false);
        setStatus(states.quizMenu);
        setQuizQuestionCount(5);
        setQuizQuestionsLeft(-1);
        setCorrectQuizAnswers(0);
    };

    const retakeQuiz = () => {
        // Get all characters that were either incorrect or never seen
        const incorrectArray = Array.from(incorrectCharacters);
        const unseenArray = characters.filter(char => !seenCharacters.has(char));
        const retakeArray = [...new Set([...incorrectArray, ...unseenArray])];
        
        console.log('Seen characters:', Array.from(seenCharacters));
        console.log('Incorrect characters:', incorrectArray);
        console.log('Unseen characters:', unseenArray);
        console.log('Retake pool:', retakeArray);
        
        setRetakeQuizCharPool(retakeArray);
        setIsRetakingQuiz(true);
        setQuizQuestionsLeft(retakeArray.length);
        setQuizQuestionCount(retakeArray.length);
        setCorrectQuizAnswers(0);
        
        // Reset tracking for the retake
        setSeenCharacters(new Set());
        setIncorrectCharacters(new Set());
        
        setStatus(states.display);
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
                    subtitle: `You said: ${charInput.toUpperCase()}. The correct answer was: ${currentChar.toUpperCase()}`,
                    color: '#ef4444',
                    bgColor: 'rgba(239, 68, 68, 0.1)',
                };
            case states.retry:
                return {
                    icon: <Refresh sx={{ fontSize: '4rem' }} />,
                    title: 'Try Again',
                    subtitle: 'Say "letter" before your answer',
                    color: '#f59e0b',
                    bgColor: 'rgba(245, 158, 11, 0.1)',
                };
            case states.noInput:
                return {
                    icon: <Mic sx={{ fontSize: '4rem' }} />,
                    title: 'No Input Received',
                    subtitle: 'We didn\'t hear anything',
                    color: '#6b7280',
                    bgColor: 'rgba(107, 114, 128, 0.1)',
                };
            default:
                return {
                    icon: null,
                    title: '',
                    subtitle: '',
                    color: '#5e67bf',
                    bgColor: 'rgba(94, 103, 191, 0.1)',
                };
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(to bottom, #f0f4f8, #d9e2ec)',
                padding: theme.spacing(4),
            }}
        >
            <Container maxWidth="md">
                <Box sx={{ marginTop: theme.spacing(4) }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            fontWeight: 700,
                            color: '#1a1a1a',
                            marginBottom: '1rem',
                            textAlign: 'center',
                        }}
                    >
                        Braille Quiz
                    </Typography>

                    {quizQuestionsLeft !== -1 &&
                    status !== states.quizMenu &&
                    status !== states.quizDone && (
                        <Box sx={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <Chip
                                label={`${quizQuestionsLeft} question(s) left`}
                                sx={{
                                    fontSize: '1rem',
                                    padding: '0.5rem 1rem',
                                    height: 'auto',
                                    backgroundColor: '#5e67bf',
                                    color: 'white',
                                    fontWeight: 600,
                                }}
                            />
                        </Box>
                    )}

                    {status === states.quizMenu ? (
                        <Card
                            sx={{
                                borderRadius: '12px',
                                backgroundColor: '#ffffff',
                                border: '2px solid #e2e8f0',
                            }}
                        >
                            <CardContent sx={{ padding: '2rem' }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontSize: '1.25rem',
                                        fontWeight: 600,
                                        color: '#1a1a1a',
                                        marginBottom: '1.5rem',
                                        textAlign: 'center',
                                    }}
                                >
                                    Choose number of quiz questions:
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        marginBottom: '1.5rem',
                                    }}
                                >
                                    <CustomNumberInput
                                        helperText='Number of quiz questions'
                                        value={quizQuestionCount}
                                        onChange={handleQuizQuestionChange}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <StyledButton 
                                        onClick={startQuiz}
                                        disabled={quizQuestionCount <= 0}
                                        sx={{
                                            minWidth: '150px',
                                            fontSize: '1.125rem',
                                        }}
                                    >
                                        Start Quiz
                                    </StyledButton>
                                </Box>
                            </CardContent>
                        </Card>
                    ) : status === states.quizDone ? (
                        <Card
                            sx={{
                                borderRadius: '12px',
                                backgroundColor: '#ffffff',
                                border: '2px solid #e2e8f0',
                            }}
                        >
                            <CardContent sx={{ padding: '2rem' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '1.5rem',
                                    }}
                                >
                                    <CheckCircle
                                        sx={{
                                            fontSize: '5rem',
                                            color: '#10b981',
                                        }}
                                    />
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: '1.5rem',
                                            fontWeight: 600,
                                            color: '#1a1a1a',
                                        }}
                                    >
                                        Quiz Complete!
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontSize: '2.5rem',
                                            fontWeight: 700,
                                            color: '#5e67bf',
                                        }}
                                    >
                                        {correctQuizAnswers}/{quizQuestionCount}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: '1.125rem',
                                            color: '#4a5568',
                                        }}
                                    >
                                        Score: {Math.round((correctQuizAnswers / quizQuestionCount) * 100)}%
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '1rem',
                                            width: '100%',
                                            maxWidth: '300px',
                                        }}
                                    >
                                        {(() => {
                                            const incorrectArray = Array.from(incorrectCharacters);
                                            const unseenArray = characters.filter(char => !seenCharacters.has(char));
                                            const hasRetakeChars = incorrectArray.length > 0 || unseenArray.length > 0;
                                            
                                            return hasRetakeChars && (
                                                <StyledButton 
                                                    onClick={retakeQuiz}
                                                    sx={{
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    Retest Incorrect/Unseen ({incorrectArray.length + unseenArray.length})
                                                </StyledButton>
                                            );
                                        })()}
                                        <StyledButton 
                                            onClick={takeNewQuiz}
                                            sx={{
                                                fontSize: '1rem',
                                            }}
                                        >
                                            New Quiz (All Characters)
                                        </StyledButton>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <Card
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: '#ffffff',
                                    border: '2px solid #e2e8f0',
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
                                            background: getStatusConfig().bgColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 2rem',
                                            color: getStatusConfig().color,
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
                                        {getStatusConfig().icon}
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
                                        {getStatusConfig().title}
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
                                        {getStatusConfig().subtitle}
                                    </Typography>

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
                                    {getStatusConfig().showProgress && (
                                        <Box
                                            sx={{
                                                width: '100%',
                                                maxWidth: '400px',
                                                margin: '0 auto 1.5rem',
                                            }}
                                        >
                                            <LinearProgress
                                                sx={{
                                                    height: '8px',
                                                    borderRadius: '4px',
                                                    backgroundColor: 'rgba(94, 103, 191, 0.2)',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: '#5e67bf',
                                                    },
                                                }}
                                            />
                                        </Box>
                                    )}

                                    {/* Action Buttons */}
                                    <Box
                                        sx={{
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
                                    </Box>
                                </CardContent>
                            </Card>

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
                                        Quiz Progress
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            gap: '1rem',
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: '1rem',
                                                color: '#4a5568',
                                            }}
                                        >
                                            Correct: {correctQuizAnswers}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: '1rem',
                                                color: '#4a5568',
                                            }}
                                        >
                                            Remaining: {quizQuestionsLeft}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default Quiz;
