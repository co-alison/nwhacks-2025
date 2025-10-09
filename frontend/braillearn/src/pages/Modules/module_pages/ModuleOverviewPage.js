import React from 'react';
import { Box, Typography, ThemeProvider } from '@mui/material';
import theme from '../../../styles/theme';

const ModuleOverviewPage = ({ module }) => {
    return (
        <Box>
            <ThemeProvider theme={theme}>
                <Typography sx={{ fontSize: '1.5rem' }}>
                    Each Module begins with an Introduction page explaining the
                    characters covered in the module. The Introduction page will
                    be followed by a series of Learn, Practice Quiz, and Quiz
                    pages.
                </Typography>
                <Typography sx={{ fontSize: '1.5rem' }}>
                    On each Learn page, the character being taught will appear
                    on the braille display. Place your finger over the braille
                    display to feel the character. Stay on each Learn page as
                    long as you need to become familiar with the character. When
                    you’re ready to proceed, you can tap the “Next” button.
                </Typography>
                <Typography sx={{ fontSize: '1.5rem' }}>
                    After a few characters are introduced, there will be a
                    Practice Quiz. During the practice quiz, the braille display
                    will show a character. Guess what the character is by
                    speaking your answer into the microphone. Be sure to say the
                    word "letter" before your answer. After you get each
                    character correct 3 times, the “Next” button will appear and
                    you can proceed.
                </Typography>
                <Typography sx={{ fontSize: '1.5rem' }}>
                    At the end of each module, there will be a Quiz. The quiz
                    will contain a pre-determined number of questions and you
                    will only be tested on each character once. Again, you will
                    guess what the character is by speaking your answer into the
                    microphone. You must achieve a certain score to pass the
                    quiz and continue.
                </Typography>
            </ThemeProvider>
        </Box>
    );
};

export default ModuleOverviewPage;
