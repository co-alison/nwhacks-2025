import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import theme from '../../../styles/theme';
import { sendChar } from '../../../utils/serverApi';
import { states } from '../../../utils/constants';
import  {
    useSpeechRecognition,
} from 'react-speech-recognition';
import { startListeningWithTimer } from '../../../utils/speechRecognition';
import StyledButton from '../../../components/StyledButton';

const PracticeQuizPage = ({
    module,
    nextModule,
}) => {
    const navigate = useNavigate();

    const [currentChar, setCurrentChar] = useState('');
    const [status, setStatus] = useState(states.quizMenu);
    const [charInput, setCharInput] = useState('');

    const [quizQuestionCount, setQuizQuestionCount] = useState(0);
    const [correctQuizAnswers, setCorrectQuizAnswers] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);
    const [characterPool, setCharacterPool] = useState({});

    const recognitionRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        resetCharacterPool();
    }, []);

    const updateCharValue = (char) => {
        const newVal = (characterPool[char] -= 1);
        if (newVal === 0) {
            delete characterPool[char];
            console.log(characterPool);

            const keys = Object.keys(characterPool);
            if (keys.length === 0) {
                setQuizComplete(true);
                console.log('quiz is done');
            }
            setCharacterPool(characterPool);
        } else {
            setCharacterPool((characterPool) => ({
                ...characterPool,
                [char]: newVal,
            }));
        }
    };

    useEffect(() => {
        console.log(characterPool);
    }, [characterPool]);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    useEffect(() => {
        if (status === states.display) {
            if (!quizComplete) {
                const char = getRandomChar();
                console.log('char: ');
                console.log(char);
                setCurrentChar(char);

                sendChar(char, () => {
                    setStatus(states.listen);
                });
            }
        } else if (status === states.listen) {
            startListeningWithTimer(timerRef, recognitionRef, setStatus, setCharInput, currentChar);
        } else if (status === states.correct) {
            speakText('Correct!');
        } else if (status === states.incorrect) {
            speakText(
                `Incorrect, the correct answer was: ${currentChar.toUpperCase()}`
            );
        } else if (status === states.retry) {
            speakText("Sorry, we didn’t catch that. Please say 'letter' before your answer, like 'letter A.'");
        } else if (status === states.noInput) {
            speakText("No input received.");
        }
    }, [status]);

    const getRandomChar = () => {
        const keys = Object.keys(characterPool);
        console.log('pulling chars from ', keys);
        const index = Math.floor(Math.random() * keys.length); 
        return keys[index];
    };


    const reset = () => {
        setCurrentChar('');
        setCharInput('');
        setShowingCorrectAnswer(false);

        if (quizComplete) {
            setStatus(states.quizDone);
        } else {
            setStatus(states.display);
        }

        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }
    };

    const showCorrectAnswer = () => {
        setShowingCorrectAnswer(true);
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;
        speechSynthesis.speak(utterance);
    };
    const startQuiz = () => {
        setStatus(states.display);
    };

    const restartQuiz = () => {
        setStatus(states.quizMenu);
        setQuizComplete(false);
        setQuizQuestionCount(0);
        setCorrectQuizAnswers(0);
        resetCharacterPool();
    };

    const resetCharacterPool = () => {
        const quizChars = {};
        module.charsList.forEach((char) => {
            quizChars[char] = module.numberOfQuestionRepetitions || 3;
        });
        setCharacterPool(quizChars);
    };

    return (
        <Box
            sx={{
                padding: theme.spacing(4),
                maxWidth: '800px',
                margin: '0 auto',
                textAlign: 'center',
            }}
        >
            {status === states.display ? (
                <Typography variant='h5' sx={{ fontSize: '1.5rem' }}>Displaying Character...</Typography>
            ) : status === states.listen ? (
                <Typography variant='h5' sx={{ fontSize: '1.5rem' }}>
                    Listening for a character...
                </Typography>
            ) : status === states.correct ? (
                <Box>
                    <Typography variant='h5' sx={{ fontSize: '1.5rem' }}>
                        {charInput.toUpperCase()}
                    </Typography>
                    <Typography variant='h6' sx={{ fontSize: '1.5rem' }} color='success.main'>
                        Correct!
                    </Typography><br /><br /><br />
                    <Button onClick={reset} variant='outlined' sx={{
                        fontSize: '1.8rem', color: theme.palette.custom.buttonBackground,
                        padding: '1rem',
                        width: '10rem',
                        height: '3.5rem',
                    }}>Continue</Button>
                </Box>
            ) : status === states.incorrect ? (
                <Box>
                    <Typography variant='h5' sx={{ fontSize: '1.5rem' }}>
                        {charInput === 'No input received' ||
                            charInput === 'Something went wrong'
                            ? charInput
                            : charInput.toUpperCase()}
                    </Typography>
                    <Typography variant='h6' sx={{ fontSize: '1.5rem' }} color='error.main'>
                        Incorrect, the correct answer was:{' '}
                        {currentChar.toUpperCase()}
                    </Typography><br /><br /><br />

                    <Button onClick={reset} variant='outlined' sx={{
                        fontSize: '1.8rem',
                        color: theme.palette.custom.buttonBackground,
                        padding: '1rem',
                        width: '10rem',
                        height: '3.5rem',
                    }}>Continue</Button>
                </Box>
            ) : status === states.quizMenu ? (
                <Box>
                    <Typography variant='p' sx={{ fontSize: '1.5rem' }}>
                        You will now take a practice quiz on the characters{' '}
                        {module.chars}.  Tap
                        "Start" to begin.
                    </Typography><br /><br /><br />

                    <Button onClick={startQuiz} variant='outlined' sx={{
                        fontSize: '1.8rem',
                        color: theme.palette.custom.buttonBackground,
                        padding: '1rem',
                        width: '8rem',
                        height: '3.5rem',
                    }}>Start</Button>
                </Box>
            ) : status === states.quizDone ? (
                <Box>
                    <Typography variant='h6' sx={{ fontSize: '1.5rem' }}>
                        Practice Quiz complete! Your score is:
                    </Typography>
                    <Typography
                        variant='h5'
                        sx={{
                            fontSize: '1.5rem',
                            marginTop: theme.spacing(4),
                            fontWeight: 'bold',
                        }}
                    >
                        {correctQuizAnswers}/{quizQuestionCount}
                    </Typography>

                    <Button onClick={restartQuiz} variant='outlined' sx={{
                        fontSize: '1.8rem',
                        color: theme.palette.custom.buttonBackground,
                        padding: '1rem',
                        width: '8rem',
                        height: '3.5rem',
                    }}>Retake Practice Quiz</Button>

                    <Button
                        onClick={() => navigate(`/modules/${nextModule.id}`)} variant='outlined' sx={{
                            fontSize: '1.8rem',
                            color: theme.palette.custom.buttonBackground,
                            padding: '1rem',
                            width: '8rem',
                            height: '3.5rem',
                        }}
                        disabled={!nextModule}
                    >
                        Next
                    </Button>
                </Box>
            ) : status === states.noInput ? (
                <Box>
                    <Typography variant='h5' sx={{ fontSize: '1.5rem' }}>{charInput}</Typography>
                    {showingCorrectAnswer && (
                        <Typography variant='h6' sx={{ fontSize: '1.5rem' }}>
                            The correct answer was: {currentChar.toUpperCase()}
                        </Typography>
                    )}

                    <Button onClick={showCorrectAnswer} variant='outlined' sx={{
                        fontSize: '1.8rem',
                        color: theme.palette.custom.buttonBackground,
                        padding: '1rem',
                        width: '8rem',
                        height: '3.5rem',
                    }}>
                        Show correct answer
                    </Button>
                    <Button onClick={reset} variant='outlined' sx={{
                        fontSize: '1.8rem',
                        color: theme.palette.custom.buttonBackground,
                        padding: '1rem',
                        width: '8rem',
                        height: '3.5rem',
                    }}>Next</Button>
                </Box>
            ) : status === states.retry ? (
                <Box>
                    <Typography variant='h5' sx={{ fontSize: '1.5rem' }}>{charInput}</Typography>
                    <Typography variant='h6' sx={{ fontSize: '1.5rem' }} color='error.main'>
                        Sorry, we didn’t catch that. Please say 'letter' before your answer, like 'letter A.'
                    </Typography><br /><br /><br />
                    <StyledButton onClick={(e) => setStatus(states.listen)} variant='outlined' sx={{
                        fontSize: '1.8rem',
                        color: theme.palette.custom.buttonBackground,
                        padding: '1rem',
                        width: '8rem',
                        height: '3.5rem',
                    }}>Retry</StyledButton>
                </Box>
            ) : null}
        </Box>
    );
};

export default PracticeQuizPage;