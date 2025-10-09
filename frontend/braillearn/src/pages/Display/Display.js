import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../../components/BackButton';
import SpeechRecognition, {
    useSpeechRecognition,
} from 'react-speech-recognition';
import { states } from '../../utils/constants';
import StyledButton from '../../components/StyledButton';
import { Box, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import theme from '../../styles/theme';
import { sendChar } from '../../utils/serverApi';

function Display() {
    const [textInput, setTextInput] = useState('');
    const [displayedChar, setDisplayedChar] = useState('');
    const [status, setStatus] = useState(states.listen);
    const [error, setError] = useState(false);
    const [mode, setMode] = useState('character'); 

    const getCharacterValue = async () => {
        SpeechRecognition.stopListening();
        if (textInput.length === 1 && mode === 'character') {
            setError(false);
            sendChar(textInput, () => {
                setTextInput(textInput);
                setDisplayedChar(textInput);
            });
        } else if (mode === 'word') {
            setError(false);
            sendWord(textInput.toLowerCase());
        } else {
            setError(true);
        }
    };

    const sendWord = async (word) => {
        const res = await axios.get(
            `http://localhost:3001/send-word?word=${word}`
        );

        if (res.status === 200) {
            console.log('sent', word, 'to the arduino');
            setTextInput(textInput);
            setDisplayedChar(textInput);
        }
    };

    const handleChange = (e) => {
        setTextInput(e.target.value);
    };

    const handleModeChange = (event) => {
        setMode(event.target.value);
        setError(false); 
    };

    const reset = () => {
        setTextInput('');
        setDisplayedChar('');
        setError(false);
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
            const res = await axios.get(
                `http://localhost:3001/get-letter?input=${input}`
            );
            console.log('HERE');
            setTextInput(res.data);
            sendChar(res.data, () => {
                setTextInput(res.data);
                setDisplayedChar(res.data);
            });
            setDisplayedChar(res.data);
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
                Display Braille
            </Typography>

            <FormControl sx={{ marginBottom: theme.spacing(2), minWidth: 120 }}>
                <InputLabel id="mode-select-label">Mode</InputLabel>
                <Select
                    labelId="mode-select-label"
                    id="mode-select"
                    value={mode}
                    onChange={handleModeChange}
                >
                    <MenuItem value="character">Character</MenuItem>
                    <MenuItem value="word">Word</MenuItem>
                </Select>
            </FormControl>

            <Box display='flex' justifyContent='center' alignItems='center'>
                <TextField
                    error={error}
                    helperText={
                        error
                            ? 'Input must be exactly one character'
                            : 'Character to display'
                    }
                    variant='outlined'
                    value={textInput}
                    onChange={handleChange}
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

            {displayedChar && (
                <Typography
                    variant='h5'
                    sx={{ padding: '1rem', marginTop: '1rem' }}
                >
                    The {mode} "{displayedChar}" is displayed.
                </Typography>
            )}
            <StyledButton type='button' id='next-btn' onClick={reset}>
                Next
            </StyledButton>
        </Box>
    );
}

export default Display;
