import React, { useState, useEffect, useRef } from 'react';
import { states } from '../../utils/constants';
import StyledButton from '../../components/StyledButton';
import {
    Box,
    TextField,
    Typography,
    Container,
    Card,
    CardContent,
    ToggleButton,
    ToggleButtonGroup,
    Chip,
    LinearProgress,
} from '@mui/material';
import { Keyboard, Mic, VolumeUp, Info, CheckCircle, Cancel, Refresh } from '@mui/icons-material';
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
    const [speechInputType, setSpeechInputType] = useState('letter');
    const [infoText, setInfoText] = useState('');

    const recognitionRef = useRef(null);
    const timerRef = useRef(null);

    const sendInputValue = async () => {
        if (textInput.length === 1) {
            setError(false);
            setDisplayedChar(textInput);
            speakText(`Letter ${textInput.toUpperCase()} is being displayed`);
            sendChar(textInput);
            setTextInput('');
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

    const handleModeChange = (event, newMode) => {
        if (newMode !== null) {
            setMode(newMode);
            setError(false);
            setTextInput('');
            setDisplayedChar('');
            setInfoText('');
            setStatus(null);
        }
    };

    const reset = () => {
        setTextInput('');
        setDisplayedChar('');
        setError(false);
        setInfoText('');
        setStatus(states.listen);
        console.log('status: ', status);
    };

    useEffect(() => {
        console.log('status has changed to ', status);
        if (status === states.listen) {
            startListeningWithTimer(
                timerRef,
                recognitionRef,
                setStatus,
                setTextInput,
                '',
                speechInputType,
                setDisplayedChar
            );
        } else if (status === states.display) {
            console.log('Displaying input: ', textInput);
            if (textInput) {
                sendInputValue();
            } else {
                console.error('Unexpected empty text input');
            }
        } else if (status === states.noInput) {
            setInfoText('No input received.');
            speakText('No input received.');
        } else if (status === states.retry) {
            speakText(
                "Sorry, we didn't catch that. Please say 'letter' before your answer, like 'letter A.'"
            );
        } else if (status && status !== states.listen && status !== states.display) {
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
        utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google US English') || null;
        speechSynthesis.speak(utterance);
    };

    const getStatusConfig = () => {
        switch (status) {
            case states.listen:
                return {
                    icon: <Mic sx={{ fontSize: '4rem' }} />,
                    title: 'Listening',
                    subtitle: speechInputType === 'letter' 
                        ? 'Say "letter" followed by your answer (e.g., "letter A")'
                        : 'Speak a complete word clearly',
                    color: '#5e67bf',
                    bgColor: 'rgba(94, 103, 191, 0.1)',
                    showProgress: true,
                };
            case states.display:
                return {
                    icon: <VolumeUp sx={{ fontSize: '4rem' }} />,
                    title: 'Displaying',
                    subtitle: `"${displayedChar}" is being displayed`,
                    color: '#10b981',
                    bgColor: 'rgba(16, 185, 129, 0.1)',
                };
            case states.noInput:
                return {
                    icon: <Cancel sx={{ fontSize: '4rem' }} />,
                    title: 'No Input Received',
                    subtitle: 'We didn\'t hear a response',
                    color: '#f59e0b',
                    bgColor: 'rgba(245, 158, 11, 0.1)',
                };
            case states.retry:
                return {
                    icon: <Refresh sx={{ fontSize: '4rem' }} />,
                    title: 'We Didn\'t Catch That',
                    subtitle: `Please say "letter" before your answer (e.g., "letter A")`,
                    color: '#f59e0b',
                    bgColor: 'rgba(245, 158, 11, 0.1)',
                };
            default:
                return null;
        }
    };

    const statusConfig = getStatusConfig();

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 70px)',
                background: 'linear-gradient(135deg, #f8f9fc 0%, #e8ecf7 100%)',
                paddingBottom: '4rem',
            }}
        >
            <Container maxWidth="md">
                <Box
                    component="main"
                    role="main"
                    sx={{
                        paddingTop: '2rem',
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '2rem',
                        }}
                    >
                        <Typography
                            variant='h4'
                            component="h1"
                            sx={{
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                fontWeight: 700,
                                color: '#1a1a1a',
                                textAlign: 'center',
                                flex: 1,
                            }}
                        >
                            Display Braille
                        </Typography>
                        <Box sx={{ width: '100px' }} />
                    </Box>

                    {/* Mode Toggle Card */}
                    <Card
                        sx={{
                            borderRadius: '12px',
                            marginBottom: '1.5rem',
                            backgroundColor: '#ffffff',
                            border: '2px solid #e2e8f0',
                        }}
                    >
                        <CardContent sx={{ padding: '1.5rem', textAlign: 'center' }}>
                            <Typography
                                variant="h6"
                                component="h2"
                                sx={{
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    color: '#1a1a1a',
                                    marginBottom: '1rem',
                                }}
                            >
                                Choose Input Method
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ToggleButtonGroup
                                    value={mode}
                                    exclusive
                                    onChange={handleModeChange}
                                    aria-label="input method"
                                    sx={{
                                        '& .MuiToggleButtonGroup-grouped': {
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '8px !important',
                                            margin: '0 0.5rem',
                                            padding: '0.75rem 1.5rem',
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                            '&.Mui-selected': {
                                                backgroundColor: theme.palette.custom.buttonBackground,
                                                color: '#ffffff',
                                                borderColor: theme.palette.custom.buttonBackground,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.custom.buttonHover,
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <ToggleButton value="text" aria-label="text input">
                                        <Keyboard sx={{ marginRight: '0.5rem' }} />
                                        Text Input
                                    </ToggleButton>
                                    <ToggleButton value="speech" aria-label="speech input">
                                        <Mic sx={{ marginRight: '0.5rem' }} />
                                        Speech Input
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Main Card */}
                    <Card
                        sx={{
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            border: '2px solid #e2e8f0',
                            overflow: 'visible',
                        }}
                    >
                        <CardContent
                            sx={{
                                padding: { xs: '2rem', md: '2.5rem' },
                                textAlign: 'center',
                            }}
                        >
                            {mode === 'speech' ? (
                                // Speech Mode - Match Practice Page Design
                                <>
                                    {statusConfig ? (
                                        // Active status (listening, displaying, etc.)
                                        <>
                                            {/* Status Icon */}
                                            <Box
                                                sx={{
                                                    width: '120px',
                                                    height: '120px',
                                                    borderRadius: '50%',
                                                    background: statusConfig.bgColor,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 2rem',
                                                    color: statusConfig.color,
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
                                                {statusConfig.icon}
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
                                                {statusConfig.title}
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
                                                {statusConfig.subtitle}
                                            </Typography>

                                            {/* Progress Bar for Listening */}
                                            {statusConfig.showProgress && (
                                                <Box sx={{ width: '100%', marginTop: '2rem', marginBottom: '2rem' }}>
                                                    <LinearProgress
                                                        sx={{
                                                            height: '8px',
                                                            borderRadius: '4px',
                                                            backgroundColor: '#e2e8f0',
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: statusConfig.color,
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </>
                                    ) : (
                                        // Initial state - no active status
                                        <>
                                            {/* Icon */}
                                            <Box
                                                sx={{
                                                    width: '120px',
                                                    height: '120px',
                                                    borderRadius: '50%',
                                                    background: 'rgba(94, 103, 191, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 1.5rem',
                                                    color: theme.palette.custom.buttonBackground,
                                                }}
                                                aria-hidden="true"
                                            >
                                                <Mic sx={{ fontSize: '4rem' }} />
                                            </Box>

                                            {/* Instructions */}
                                            <Typography
                                                variant="h5"
                                                component="h2"
                                                sx={{
                                                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                                                    fontWeight: 600,
                                                    color: '#1a1a1a',
                                                    marginBottom: '0.75rem',
                                                }}
                                            >
                                                {speechInputType === 'letter' 
                                                    ? 'Speak a Single Letter'
                                                    : 'Speak a Word'}
                                            </Typography>

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
                                                {speechInputType === 'letter'
                                                    ? 'Say "letter" followed by a single character (e.g., "letter A")'
                                                    : 'Click the button and speak a complete word clearly'}
                                            </Typography>
                                        </>
                                    )}

                                    {/* Speech Input Type Toggle */}
                                    {(status === states.display || status === states.noInput || status === states.retry || !status) && (
                                        <Box sx={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                            <ToggleButtonGroup
                                                value={speechInputType}
                                                exclusive
                                                onChange={(event, newType) => {
                                                    if (newType !== null) {
                                                        setSpeechInputType(newType);
                                                        setTextInput('');
                                                        setDisplayedChar('');
                                                        setInfoText('');
                                                        setStatus(null);
                                                    }
                                                }}
                                                aria-label="speech input type"
                                                size="small"
                                                sx={{
                                                    '& .MuiToggleButtonGroup-grouped': {
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '6px !important',
                                                        margin: '0 0.25rem',
                                                        padding: '0.5rem 1rem',
                                                        fontSize: '0.875rem',
                                                        textTransform: 'none',
                                                        '&.Mui-selected': {
                                                            backgroundColor: theme.palette.custom.buttonBackground,
                                                            color: '#ffffff',
                                                            borderColor: theme.palette.custom.buttonBackground,
                                                            '&:hover': {
                                                                backgroundColor: theme.palette.custom.buttonHover,
                                                            },
                                                        },
                                                    },
                                                }}
                                            >
                                                <ToggleButton value="letter" aria-label="single letter">
                                                    Single Letter
                                                </ToggleButton>
                                                <ToggleButton value="word" aria-label="word">
                                                    Word
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </Box>
                                    )}

                                    {/* Action Buttons */}
                                    <Box
                                        sx={{
                                            marginTop: '1.5rem',
                                            display: 'flex',
                                            gap: '1rem',
                                            justifyContent: 'center',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        {(status === states.display || status === states.noInput) && (
                                            <StyledButton
                                                onClick={reset}
                                                sx={{
                                                    minWidth: '200px',
                                                    fontSize: '1.125rem',
                                                }}
                                            >
                                                <Mic sx={{ marginRight: '0.5rem' }} />
                                                Listen Again
                                            </StyledButton>
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

                                        {!status && (
                                            <StyledButton
                                                type='button'
                                                id='display-btn'
                                                onClick={reset}
                                                sx={{
                                                    minWidth: '200px',
                                                    fontSize: '1.125rem',
                                                }}
                                            >
                                                <Mic sx={{ marginRight: '0.5rem' }} />
                                                Listen for Input
                                            </StyledButton>
                                        )}
                                    </Box>
                                </>
                            ) : (
                                // Text Mode - Original Design
                                <>
                                    {/* Icon */}
                                    <Box
                                        sx={{
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            background: 'rgba(94, 103, 191, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 1.5rem',
                                            color: theme.palette.custom.buttonBackground,
                                        }}
                                        aria-hidden="true"
                                    >
                                        <Keyboard sx={{ fontSize: '3rem' }} />
                                    </Box>

                                    {/* Instructions */}
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        sx={{
                                            fontSize: { xs: '1.5rem', md: '1.75rem' },
                                            fontWeight: 600,
                                            color: '#1a1a1a',
                                            marginBottom: '0.75rem',
                                        }}
                                    >
                                        Type Your Character or Word
                                    </Typography>

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
                                        Enter a single character or a complete word
                                    </Typography>

                                    {/* Text Input Field */}
                                    <Box sx={{ maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                                        <TextField
                                            error={error}
                                            helperText={
                                                error
                                                    ? 'Please enter a character or word'
                                                    : ''
                                            }
                                            variant='outlined'
                                            value={textInput}
                                            onChange={handleChange}
                                            onKeyPress={onKeyPress}
                                            fullWidth
                                            autoFocus
                                            placeholder="Type here..."
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    fontSize: '1.25rem',
                                                    padding: '0.25rem',
                                                    borderRadius: '8px',
                                                    '&:hover fieldset': {
                                                        borderColor: theme.palette.custom.buttonBackground,
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: theme.palette.custom.buttonBackground,
                                                        borderWidth: '2px',
                                                    },
                                                },
                                                '& .MuiFormHelperText-root': {
                                                    fontSize: '1rem',
                                                },
                                            }}
                                            inputProps={{
                                                'aria-label': 'Character or word to display',
                                            }}
                                        />
                                    </Box>

                                    {/* Display Status */}
                                    {displayedChar && (
                                        <Box sx={{ marginBottom: '1.5rem' }}>
                                            <Chip
                                                icon={<VolumeUp />}
                                                label={`"${displayedChar}" is being displayed`}
                                                sx={{
                                                    fontSize: '1.125rem',
                                                    padding: '1.5rem 1rem',
                                                    height: 'auto',
                                                    backgroundColor: '#10b98115',
                                                    color: '#059669',
                                                    fontWeight: 600,
                                                    border: '2px solid #10b981',
                                                }}
                                            />
                                        </Box>
                                    )}

                                    {/* Action Button */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <StyledButton
                                            type='button'
                                            id='display-btn'
                                            onClick={sendInputValue}
                                            sx={{
                                                minWidth: '200px',
                                                fontSize: '1.125rem',
                                            }}
                                        >
                                            <VolumeUp sx={{ marginRight: '0.5rem' }} />
                                            Display Braille
                                        </StyledButton>
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Instructions Card */}
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
                                How to Use Display Mode
                            </Typography>
                            <Typography
                                variant="body2"
                                component="div"
                                sx={{
                                    fontSize: '1rem',
                                    color: '#4a5568',
                                    lineHeight: 1.6,
                                }}
                            >
                                <strong>Text Input:</strong>
                                <br />
                                1. Type any character (a-z) or word in the text field
                                <br />
                                2. Press Enter or click "Display Braille"
                                <br />
                                3. Feel the Braille output on your device
                                <br />
                                <br />
                                <strong>Speech Input:</strong>
                                <br />
                                1. Choose "Single Letter" or "Word" mode
                                <br />
                                2. Click "Listen for Input"
                                <br />
                                3. For letters: Say "letter" followed by a character (e.g., "letter A")
                                <br />
                                4. For words: Speak the complete word clearly
                                <br />
                                5. The system will display your input in Braille
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}

export default Display;
