import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, Button } from '@mui/material';
import theme from '../../styles/theme';
import BraillearnLogo from '../../braillearn_title.svg';

function Home() {
    const [mode, setMode] = useState('practice');
    const navigate = useNavigate();

    const handleStart = () => {
        if (mode === 'display') {
            navigate('/display');
        } else if (mode === 'practice') {
            navigate('/practice');
        } else if (mode === 'quiz') {
            navigate('/quiz');
        } else if (mode === 'modules') {
            navigate('/modules');
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
            <header style={{ marginTop: "10rem", marginBottom: "2rem" }}>
                <ThemeProvider theme={theme}>
                    <img
                        src={BraillearnLogo}
                        alt='Braillearn Logo'
                        style={{ width: '30rem', height: 'auto' }} 
                    />
                </ThemeProvider>
                <div
                    style={{
                        fontSize: '1.9rem',
                        margin: '2rem 0',
                        fontFamily: 'Roboto, sans-serif',
                    }}
                >
                    <p>
                        Welcome to Braillearn, an interactive platform for
                        learning and practicing Braille.
                    </p>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                    <label
                        htmlFor='mode'
                        style={{ fontSize: '1.8rem', marginRight: '1rem' }}
                    >
                        Choose Mode:{' '}
                    </label>
                    <select
                        id='mode'
                        name='mode'
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        style={{ fontSize: '1.8rem', padding: '0.5rem' }}
                    >
                        <option value='practice'>Practice</option>
                        <option value='display'>Display</option>
                        <option value='quiz'>Quiz</option>
                        <option value='modules'>Modules</option>
                    </select>
                </div>
                <div>
                    <Button
                        onClick={handleStart}
                        variant='outlined'
                        sx={{
                            fontSize: '1.8rem',
                            color: theme.palette.custom.buttonBackground,
                            padding: '1rem',
                            width: '8rem',
                            height: '3.5rem',
                        }}
                    >
                        Start
                    </Button>
                </div>
            </header>
        </div>
    );
}

export default Home;
