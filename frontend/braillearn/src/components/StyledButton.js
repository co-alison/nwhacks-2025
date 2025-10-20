import React from 'react';
import { Button } from '@mui/material';
import theme from '../styles/theme';

const StyledButton = ({ children, onClick, sx, ...props }) => {
    return (
        <Button
            variant='contained'
            sx={{
                fontSize: '1.125rem',
                fontWeight: 500,
                backgroundColor: theme.palette.custom.buttonBackground,
                color: '#ffffff',
                padding: '0.875rem 2rem',
                minWidth: '120px',
                height: 'auto',
                marginTop: '0',
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: '0 4px 6px rgba(94, 103, 191, 0.25)',
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: theme.palette.custom.buttonHover,
                    boxShadow: '0 6px 12px rgba(94, 103, 191, 0.35)',
                    transform: 'translateY(-2px)',
                },
                '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: '0 2px 4px rgba(94, 103, 191, 0.25)',
                },
                '&:focus-visible': {
                    outline: '4px solid #5e67bf',
                    outlineOffset: '3px',
                    boxShadow: '0 6px 12px rgba(94, 103, 191, 0.35)',
                },
                ...sx,
            }}
            onClick={onClick}
            {...props}
        >
            {children}
        </Button>
    );
};

export default StyledButton;
