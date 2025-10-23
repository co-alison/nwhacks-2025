import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Keyboard } from '@mui/icons-material';
import { sendChar } from '../../../utils/serverApi';
import theme from '../../../styles/theme';

// INVARIANT: expects module.char to be a string that contains two quotation marks " ",
// between which contains the singular character to be displayed. I.e. for module.char = "lowercase "a""",
// the character displayed will be the single character "a".
const LearnPage = ({ module }) => {
    const charToSend = module.char[module.char.indexOf('"') + 1];

    useEffect(() => {
        sendChar(charToSend);
        return () => {
            sendChar('.');
        };
    }, [charToSend]);

    return (
        <Card
            sx={{
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '2px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
        >
            <CardContent sx={{ padding: { xs: '1.5rem', md: '2rem' }, textAlign: 'center' }}>
                <Box
                    sx={{
                        width: '80px',
                        height: '80px',
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

                <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                        fontWeight: 600,
                        color: '#1a1a1a',
                        marginBottom: '1rem',
                    }}
                >
                    Learning: {charToSend.toUpperCase()}
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        lineHeight: 1.8,
                        color: '#4a5568',
                        marginBottom: '1rem',
                    }}
                >
                    Feel the braille character displayed on your device. This represents the letter <strong>{charToSend.toUpperCase()}</strong>.
                </Typography>

                {module.representation && (
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            fontStyle: 'italic',
                        }}
                    >
                        Braille pattern: {module.representation}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default LearnPage;
