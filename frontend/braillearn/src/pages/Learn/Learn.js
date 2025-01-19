import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../../components/BackButton';
import SpeechRecognition, {
    useSpeechRecognition,
} from 'react-speech-recognition';
import { states } from '../../utils/constants';
import StyledButton from '../../components/StyledButton';
import { Box, TextField, Typography } from '@mui/material';
import theme from '../../styles/theme';

function Learn() {
    const [textInput, setTextInput] = useState('');
    const [displayedChar, setDisplayedChar] = useState('');
    const [status, setStatus] = useState(states.listen);

    const getCharacterValue = async () => {
        SpeechRecognition.stopListening();
        sendChar(textInput);
    };

    const sendChar = async (char) => {
        const res = await axios.get(
            `http://localhost:3001/send-letter?letter=${char}`
        );

        if (res.status === 200) {
            console.log('sent', char, 'to the arduino');
            setTextInput(textInput);
            setDisplayedChar(textInput);
        }
    };
    const handleChange = (e) => {
        setTextInput(e.target.value);
    };

    const reset = () => {
        setTextInput('');
        setDisplayedChar('');

        setStatus(states.listen);
    };

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    useEffect(() => {
        if (status === states.listen) {
            listen();
        }
    }, [status]);

    const listen = async () => {
        if (browserSupportsSpeechRecognition) {
            await SpeechRecognition.startListening({
                continuous: true,
                language: 'en-US',
            });
            console.log('listening', listening);
        } else {
            console.log('browser does not support speech recognition');
        }
    };

    useEffect(() => {
        const stopListen = async () => {
            await SpeechRecognition.stopListening();
            const input = transcript.split(' ')[0];
            setTextInput(input);
            setDisplayedChar(input);

            resetTranscript();
            setStatus(states.response);
        };

        if (!listening && !transcript) {
            setStatus(states.response);
        } else if (transcript) {
            stopListen();
        }
    }, [transcript, listening]);

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
                Learn Braille
            </Typography>

            <Box display='flex' justifyContent='center' alignItems='center'>
                <TextField
                    maxLength='1'
                    variant='outlined'
                    value={textInput}
                    onChange={handleChange}
                    helperText='Character to display'
                    sx={{ marginTop: '1rem', padding: '1rem', height: '3rem' }}
                />
                <StyledButton
                    type='button'
                    id='display-btn'
                    onClick={getCharacterValue}
                >
                    Display
                </StyledButton>
            </Box>

            {displayedChar !== '' && (
                <Typography
                    variant='h5'
                    sx={{ padding: '1rem', marginTop: '1rem' }}
                >
                    The character "{displayedChar}" is displayed.
                </Typography>
            )}
            <StyledButton type='button' id='next-btn' onClick={reset}>
                Next
            </StyledButton>
        </Box>
    );
}

export default Learn;
