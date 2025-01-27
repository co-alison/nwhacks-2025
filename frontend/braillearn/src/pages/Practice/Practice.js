import React, { useState, useEffect, useRef } from 'react';
import BackButton from '../../components/BackButton';
import characters from '../../utils/characters';
import { states } from '../../utils/constants';
import axios from 'axios';
import theme from '../../styles/theme';
import { Box, Typography, Button } from '@mui/material';
import StyledButton from '../../components/StyledButton';

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
            sendChar(char);
        } else if (status === states.listen) {
            startListeningWithTimer();
        } else if (status === states.correct) {
            speakText('Correct!');
        } else if (status === states.incorrect) {
            speakText(
                `Incorrect, the correct answer was: ${currentChar.toUpperCase()}`
            );
        } else if (status === states.retry) {
            speakText("Sorry, we didn’t catch that. Please say 'letter' before your answer, like 'letter A.'");
            startListeningWithTimer();
        } else if (status === states.noInput) {
            speakText("No input received.");
        }
    }, [status]);

    const startListeningWithTimer = () => {
        try {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            const speechGrammarList = new (window.SpeechGrammarList || window.webkitSpeechGrammarList)();

            const grammar = '#JSGF V1.0; grammar letters; public <letter> = A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z ;';
            speechGrammarList.addFromString(grammar, 1);

            recognition.grammars = speechGrammarList;
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onresult = (event) => {
                clearTimeout(timerRef.current);
                const spokenInput = event.results[0][0].transcript.trim().toLowerCase();
                const confidence = event.results[0][0].confidence;
                verifyChar(spokenInput, confidence);
            }

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);

                if (event.error === "no-speech") {
                    setStatus(states.noInput);
                    setCharInput("No input received");
                    return;
                } 

                clearTimeout(timerRef.current);
                setStatus(states.retry);
            };

            recognition.onend = () => {};

            recognition.start();
            recognitionRef.current = recognition;

            timerRef.current = setTimeout(() => {
                stopListeningDueToTimeout();
            }, 10000);
        } catch (error) {
            console.error('Error starting speech recognition:', error);
        }
    }

    const stopListeningDueToTimeout = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setStatus(states.noInput);
        setCharInput("No input received");
    }

    const sendChar = async (char) => {
        // const res = await axios.get(
        //     `http://localhost:3001/send-letter?letter=${char}`
        // );
        // if (res.status === 200) {
        //     setStatus(states.listen);
        // }
        setStatus(states.listen);
    };

    const getRandomChar = () => {
        const index = Math.floor(Math.random() * characters.length);
        return characters[index];
    };

    const verifyChar = async (input, confidence) => {
        console.log('current', currentChar);
        console.log('input', input);
        console.log('confidence', confidence);

        if (input.trim().toLowerCase() === currentChar) {
            setStatus(states.correct);
            setCharInput(currentChar);
            return;
        }

        if (input.startsWith("letter ") && input.length > 7 && confidence >= 0.5) {
            const detectedLetter = input.split(" ")[1];
            console.log(`detectedLetter: ${detectedLetter}`);
            setCharInput(detectedLetter.toLowerCase());

            if (detectedLetter.trim().toLowerCase() === currentChar.trim().toLowerCase()) {
                setStatus(states.correct);
            } else {
                setStatus(states.incorrect);
            }
        } else if (confidence < 0.5 || !input.startsWith("letter")) {
            // TODO: further process the input using NLP, currently asks user to try again on low confidence
            // const splitInput = input.split(" ");
            // for (const word of splitInput) {
            //     const res = await axios.get(`http://localhost:3001/get-letter-nlp?input=${input}`);
                
            // }
            console.log("low confidence");
            setStatus(states.retry);
        } else {
            console.log("unrecognized input", input);
            setStatus(states.retry);
        }
    }

    const reset = () => {
        // const clear = '.';
        // const res = axios.get(`http://localhost:3001/send-letter?letter=${clear}`);
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
        speechSynthesis.speak(utterance);
    };

    const showCorrectAnswer = () => {
        speakText(`The correct answer was: ${currentChar.toUpperCase()}`);
        setShowingCorrectAnswer(true);
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
                Practice Braille
            </Typography>

            {status === states.display ? (
                <Typography variant='h5'>Displaying Character...</Typography>
            ) : status === states.listen ? (
                <Typography variant='h5'>Listening...</Typography>
            ) : status === states.correct ? (
                <Box>
                    <Typography variant='h5'>
                        {charInput.toUpperCase()}
                    </Typography>
                    <Typography variant='h6' color='success.main'>
                        Correct!
                    </Typography>
                    <StyledButton onClick={reset}>Next</StyledButton>
                </Box>
            ) : status === states.incorrect ? (
                <Box>
                    <Typography variant='h5'>{charInput.toUpperCase()}</Typography>
                    <Typography variant='h6' color='error.main'>
                        Incorrect, the correct answer was:{' '}
                        {currentChar.toUpperCase()}
                    </Typography>
                    <StyledButton onClick={reset}>Next</StyledButton>
                </Box>
            ) : status === states.noInput ? (
                <Box>
                    <Typography variant='h5'>{charInput}</Typography>
                    {showingCorrectAnswer && (
                        <Typography variant='h6'>
                            The correct answer was: {currentChar.toUpperCase()}
                        </Typography>
                    )}

                    <StyledButton onClick={showCorrectAnswer}>
                        Show correct answer
                    </StyledButton>
                    <StyledButton onClick={reset}>Next</StyledButton>
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
};

export default Practice;
