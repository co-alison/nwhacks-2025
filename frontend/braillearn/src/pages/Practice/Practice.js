import React, { useState, useEffect, useRef } from 'react';
import characters from '../../utils/characters';
import { states } from '../../utils/constants';
import StyledButton from '../../components/StyledButton';
import PageContainer from '../../components/PageContainer';
import StatusCard from '../../components/StatusCard';
import InstructionCard from '../../components/InstructionCard';
import { useStatusConfig } from '../../hooks/useStatusConfig';
import { sendChar } from '../../utils/serverApi';
import { startListeningWithTimer } from '../../utils/speechRecognition';

const Practice = () => {
    const [currentChar, setCurrentChar] = useState('');
    const [status, setStatus] = useState(states.display);
    const [charInput, setCharInput] = useState('');
    const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);
    const recognitionRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (status === states.display) {
            const char = getRandomChar();
            console.log('char: ', char);
            setCurrentChar(char);

            // send char to API
            sendChar(char, () => {
                setStatus(states.listen);
            });
            setStatus(states.listen);
        } else if (status === states.listen) {
            startListeningWithTimer(
                timerRef,
                recognitionRef,
                setStatus,
                setCharInput,
                currentChar,
                'letter'
            );
        } else if (status === states.correct) {
            speakText('Correct!');
        } else if (status === states.incorrect) {
            speakText(
                `Incorrect, the correct answer was: ${currentChar.toUpperCase()}`
            );
        } else if (status === states.retry) {
            speakText(
                "Sorry, we didn't catch that. Please say 'letter' before your answer, like 'letter A.'"
            );
        } else if (status === states.noInput) {
            speakText('No input received.');
        }

        return () => {};
    }, [status]);

    const getRandomChar = () => {
        const index = Math.floor(Math.random() * characters.length);
        return characters[index];
    };

    const reset = () => {
        const clear = '.';
        // sendChar(clear);
        setCurrentChar('');
        setCharInput('');
        clearTimeout(timerRef.current);
        setShowingCorrectAnswer(false);
        setStatus(states.display);
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;
        utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google US English') || null;
        speechSynthesis.speak(utterance);
    };

    const showCorrectAnswer = () => {
        speakText(`The correct answer was: ${currentChar.toUpperCase()}`);
        setShowingCorrectAnswer(true);
    };

    const statusConfig = useStatusConfig(status, charInput, currentChar);

    return (
        <PageContainer title="Practice Braille">
            <StatusCard
                statusConfig={statusConfig}
                status={status}
                showingCorrectAnswer={showingCorrectAnswer}
                correctAnswerText={currentChar.toUpperCase()}
                listenStates={[states.listen]}
            >
                {status === states.correct && (
                    <StyledButton 
                        onClick={reset}
                        sx={{
                            minWidth: '150px',
                            fontSize: '1.125rem',
                        }}
                    >
                        Next Character
                    </StyledButton>
                )}

                {status === states.incorrect && (
                    <StyledButton 
                        onClick={reset}
                        sx={{
                            minWidth: '150px',
                            fontSize: '1.125rem',
                        }}
                    >
                        Next Character
                    </StyledButton>
                )}

                {status === states.noInput && (
                    <>
                        <StyledButton 
                            onClick={showCorrectAnswer}
                            sx={{
                                minWidth: '180px',
                                fontSize: '1.125rem',
                            }}
                        >
                            Show Answer
                        </StyledButton>
                        <StyledButton 
                            onClick={reset}
                            sx={{
                                minWidth: '150px',
                                fontSize: '1.125rem',
                            }}
                        >
                            Next Character
                        </StyledButton>
                    </>
                )}

                {status === states.retry && (
                    <StyledButton 
                        onClick={() => setStatus(states.listen)}
                        sx={{
                            minWidth: '150px',
                            fontSize: '1.125rem',
                        }}
                    >
                        Try Again
                    </StyledButton>
                )}
            </StatusCard>

            <InstructionCard title="How to Practice">
                1. Feel the Braille character displayed on your device<br />
                2. When you hear "Listening", say "letter" followed by your answer<br />
                3. Get instant feedback on your response<br />
                4. Continue to the next character to keep practicing
            </InstructionCard>
        </PageContainer>
    );
};

export default Practice;
