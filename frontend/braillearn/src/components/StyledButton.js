import React from 'react';
import { Button } from '@mui/material';
import theme from '../styles/theme';

const StyledButton = ({ children, onClick, ...props }) => {
    return (
        <Button
            variant='outlined'
            sx={{
                fontSize: '1.5rem',
                color: theme.palette.custom.buttonBackground,
                padding: '1rem',
                minWidth: '6rem',
                height: '3rem',
                marginTop: '2rem',
            }}
            onClick={onClick}
            {...props}
        >
            {children}
        </Button>
    );
};

export default StyledButton;
