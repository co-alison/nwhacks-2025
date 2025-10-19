import React, { useState, useEffect, useRef } from 'react';
import BackButton from '../../components/BackButton';
import characters from '../../utils/characters';
import { states } from '../../utils/constants';
import theme from '../../styles/theme';
import { Box, Typography } from '@mui/material';
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
                "Sorry, we didn’t catch that. Please say 'letter' before your answer, like 'letter A.'"
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
                sx={{
                    fontSize: '2.8rem',
                    marginTop: theme.spacing(10),
                    marginBottom: theme.spacing(4),
                    fontWeight: 'bold',
                }}
            >
                Practice Braille
            </Typography>

            {status === states.display ? (
                <Typography variant='h5' sx={{ fontSize: '2rem' }}>
                    Displaying Character...
                </Typography>
            ) : status === states.listen ? (
                <Box>
                    <Typography variant='h5' sx={{ fontSize: '2rem' }}>
                        Listening...
                    </Typography>
                </Box>
            ) : status === states.correct ? (
                <Box>
                    <Typography variant='h5' sx={{ fontSize: '2rem' }}>
                        {charInput.toUpperCase()}
                    </Typography>
                    <Typography
                        variant='h6'
                        sx={{ fontSize: '1.75rem' }}
                        color='success.main'
                    >
                        Correct!
                    </Typography>
                    <StyledButton onClick={reset}>Next</StyledButton>
                </Box>
            ) : status === states.incorrect ? (
                <Box>
                    <Typography variant='h5' sx={{ fontSize: '2rem' }}>
                        {charInput.toUpperCase()}
                    </Typography>
                    <Typography
                        variant='h6'
                        sx={{ fontSize: '1.75rem' }}
                        color='error.main'
                    >
                        Incorrect, the correct answer was:{' '}
                        {currentChar.toUpperCase()}
                    </Typography>
                    <StyledButton onClick={reset}>Next</StyledButton>
                </Box>
            ) : status === states.noInput ? (
                <Box>
                    <Typography variant='h5' sx={{ fontSize: '2rem' }}>
                        {charInput}
                    </Typography>
                    {showingCorrectAnswer && (
                        <Typography variant='h6' sx={{ fontSize: '1.75rem' }}>
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
                    <Typography variant='h5' sx={{ fontSize: '2rem' }}>
                        {charInput}
                    </Typography>
                    <Typography
                        variant='h6'
                        sx={{ fontSize: '1.75rem' }}
                        color='error.main'
                    >
                        Sorry, we didn’t catch that. Please say 'letter' before
                        your answer, like 'letter A.'
                    </Typography>
                    <StyledButton onClick={(e) => setStatus(states.listen)}>
                        Retry
                    </StyledButton>
                </Box>
            ) : null}
        </Box>
    );
};

export default Practice;
