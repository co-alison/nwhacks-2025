import React, { useState, useEffect, useRef } from 'react';
import BackButton from '../../components/BackButton';
import characters from '../../utils/characters';
import { states } from '../../utils/constants';
import axios from 'axios';
import theme from '../../styles/theme';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import StyledButton from '../../components/StyledButton';

const Practice = () => {
    const [currentChar, setCurrentChar] = useState('');
    const [status, setStatus] = useState(states.display);
    const [charInput, setCharInput] = useState('');
    const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);
    const [volume, setVolume] = useState(0);
    const recognitionRef = useRef(null);
    const timerRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const microphoneRef = useRef(null);
    const volumeIntervalRef = useRef(null);

    useEffect(() => {
        if (status === states.display) {
            const char = getRandomChar();
            console.log('char: ', char);
            setCurrentChar(char);
            sendChar(char);
        } else if (status === states.listen) {
            // setupAudio();
            startListeningWithTimer();
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

        return () => {
            // stopAudio();
        };
    }, [status]);

    const setupAudio = async () => {
        try {
            const audioContext = new window.AudioContext();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const microphone = audioContext.createMediaStreamSource(stream);

            const gainNode = audioContext.createGain();
            gainNode.gain.value = 2;

            const noiseSuppressionFilter = audioContext.createBiquadFilter();
            noiseSuppressionFilter.type = 'lowpass';
            noiseSuppressionFilter.frequency.value = 3000;

            // const analyser = audioContext.createAnalyser();
            // analyser.fftSize = 256;

            microphone.connect(gainNode);
            gainNode.connect(noiseSuppressionFilter);
            // noiseSuppressionFilter.connect(analyser);

            audioContextRef.current = audioContext;
            // analyserRef.current = analyser;
            microphoneRef.current = microphone;

            // monitorVolume();
        } catch (error) {
            console.error("Error setting up audio:", error)
        }
    }

    // const monitorVolume = () => {
    //     const analyser = analyserRef.current;
    //     const dataArray = new Uint8Array(analyser.fftSize);

    //     const updateVolume = () => {
    //         analyser.getByteFrequencyData(dataArray);
    //         const maxVolume = Math.max(...dataArray) / 255;
    //         setVolume(maxVolume);
    //     };

    //     volumeIntervalRef.current = setInterval(updateVolume, 100);
    // }

    const stopAudio = () => {
        if (microphoneRef.current) {
            console.log('disconnect');
            microphoneRef.current.disconnect();
        }
        if (audioContextRef.current) {
            console.log("close");
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        if (volumeIntervalRef.current) {
            clearInterval(volumeIntervalRef.current);
        }

        setVolume(0);
    }

    const startListeningWithTimer = () => {
        console.log("start");
        try {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            const speechGrammarList = new (window.SpeechGrammarList || window.webkitSpeechGrammarList)();

            const grammar = `
                #JSGF V1.0;
                grammar letters;
                public <letter> = A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z 
                 | letter A | letter B | letter C | letter D | letter E | letter F | letter G | letter H | letter I 
                 | letter J | letter K | letter L | letter M | letter N | letter O | letter P | letter Q | letter R 
                 | letter S | letter T | letter U | letter V | letter W | letter X | letter Y | letter Z;
                `;
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
                recognition.stop();
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

            recognition.onspeechend = () => {
                console.log('speech end');
                // recognition.abort();
                // stopAudio();
                // recognitionRef.current = null;
            };

            recognition.onend = () => {
                console.log("stopped");
                recognition.abort();
                recognitionRef.current = null;
                // stopAudio();
            }

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
            // stopAudio();
            setStatus(states.noInput);
            setCharInput("No input received");
        }
    }

    const sendChar = async (char) => {
        const res = await axios.get(
            `http://localhost:3001/send-letter?letter=${char}`
        );
        if (res.status === 200) {
            setStatus(states.listen);
        }
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

        if (input.trim().length === 1) {
            if (input.trim().toLowerCase() === currentChar) {
                setStatus(states.correct);
                setCharInput(currentChar);
                return;
            } else {
                setStatus(states.incorrect);
                setCharInput(input.trim().toLowerCase());
                return;
            }
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
        // stopAudio();
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
                <Box>
                    <Typography variant="h5">Listening...</Typography>
                    {/* <Box sx={{ position: 'relative', margin: '20px auto', width: '100px', height: '100px' }}>
                        <CircularProgress
                            variant="determinate"
                            value={volume * 100}
                            size={100}
                            sx={{ color: volume > 0.5 ? 'green' : 'red' }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant="h6">{Math.round(volume * 100)}%</Typography>
                        </Box>
                    </Box> */}
                </Box>
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
