import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ModuleOverviewPage = () => {
    return (
        <Card
            sx={{
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '2px solid #5e67bf',
            }}
        >
            <CardContent sx={{ padding: '2rem' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontSize: '1.125rem',
                            lineHeight: 1.8,
                            color: '#4a5568',
                        }}
                    >
                        Each Module begins with an <strong>Introduction page</strong> explaining the
                        characters covered in the module. The Introduction page will
                        be followed by a series of Learn, Practice Quiz, and Quiz
                        pages.
                    </Typography>

                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontSize: '1.125rem',
                            lineHeight: 1.8,
                            color: '#4a5568',
                        }}
                    >
                        On each <strong>Learn page</strong>, the character being taught will appear
                        on the braille display. Place your finger over the braille
                        display to feel the character. Stay on each Learn page as
                        long as you need to become familiar with the character. When
                        you're ready to proceed, you can tap the "Next" button.
                    </Typography>

                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontSize: '1.125rem',
                            lineHeight: 1.8,
                            color: '#4a5568',
                        }}
                    >
                        After a few characters are introduced, there will be a
                        <strong> Practice Quiz</strong>. During the practice quiz, the braille display
                        will show a character. Guess what the character is by
                        speaking your answer into the microphone. Be sure to say the
                        word "letter" before your answer. After you get each
                        character correct 3 times, the "Next" button will appear and
                        you can proceed.
                    </Typography>

                    <Typography 
                        variant="body1" 
                        sx={{ 
                            fontSize: '1.125rem',
                            lineHeight: 1.8,
                            color: '#4a5568',
                        }}
                    >
                        At the end of each module, there will be a <strong>Quiz</strong>. The quiz
                        will contain a pre-determined number of questions and you
                        will only be tested on each character once. Again, you will
                        guess what the character is by speaking your answer into the
                        microphone. You must achieve a certain score to pass the
                        quiz and continue.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ModuleOverviewPage;
