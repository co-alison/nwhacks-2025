import React, { useState, useEffect, useRef } from 'react';
import BackButton from '../../components/BackButton';
import { states } from '../../utils/constants';
import StyledButton from '../../components/StyledButton';
import {
    Box,
    TextField,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import theme from '../../styles/theme';
import {
    sendChar,
    sendWord as sendWordToHardware,
} from '../../utils/serverApi';
import { startListeningWithTimer } from '../../utils/speechRecognition';

function Display() {
    const [textInput, setTextInput] = useState('');
    const [displayedChar, setDisplayedChar] = useState('');
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(false);
    const [mode, setMode] = useState('text');
    const [infoText, setInfoText] = useState(''); // TODO: make the info text dynamically display info like 'no input received' or 'error occurred'

    const recognitionRef = useRef(null);
    const timerRef = useRef(null);

    const sendInputValue = async () => {
        if (textInput.length === 1) {
            setError(false);
            sendChar(textInput, () => {
                setTextInput(textInput);
                setDisplayedChar(textInput);
                speakText(`${textInput} is being displayed`);
            });
        } else if (textInput.length > 1) {
            setError(false);
            sendWord(textInput.toLowerCase());
        } else {
            setError(true);
        }
    };

    const sendWord = async (word) => {
        setDisplayedChar(textInput);
        speakText(`${textInput} is being displayed`);
        const res = await sendWordToHardware(word);
        if (res.status === 200) {
            console.log('sent', word, 'to the arduino');
            setTextInput(textInput);
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
        console.log('status: ', status);
    };

    useEffect(() => {
        // TODO: bug - sometimes when you speak incoherently, no status is set,no error messages are sent,
        // you just get 'start', 'speech end', and 'stop' output to the console.
        // After that, hitting the 'listen for new input' button doesn't restart the speech recognition

        console.log('status has changed to ', status);
        if (status === states.listen) {
            startListeningWithTimer(
                timerRef,
                recognitionRef,
                setStatus,
                setTextInput,
                '' // TODO: fix this 'properly' - hack to get startListeningWithTimer to work w/o currentChar input
            );
        } else if (status === states.display) {
            if (textInput) {
                if (textInput.length === 1) {
                    sendChar(textInput, () => {
                        setDisplayedChar(textInput);
                    });
                } else {
                    sendWord(textInput);
                }
                setInfoText(`${textInput} is being displayed`);
            } else {
                console.error('Unexpected empty text input');
            }
        } else if (status === states.noInput) {
            setInfoText('No input received.');
            speakText('No input received.');
        } else {
            setInfoText('An error occurred, please refresh and try again.');
            console.log('state == ', status);
        }
    }, [status]);

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            console.log('enter button');
            sendInputValue();
        }
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;
        speechSynthesis.speak(utterance);
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
                Display Braille
            </Typography>

            <FormControl sx={{ marginBottom: theme.spacing(2), minWidth: 120 }}>
                <InputLabel id='mode-select-label'></InputLabel>
                <Select
                    labelId='mode-select-label'
                    id='mode-select'
                    value={mode}
                    onChange={handleModeChange}
                >
                    <MenuItem value='speech'>Speech</MenuItem>
                    <MenuItem value='text'>Text</MenuItem>
                </Select>
            </FormControl>

            {mode === 'text' && (
                <Typography
                    variant='h6'
                    sx={{ padding: '1rem', marginTop: '1rem' }}
                >
                    Type the character or word you want to display.
                </Typography>
            )}

            <Box display='flex' justifyContent='center' alignItems='center'>
                {mode === 'text' && (
                    <TextField
                        error={error}
                        helperText={
                            error
                                ? 'Unexpected Error'
                                : 'Character or word to display'
                        }
                        variant='outlined'
                        value={textInput}
                        onChange={handleChange}
                        onKeyPress={onKeyPress}
                        sx={{
                            marginTop: '1rem',
                            padding: '1rem',
                            height: '3rem',
                        }}
                    />
                )}
            </Box>

            {displayedChar && (
                <Typography
                    variant='h5'
                    sx={{ padding: '1rem', marginTop: '1rem' }}
                >
                    "{displayedChar}" is being displayed.
                </Typography>
            )}
            {mode === 'speech' ? (
                <StyledButton
                    key='speech'
                    type='button'
                    id='display-btn'
                    onClick={reset}
                >
                    Listen for new input
                </StyledButton>
            ) : (
                <StyledButton
                    key='text'
                    type='button'
                    id='display-btn'
                    onClick={sendInputValue}
                >
                    Display
                </StyledButton>
            )}
        </Box>
    );
}

export default Display;
