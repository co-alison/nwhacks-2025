import { createTheme } from '@mui/material';

const theme = createTheme({
    typography: {
        h4: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        h5: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h6: {
            fontSize: '1.75rem',
            fontWeight: 500,
        },
        h7: {
            fontSize: '3rem',
            fontWeight: 700,
            fontFamily: "'Roboto', sans-serif",
            background: 'linear-gradient(90deg,rgb(142, 198, 247), #5e67bf)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        },
        p: {
            component: 'p',
            variant: 'body1',
            fontSize: '1rem',
        },
    },
    palette: {
        custom: {
            buttonBackground: '#5e67bf',
            buttonHover: '#4b539c',
        },
    },
});

export default theme;
