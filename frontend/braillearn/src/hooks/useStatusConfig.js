import { Mic, CheckCircle, Cancel, VolumeUp, Refresh } from '@mui/icons-material';
import { states } from '../utils/constants';

/**
 * Hook to get standardized status configuration for practice/quiz/display modes
 * 
 * @param {string} status - Current status state
 * @param {string} charInput - User's input character
 * @param {string} currentChar - Correct character
 * @param {string} displayedChar - Currently displayed character
 * @returns {Object|null} Status configuration object or null
 */
export const useStatusConfig = (status, charInput = '', currentChar = '', displayedChar = '') => {
    switch (status) {
        case states.display:
            return {
                icon: <VolumeUp sx={{ fontSize: '3rem' }} />,
                title: 'Displaying Character',
                // subtitle: displayedChar 
                //     ? `"${displayedChar.toUpperCase()}" is being displayed`
                //     : 'Feel the braille pattern on your device',
                color: '#5e67bf',
                bgColor: 'rgba(94, 103, 191, 0.1)',
            };
        case states.listen:
            return {
                icon: <Mic sx={{ fontSize: '3rem' }} />,
                title: 'Listening',
                subtitle: 'Say "letter" followed by your answer (e.g., "letter A")',
                color: '#5e67bf',
                bgColor: 'rgba(94, 103, 191, 0.1)',
                showProgress: true,
            };
        case states.correct:
            return {
                icon: <CheckCircle sx={{ fontSize: '3rem' }} />,
                title: 'Correct!',
                subtitle: charInput 
                    ? `You said: ${charInput.toUpperCase()}`
                    : 'Great job!',
                color: '#10b981',
                bgColor: 'rgba(16, 185, 129, 0.1)',
                correctAnswer: null,
            };
        case states.incorrect:
            return {
                icon: <Cancel sx={{ fontSize: '3rem' }} />,
                title: 'Incorrect',
                subtitle: charInput && currentChar
                    ? `You said: ${charInput.toUpperCase()}. The correct answer was: ${currentChar.toUpperCase()}`
                    : 'Try again next time',
                color: '#ef4444',
                bgColor: 'rgba(239, 68, 68, 0.1)',
                correctAnswer: currentChar ? currentChar.toUpperCase() : null,
            };
        case states.retry:
            return {
                icon: <Refresh sx={{ fontSize: '3rem' }} />,
                title: 'Try Again',
                subtitle: 'Say "letter" before your answer (e.g., "letter A")',
                color: '#f59e0b',
                bgColor: 'rgba(245, 158, 11, 0.1)',
            };
        case states.noInput:
            return {
                icon: <Mic sx={{ fontSize: '3rem' }} />,
                title: 'No Input Received',
                subtitle: "We didn't hear anything",
                color: '#6b7280',
                bgColor: 'rgba(107, 114, 128, 0.1)',
            };
        default:
            return null;
    }
};
