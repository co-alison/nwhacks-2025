import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { sendChar } from '../../../utils/serverApi';

// INVARIANT: expects module.char to be a string that contains two quotation marks " ",
// between which contains the singular character to be displayed. I.e. for module.char = "lowercase "a""",
// the character displayed will be the single character "a".
const LearnPage = ({ module }) => {
    const charToSend = module.char[module.char.indexOf('"') + 1];
    sendChar(charToSend);

    return (
        <Card
            sx={{
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '2px solid #3b82f6',
            }}
        >
            <CardContent sx={{ padding: '2rem' }}>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        fontSize: '1.125rem',
                        lineHeight: 1.8,
                        color: '#4a5568',
                    }}
                >
                    On this page, you will learn the character <strong>{module.char}</strong>, which
                    is represented with <strong>{module.representation}</strong>. When you're ready
                    to proceed, tap the "Next" button.
                </Typography>
            </CardContent>
        </Card>
    );
};

export default LearnPage;
