import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import theme from '../styles/theme';

function Navigation() {
    const location = useLocation();

    const modes = [
        { path: '/display', label: 'Display' },
        { path: '/practice', label: 'Practice' },
        { path: '/quiz', label: 'Quiz' },
        { path: '/modules', label: 'Modules' },
    ];

    return (
        <AppBar
            position='sticky'
            sx={{
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                top: 0,
                zIndex: 1000,
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', padding: '0.5rem 2rem' }}>
                <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* Home Button with Logo */}
                    <Button
                        component={Link}
                        to='/'
                        disableRipple
                        aria-label="Go to home page"
                        sx={{
                            fontSize: '1.4rem',
                            fontFamily: 'Roboto, sans-serif',
                            padding: '0.6rem 1rem',
                            minWidth: 'auto',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            textTransform: 'none',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(94, 103, 191, 0.08)',
                                border: 'none',
                            },
                        }}
                    >
                        <img 
                            src="/website_logo.svg" 
                            alt="Braillearn home"
                            style={{
                                height: '32px',
                                width: 'auto',
                                display: 'block',
                            }}
                        />
                    </Button>
                    
                    {/* Divider */}
                    <Box
                        sx={{
                            width: '1px',
                            height: '30px',
                            backgroundColor: '#e2e8f0',
                            margin: '0 0.5rem',
                        }}
                        aria-hidden="true"
                    />

                    {/* Mode Buttons */}
                    {modes.map((mode) => (
                        <Button
                            key={mode.path}
                            component={Link}
                            to={mode.path}
                            disableRipple
                            sx={{
                                fontSize: '1.4rem',
                                fontFamily: 'Roboto, sans-serif',
                                padding: '0.8rem 1.8rem',
                                backgroundColor:
                                    location.pathname.startsWith(mode.path)
                                        ? theme.palette.custom.buttonBackground
                                        : 'transparent',
                                color: location.pathname.startsWith(mode.path)
                                    ? 'white'
                                    : '#555',
                                border: 'none',
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: location.pathname.startsWith(mode.path)
                                    ? 600
                                    : 400,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor:
                                        location.pathname.startsWith(mode.path)
                                            ? theme.palette.custom.buttonHover
                                            : 'rgba(94, 103, 191, 0.08)',
                                    border: 'none',
                                },
                            }}
                        >
                            {mode.label}
                        </Button>
                    ))}
                </Box>
                <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Button
                        component={Link}
                        to='/about'
                        disableRipple
                        sx={{
                            color: '#555',
                            fontSize: '1.4rem',
                            fontFamily: 'Roboto, sans-serif',
                            padding: '0.8rem 1.8rem',
                            textTransform: 'none',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(94, 103, 191, 0.08)',
                            },
                        }}
                    >
                        About
                    </Button>
                    {/* <Button
                        component={Link}
                        to='/instructions'
                        disableRipple
                        sx={{
                            color: '#555',
                            fontSize: '1.4rem',
                            fontFamily: 'Roboto, sans-serif',
                            padding: '0.8rem 1.8rem',
                            textTransform: 'none',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(94, 103, 191, 0.08)',
                            },
                        }}
                    >
                        Instructions
                    </Button> */}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navigation;
