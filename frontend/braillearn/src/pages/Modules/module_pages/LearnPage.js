import React from 'react';
import { Box, Typography } from '@mui/material';
import { sendChar } from '../../../utils/serverApi';

// INVARIANT: expects module.char to be a string that contains two quotation marks " ",
// between which contains the singular character to be displayed. I.e. for module.char = "lowercase "a""",
// the character displayed will be the single character "a".
const LearnPage = ({
    module
}) => {
    // TODO: do we want to repeatedly display and clear the same character?
    const charToSend = module.char[module.char.indexOf('"') + 1];
    sendChar(charToSend);

    return (
        <Box>
            <Typography variant='p' sx={{ fontSize: '1.5rem' }}>
                On this page, you will learn the character {module.char}, which
                is represented with {module.representation}. When you’re ready
                to proceed, tap the “Next” button.
            </Typography>
        </Box>
    );
};

export default LearnPage;
