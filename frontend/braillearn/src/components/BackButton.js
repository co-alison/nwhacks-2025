import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import theme from '../styles/theme';

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('../');
    };

    return (
        <Button
            variant='contained'
            sx={{
                backgroundColor: theme.palette.custom.buttonBackground,
                color: '#fff',
                fontSize: '1.5rem',
                padding: '0.5rem 1rem', 
                height: '2.5rem', 
                borderRadius: '8px',
                '&:hover': {
                    backgroundColor: theme.palette.custom.buttonHover,
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
        >
            Back
        </Button>
    );
};

export default BackButton;
