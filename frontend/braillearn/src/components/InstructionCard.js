import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

/**
 * InstructionCard - Reusable card for displaying instructions
 * 
 * @param {string} title - Card title
 * @param {React.ReactNode} children - Instruction content
 */
const InstructionCard = ({ title, children }) => {
    return (
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
                    {title}
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
                    {children}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default InstructionCard;
