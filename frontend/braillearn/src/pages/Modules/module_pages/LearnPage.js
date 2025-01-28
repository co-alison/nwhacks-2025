import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, ThemeProvider, Button } from '@mui/material';
import theme from '../../../styles/theme';
import BackButton from '../../../components/BackButton';
import { sendChar } from '../../../utils/serverApi';

// INVARIANT: expects module.char to be a string that contains two quotation marks " ",
// between which contains the singular character to be displayed. I.e. for module.char = "lowercase "a""",
// the character displayed will be the single character "a".
const LearnPage = ({
    module /*isCompleted, onComplete*/,
    // char,
    // representation,
}) => {
    // TODO: do we want to repeatedly display and clear the same character?
    // useEffect(() => {
    //     let isCancelled = false; // To handle cleanup when the user exits this page

    //     const displayAndClearChar = async () => {
    //         if (isCancelled) return;

    //         // Send the first character
    //         await sendChar(module.char);

    //         // Wait for 2 seconds
    //         setTimeout(async () => {
    //             if (isCancelled) return;

    //             // Clear the character
    //             await sendChar('.');

    //             // Wait for 1 second, then repeat the cycle
    //             setTimeout(() => {
    //                 if (!isCancelled) displayAndClearChar();
    //             }, 1000);
    //         }, 2000);
    //     };

    //     displayAndClearChar(); // Start the sequence

    //     // Cleanup function to stop the cycle
    //     return () => {
    //         isCancelled = true;
    //     };
    // }, [module.char]); // Dependency array ensures the character is up-to-date

    const charToSend = module.char[module.char.indexOf('"') + 1];
    sendChar(charToSend);

    return (
        <Box>
            <Typography variant='p'>
                On this page, you will learn the character {module.char}, which
                is represented with {module.representation}. Place your finger
                over the braille display to feel the character
                {/* appear and
                reappear*/}
                . When you’re ready to proceed, tap the “Next” button.
            </Typography>
            {/* <button onClick={onComplete} disabled={isCompleted}>
            {isCompleted ? 'Completed' : 'Mark as Complete'}
        </button> */}
        </Box>
    );
};

export default LearnPage;
