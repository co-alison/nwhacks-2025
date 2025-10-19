import { createTheme } from '@mui/material';

const theme = createTheme({
    typography: {
        h1: {
            fontSize: '3.5rem',
            fontWeight: 700,
            color: '#1a1a1a',
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2.8rem',
            fontWeight: 700,
            color: '#1a1a1a',
        },
        h3: {
            fontSize: '2.2rem',
            fontWeight: 600,
            color: '#1a1a1a',
        },
        h4: {
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1a1a1a',
        },
        h5: {
            fontSize: '2rem',
            fontWeight: 600,
            color: '#1a1a1a',
        },
        h6: {
            fontSize: '1.75rem',
            fontWeight: 500,
            color: '#1a1a1a',
        },
        h7: {
            fontSize: '3rem',
            fontWeight: 700,
            fontFamily: "'Roboto', sans-serif",
            background: 'linear-gradient(90deg,rgb(142, 198, 247), #5e67bf)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        },
        body1: {
            fontSize: '1.125rem',
            lineHeight: 1.7,
            color: '#2d3748',
        },
        body2: {
            fontSize: '1rem',
            lineHeight: 1.6,
            color: '#4a5568',
        },
    },
    palette: {
        primary: {
            main: '#5e67bf',
            light: '#8e9dd9',
            dark: '#4b539c',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#8ec6f7',
            light: '#b8dcf9',
            dark: '#6ba7d8',
            contrastText: '#1a1a1a',
        },
        text: {
            primary: '#1a1a1a',
            secondary: '#4a5568',
        },
        background: {
            default: '#ffffff',
            paper: '#f8f9fc',
        },
        custom: {
            buttonBackground: '#5e67bf',
            buttonHover: '#4b539c',
            gradient: 'linear-gradient(135deg, #8ec6f7 0%, #5e67bf 100%)',
            cardBackground: '#ffffff',
            border: '#e2e8f0',
        },
    },
});

export default theme;
