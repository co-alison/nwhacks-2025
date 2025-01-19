import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import characters from '../../utils/characters';
import { states } from '../../utils/constants';
import axios from 'axios';
import SpeechRecognition, {
    useSpeechRecognition,
} from 'react-speech-recognition';
import theme from '../../styles/theme';
import { Box, Typography } from '@mui/material'; // Importing Material-UI components for consistent styling.
import StyledButton from '../../components/StyledButton';

import CustomNumberInput from '../../components/NumberPicker';

const Quiz = () => {
    const [currentChar, setCurrentChar] = useState('');
    const [status, setStatus] = useState(states.quizMenu);
    const [charInput, setCharInput] = useState('');
    const [timerFlag, setTimerFlag] = useState(true);
    const [isListening, setIsListening] = useState(false);

    const [quizQuestionCount, setQuizQuestionCount] = useState(0);
    const [quizQuestionsLeft, setQuizQuestionsLeft] = useState(0);
    const [correctQuizAnswers, setCorrectQuizAnswers] = useState(0);

    const [characterPool, setCharacterPool] = useState([...characters]);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    useEffect(() => {
        if (status === states.display) {
            const char = getRandomChar();
            console.log('char: ');
            console.log(char);
            setCurrentChar(char);

            // send char to API
            sendChar(char);
        } else if (status === states.listen) {
            listen();
        } else if (status === states.correct) {
            speakText('Correct!');
        } else if (status === states.incorrect) {
            speakText(`Incorrect, the correct answer was: ${currentChar}`);
        }
    }, [status]);

    useEffect(() => {
        if (isListening && timerFlag) {
            const timer = setTimeout(() => {
                setTimerFlag(0);
                SpeechRecognition.stopListening();
                setIsListening(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [timerFlag, isListening]);

    const listen = async () => {
        if (browserSupportsSpeechRecognition) {
            await SpeechRecognition.startListening({ language: 'en-US' });
            setIsListening(true);
            console.log('listening', listening);
        } else {
            console.log('browser does not support speech recognition');
        }
    };

    useEffect(() => {
        const stopListen = async () => {
            await SpeechRecognition.stopListening();
            setIsListening(false);
            const input = transcript.split(' ')[0];
            setCharInput(input);
            resetTranscript();
            verifyChar(input);
        };

        if (!listening && !transcript && !timerFlag) {
            console.log('no input received');
            setCharInput('No input received');
            setStatus(states.incorrect);
        } else if (transcript) {
            stopListen();
        }
    }, [transcript, listening, timerFlag]);

    const sendChar = async (char) => {
        const res = await axios.get(
            `http://localhost:3001/send-letter?letter=${char}`
        );
        if (res.status === 200) {
            setStatus(states.listen);
        }
    };

    const getRandomChar = () => {
        const index = Math.floor(Math.random() * characterPool.length);
        return characterPool[index];
    };

    const verifyChar = async (input) => {
        console.log('current', currentChar);
        console.log('input', input);

        const res = await axios.get(
            `http://localhost:3001/get-letter?input=${input}`
        );
        if (res.data.length !== 1) {
            setStatus(states.incorrect);
            setCharInput('Something went wrong');
            return;
        }

        setCharInput(res.data.toLowerCase());
        if (currentChar === res.data.toLowerCase()) {
            setStatus(states.correct);
            setCorrectQuizAnswers(correctQuizAnswers + 1);

            console.log('char pool before', characterPool);
            characterPool.splice(characterPool.indexOf(currentChar), 1);
            setCharacterPool(characterPool);
            console.log('char pool after', characterPool);
        } else {
            setStatus(states.incorrect);
        }
    };

    useEffect(() => {
        console.log('chars left to choose from', characterPool);
    }, [characterPool]);

    const reset = () => {
        setCurrentChar('');
        setCharInput('');
        setTimerFlag(true);

        if (quizQuestionsLeft > 1) {
            setQuizQuestionsLeft(quizQuestionsLeft - 1);
            setStatus(states.display);
        } else {
            setStatus(states.quizDone);
        }
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

    useEffect(() => {
        console.log('quiz questions left', quizQuestionsLeft);
    }, [quizQuestionsLeft]); // Runs when `quizQuestionsLeft` changes

    const handleQuizQuestionChange = (event, val) => {
        console.log('number of questions chosen', val);
        setQuizQuestionCount(val);
        setQuizQuestionsLeft(val);
    };

    const startQuiz = () => {
        setStatus(states.display);
        console.log('questions left: ', quizQuestionsLeft);
        console.log('total question count: ', quizQuestionCount);
        console.log('quiz started');
    };

    const takeNewQuiz = () => {
        // Reset the characterPool
        setCharacterPool([...characters]);

        setStatus(states.quizMenu);
        setQuizQuestionCount(0);
        setQuizQuestionsLeft(0);
        setCorrectQuizAnswers(0);
    };

    const retakeQuiz = () => {
        // Do not reset the characterPool
        setStatus(states.quizMenu);
        setQuizQuestionCount(0);
        setQuizQuestionsLeft(0);
        setCorrectQuizAnswers(0);
    };

    return (
        <Box
            sx={{
                padding: theme.spacing(4),
                maxWidth: '800px',
                margin: '0 auto',
                textAlign: 'center', // Center align content like Home page.
            }}
        >
            {/* Back button positioned at top left */}
            <Box
                sx={{
                    position: 'absolute',
                    top: theme.spacing(4),
                    left: theme.spacing(4),
                }}
            >
                <BackButton />
            </Box>

            <Typography
                variant='h4'
                sx={{ marginBottom: theme.spacing(4), fontWeight: 'bold' }}
            >
                Braille Quiz
            </Typography>

            {status === states.display ? (
                <Typography variant='h5'>Displaying Character...</Typography>
            ) : status === states.listen ? (
                <Typography variant='h5'>Listening...</Typography>
            ) : status === states.correct ? (
                <Box>
                    <Typography variant='h5'>{charInput}</Typography>
                    <Typography variant='h6' color='success.main'>
                        Correct!
                    </Typography>
                    <StyledButton onClick={reset}>Next</StyledButton>
                </Box>
            ) : status === states.incorrect ? (
                <Box>
                    <Typography variant='h5'>{charInput}</Typography>
                    <Typography variant='h6' color='error.main'>
                        Incorrect, the correct answer was: {currentChar}
                    </Typography>
                    <StyledButton onClick={reset}>Next</StyledButton>
                </Box>
            ) : status === states.quizMenu ? (
                <Box
                    display='flex'
                    justifyContent='center'
                    flexDirection='column'
                    alignItems='center'
                >
                    <Typography variant='h6'>
                        Choose number of quiz questions:
                    </Typography>

                    <CustomNumberInput
                        helperText='Number of quiz questions'
                        value={quizQuestionCount}
                        onChange={handleQuizQuestionChange}
                    ></CustomNumberInput>

                    <StyledButton onClick={startQuiz}>Next</StyledButton>
                </Box>
            ) : status === states.quizDone ? (
                <Box>
                    <Typography variant='h6'>
                        Quiz complete! Your score is:
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
                    <StyledButton onClick={retakeQuiz}>
                        Retest using unseen and incorrect characters
                    </StyledButton>
                    <StyledButton onClick={takeNewQuiz}>
                        Retest using all characters
                    </StyledButton>
                </Box>
            ) : null}
        </Box>
    );
};

export default Quiz;
