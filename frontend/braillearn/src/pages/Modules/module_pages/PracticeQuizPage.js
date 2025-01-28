import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, ThemeProvider, Button } from '@mui/material';
import theme from '../../../styles/theme';
import axios from 'axios';
import { sendChar } from '../../../utils/serverApi';
import { states } from '../../../utils/constants';
import SpeechRecognition, {
    useSpeechRecognition,
} from 'react-speech-recognition';
import { startListeningWithTimer } from '../../../utils/speechRecognition';
import StyledButton from '../../../components/StyledButton';

const PracticeQuizPage = ({
    module /*isCompleted, onComplete*/,
    nextModule,
}) => {
    const navigate = useNavigate();

    const [currentChar, setCurrentChar] = useState('');
    const [status, setStatus] = useState(states.quizMenu);
    const [charInput, setCharInput] = useState('');
    const [timerFlag, setTimerFlag] = useState(true);
    const [isListening, setIsListening] = useState(false);

    const [quizQuestionCount, setQuizQuestionCount] = useState(0);
    const [correctQuizAnswers, setCorrectQuizAnswers] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);
    const [characterPool, setCharacterPool] = useState({});

    const [volume, setVolume] = useState(0);
    const recognitionRef = useRef(null);
    const timerRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const microphoneRef = useRef(null);
    const volumeIntervalRef = useRef(null);

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

    // helper
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

                // send char to API
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

    // useEffect(() => {
    //     if (isListening && timerFlag) {
    //         const timer = setTimeout(() => {
    //             setTimerFlag(0);
    //             SpeechRecognition.stopListening();
    //             setIsListening(false);
    //         }, 5000);

    //         return () => clearTimeout(timer);
    //     }
    // }, [timerFlag, isListening]);

    // const listen = async () => {
    //     if (browserSupportsSpeechRecognition) {
    //         await SpeechRecognition.startListening({ language: 'en-US' });
    //         setIsListening(true);
    //         console.log('listening', listening);
    //     } else {
    //         console.log('browser does not support speech recognition');
    //     }
    // };

    // useEffect(() => {
    //     const stopListen = async () => {
    //         await SpeechRecognition.stopListening();
    //         setIsListening(false);
    //         const input = transcript.split(' ')[0];
    //         setCharInput(input);
    //         resetTranscript();
    //         verifyChar(input);
    //     };

    //     if (!listening && !transcript && !timerFlag) {
    //         console.log('no input received');
    //         setCharInput('No input received');
    //         setStatus(states.noInput);
    //     } else if (transcript) {
    //         stopListen();
    //     }
    // }, [transcript, listening, timerFlag]);

    const getRandomChar = () => {
        const keys = Object.keys(characterPool);
        console.log('pulling chars from ', keys);
        const index = Math.floor(Math.random() * keys.length); // TODO: this is not weighted based on the number of times a character has left to appear
        return keys[index];
    };

    // const verifyChar = async (input) => {
    //     console.log('current', currentChar);
    //     console.log('input', input);

    //     const res = await axios.get(
    //         `http://localhost:3001/get-letter?input=${input}`
    //     );
    //     if (res.data.length !== 1) {
    //         setStatus(states.incorrect);
    //         setCharInput('Something went wrong');
    //         return;
    //     }

    //     setCharInput(res.data.toLowerCase());
    //     if (currentChar === res.data.toLowerCase()) {
    //         setStatus(states.correct);
    //         setCorrectQuizAnswers(correctQuizAnswers + 1);
    //         updateCharValue(currentChar);
    //         if (characterPool.length === 0) {
    //             setQuizComplete(true);
    //         }
    //     } else {
    //         setStatus(states.incorrect);
    //     }
    //     setQuizQuestionCount(quizQuestionCount + 1);
    // };

    const reset = () => {
        setCurrentChar('');
        setCharInput('');
        // setTimerFlag(true);
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
        // const voices = speechSynthesis.getVoices();
        // voices.forEach(voice => {
        //     console.log(`Name: ${voice.name}, Lang: ${voice.lang}, Voice URI: ${voice.voiceURI}`);
        // });
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
        // Reset everything
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
                <Typography variant='h5'>Displaying Character...</Typography>
            ) : status === states.listen ? (
                <Typography variant='h5'>
                    Listening for a character...
                </Typography>
            ) : status === states.correct ? (
                <Box>
                    <Typography variant='h5'>
                        {charInput.toUpperCase()}
                    </Typography>
                    <Typography variant='h6' color='success.main'>
                        Correct!
                    </Typography>
                    <Button onClick={reset}>Continue</Button>
                </Box>
            ) : status === states.incorrect ? (
                <Box>
                    <Typography variant='h5'>
                        {charInput === 'No input received' ||
                        charInput === 'Something went wrong'
                            ? charInput
                            : charInput.toUpperCase()}
                    </Typography>
                    <Typography variant='h6' color='error.main'>
                        Incorrect, the correct answer was:{' '}
                        {currentChar.toUpperCase()}
                    </Typography>
                    <Button onClick={reset}>Continue</Button>
                </Box>
            ) : status === states.quizMenu ? (
                <Box>
                    <Typography variant='p'>
                        You will now take a practice quiz on the characters{' '}
                        {module.chars}. The braille display will show a
                        character. Guess what the character is by speaking your
                        answer into the microphone. The “Next” button will
                        appear when you get each character correct 3 times. Tap
                        "Start" to begin.
                    </Typography>
                    <Button onClick={startQuiz}>Start</Button>
                </Box>
            ) : status === states.quizDone ? (
                <Box>
                    <Typography variant='h6'>
                        Practice Quiz complete! Your score is:
                    </Typography>
                    <Typography
                        variant='h5'
                        sx={{
                            marginTop: theme.spacing(4),
                            fontWeight: 'bold',
                        }}
                    >
                        {correctQuizAnswers}/{quizQuestionCount}
                    </Typography>

                    <Button onClick={restartQuiz}>Retake Practice Quiz</Button>

                    <Button
                        onClick={() => navigate(`/modules/${nextModule.id}`)}
                        disabled={!nextModule}
                    >
                        Next
                    </Button>
                </Box>
            ) : status === states.noInput ? (
                <Box>
                    <Typography variant='h5'>{charInput}</Typography>
                    {showingCorrectAnswer && (
                        <Typography variant='h6'>
                            The correct answer was: {currentChar.toUpperCase()}
                        </Typography>
                    )}

                    <Button onClick={showCorrectAnswer}>
                        Show correct answer
                    </Button>
                    <Button onClick={reset}>Next</Button>
                </Box>
            ) : status === states.retry ? (
                <Box>
                    <Typography variant='h5'>{charInput}</Typography>
                    <Typography variant='h6' color='error.main'>
                        Sorry, we didn’t catch that. Please say 'letter' before your answer, like 'letter A.'
                    </Typography>
                    <StyledButton onClick={(e) => setStatus(states.listen)}>Retry</StyledButton>
                </Box>
            ) : null}
        </Box>
    );

    {
        /* <button onClick={onComplete} disabled={isCompleted}>
            {isCompleted ? 'Practice Quiz Completed' : 'Submit Practice Quiz'}
        </button> */
    }
};

export default PracticeQuizPage;
