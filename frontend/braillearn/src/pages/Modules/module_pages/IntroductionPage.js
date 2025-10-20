import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const IntroductionPage = ({ module }) => {
    const reviews = module.charsReviewed
        ? ` and reviews characters ${module.charsReviewed}`
        : '';
    const description = `This module covers the characters ${module.charsCovered}${reviews}.`;

    return (
        <Card
            sx={{
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '2px solid #10b981',
            }}
        >
            <CardContent sx={{ padding: '2rem' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontSize: '1.125rem',
                            lineHeight: 1.8,
                            color: '#4a5568',
                        }}
                    >
                        {description}
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontSize: '1.125rem',
                            lineHeight: 1.8,
                            color: '#4a5568',
                        }}
                    >
                        {module.charDescription}
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontSize: '1.125rem',
                            lineHeight: 1.8,
                            color: '#4a5568',
                        }}
                    >
                        When you're ready to proceed, tap the "Next" button.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default IntroductionPage;
