import React, { useState, useEffect, useRef } from 'react';
import characters from '../../utils/characters';
import { states } from '../../utils/constants';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import StyledButton from '../../components/StyledButton';
import CustomNumberInput from '../../components/NumberPicker';
import PageContainer from '../../components/PageContainer';
import StatusCard from '../../components/StatusCard';
import InstructionCard from '../../components/InstructionCard';
import { useStatusConfig } from '../../hooks/useStatusConfig';
import { sendChar } from '../../utils/serverApi';
import { startListeningWithTimer } from '../../utils/speechRecognition';

const Quiz = () => {
    const [currentChar, setCurrentChar] = useState('');
    const [status, setStatus] = useState(states.quizMenu);
    const [charInput, setCharInput] = useState('');
    const recognitionRef = useRef(null);
    const timerRef = useRef(null);

    const [quizQuestionCount, setQuizQuestionCount] = useState(5);
    const [quizQuestionsLeft, setQuizQuestionsLeft] = useState(-1);
    const [correctQuizAnswers, setCorrectQuizAnswers] = useState(0);

    const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);
    const [retakeQuizCharPool, setRetakeQuizCharPool] = useState([
        ...characters,
    ]);

    const [seenCharacters, setSeenCharacters] = useState(new Set());
    const [incorrectCharacters, setIncorrectCharacters] = useState(new Set());

    const [isRetakingQuiz, setIsRetakingQuiz] = useState(false);

    const voice =
    speechSynthesis
      .getVoices()
      .find((voice) => voice.name === "Google US English") || null;
    // Clear dots when component unmounts (leaving page)
    useEffect(() => {
        return () => {
            sendChar('.');
        };
    }, []);

    useEffect(() => {
        if (status === states.display) {
            const char = getRandomChar();
            console.log('char: ', char);
            setCurrentChar(char);
            
            // Track that we've seen this character
            setSeenCharacters((prev) => new Set([...prev, char]));

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
            // Update quiz score
            setCorrectQuizAnswers((prev) => {
                console.log('Updating correct answers from', prev, 'to', prev + 1);
                return prev + 1;
            });
            // Remove from incorrect set if it was there
            setIncorrectCharacters((prev) => {
                const newSet = new Set(prev);
                newSet.delete(currentChar);
                return newSet;
            });
            // Update questions remaining
            setQuizQuestionsLeft((prev) => {
                const newCount = prev - 1;
                console.log('Questions remaining:', newCount);
                return newCount;
            });
        } else if (status === states.incorrect) {
            speakText(
                `Incorrect, the correct answer was: ${currentChar.toUpperCase()}`
            );
            // Add to incorrect characters
            setIncorrectCharacters((prev) => new Set([...prev, currentChar]));
            // Update questions remaining
            setQuizQuestionsLeft((prev) => {
                const newCount = prev - 1;
                console.log('Questions remaining:', newCount);
                return newCount;
            });
        } else if (status === states.retry) {
            speakText(
                "Sorry, we didn't catch that. Please say 'letter' before your answer, like 'letter A.'"
            );
        } else if (status === states.noInput) {
            speakText('No input received.');
            // Treat no input as incorrect
            setIncorrectCharacters((prev) => new Set([...prev, currentChar]));
            // Update questions remaining
            setQuizQuestionsLeft((prev) => {
                const newCount = prev - 1;
                console.log('Questions remaining:', newCount);
                return newCount;
            });
        }

        return () => {};
    }, [status, currentChar]);

    const getRandomChar = () => {
        const chars = isRetakingQuiz ? retakeQuizCharPool : characters;
        console.log('choosing characters from', chars);
        const index = Math.floor(Math.random() * chars.length);
        return chars[index];
    };

    const reset = () => {
        const clear = '.';
        setCurrentChar('');
        setCharInput('');
        clearTimeout(timerRef.current);
        setShowingCorrectAnswer(false);
        
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }

        // Check if quiz is done
        if (quizQuestionsLeft === 0) {
            setStatus(states.quizDone);
        } else if (quizQuestionsLeft > 0) {
            setStatus(states.display);
        }
    };

    const showCorrectAnswer = () => {
        speakText(`The correct answer was: ${currentChar.toUpperCase()}`);
        setShowingCorrectAnswer(true);
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;
        utterance.voice = voice;
        speechSynthesis.speak(utterance);
    };

    const handleQuizQuestionChange = (event, val) => {
        console.log('number of questions chosen', val);
        setQuizQuestionCount(val);
    };

    const startQuiz = () => {
        if (quizQuestionCount > 0) {
            setQuizQuestionsLeft(quizQuestionCount);
            setCorrectQuizAnswers(0);
            console.log('questions left: ', quizQuestionCount);
            console.log('total question count: ', quizQuestionCount);
            console.log('quiz started');
            setStatus(states.display);
        }
    };

    const takeNewQuiz = () => {
        setRetakeQuizCharPool([...characters]);
        setSeenCharacters(new Set());
        setIncorrectCharacters(new Set());
        setIsRetakingQuiz(false);
        setStatus(states.quizMenu);
        setQuizQuestionCount(5);
        setQuizQuestionsLeft(-1);
        setCorrectQuizAnswers(0);
    };

    const retakeQuiz = () => {
        // Get all characters that were either incorrect or never seen
        const incorrectArray = Array.from(incorrectCharacters);
        const unseenArray = characters.filter(char => !seenCharacters.has(char));
        const retakeArray = [...new Set([...incorrectArray, ...unseenArray])];
        
        console.log('Seen characters:', Array.from(seenCharacters));
        console.log('Incorrect characters:', incorrectArray);
        console.log('Unseen characters:', unseenArray);
        console.log('Retake pool:', retakeArray);
        
        setRetakeQuizCharPool(retakeArray);
        setIsRetakingQuiz(true);
        setQuizQuestionsLeft(retakeArray.length);
        setQuizQuestionCount(retakeArray.length);
        setCorrectQuizAnswers(0);
        
        // Reset tracking for the retake
        setSeenCharacters(new Set());
        setIncorrectCharacters(new Set());
        
        setStatus(states.display);
    };

    const statusConfig = useStatusConfig(status, charInput, currentChar);

    return (
        <PageContainer 
            title="Braille Quiz"
            headerContent={
                quizQuestionsLeft !== -1 &&
                status !== states.quizMenu &&
                status !== states.quizDone && (
                    <Box sx={{ textAlign: 'center' }}>
                        <Chip
                            label={`${quizQuestionsLeft} question(s) left`}
                            sx={{
                                fontSize: '1rem',
                                padding: '0.5rem 1rem',
                                height: 'auto',
                                backgroundColor: '#5e67bf',
                                color: 'white',
                                fontWeight: 600,
                            }}
                        />
                    </Box>
                )
            }
        >
            {status === states.quizMenu ? (
                        <Card
                            sx={{
                                borderRadius: '12px',
                                backgroundColor: '#ffffff',
                                border: '2px solid #e2e8f0',
                            }}
                        >
                            <CardContent sx={{ padding: '2rem' }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontSize: '1.25rem',
                                        fontWeight: 600,
                                        color: '#1a1a1a',
                                        marginBottom: '1.5rem',
                                        textAlign: 'center',
                                    }}
                                >
                                    Choose number of quiz questions:
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        marginBottom: '1.5rem',
                                    }}
                                >
                                    <Typography
                                        component="label"
                                        htmlFor="quiz-question-count"
                                        sx={{
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            color: '#1a1a1a',
                                            marginBottom: '0.75rem',
                                        }}
                                    >
                                        Number of Quiz Questions
                                    </Typography>
                                    <CustomNumberInput
                                        id="quiz-question-count"
                                        aria-label="Number of quiz questions"
                                        helperText='Number of quiz questions'
                                        value={quizQuestionCount}
                                        onChange={handleQuizQuestionChange}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <StyledButton 
                                        onClick={startQuiz}
                                        disabled={quizQuestionCount <= 0}
                                        sx={{
                                            minWidth: '150px',
                                            fontSize: '1.125rem',
                                        }}
                                    >
                                        Start Quiz
                                    </StyledButton>
                                </Box>
                            </CardContent>
                        </Card>
                    ) : status === states.quizDone ? (
                        <Card
                            sx={{
                                borderRadius: '12px',
                                backgroundColor: '#ffffff',
                                border: '2px solid #e2e8f0',
                            }}
                        >
                            <CardContent sx={{ padding: '2rem' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '1.5rem',
                                    }}
                                >
                                    <CheckCircle
                                        sx={{
                                            fontSize: '5rem',
                                            color: '#10b981',
                                        }}
                                    />
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: '1.5rem',
                                            fontWeight: 600,
                                            color: '#1a1a1a',
                                        }}
                                    >
                                        Quiz Complete!
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontSize: '2.5rem',
                                            fontWeight: 700,
                                            color: '#5e67bf',
                                        }}
                                    >
                                        {correctQuizAnswers}/{quizQuestionCount}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontSize: '1.125rem',
                                            color: '#4a5568',
                                        }}
                                    >
                                        Score: {Math.round((correctQuizAnswers / quizQuestionCount) * 100)}%
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '1rem',
                                            width: '100%',
                                            maxWidth: '300px',
                                        }}
                                    >
                                        {(() => {
                                            const incorrectArray = Array.from(incorrectCharacters);
                                            const unseenArray = characters.filter(char => !seenCharacters.has(char));
                                            const hasRetakeChars = incorrectArray.length > 0 || unseenArray.length > 0;
                                            
                                            return hasRetakeChars && (
                                                <StyledButton 
                                                    onClick={retakeQuiz}
                                                    sx={{
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    Retest Incorrect/Unseen ({incorrectArray.length + unseenArray.length})
                                                </StyledButton>
                                            );
                                        })()}
                                        <StyledButton 
                                            onClick={takeNewQuiz}
                                            sx={{
                                                fontSize: '1rem',
                                            }}
                                        >
                                            New Quiz (All Characters)
                                        </StyledButton>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
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
                                        {quizQuestionsLeft === 0 ? 'Next' : 'Next Character'}
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
                                        {quizQuestionsLeft === 0 ? 'Next' : 'Next Character'}
                                    </StyledButton>
                                )}

                                {status === states.noInput && (
                                    <>
                                        {!showingCorrectAnswer && (
                                            <StyledButton 
                                                onClick={showCorrectAnswer}
                                                sx={{
                                                    minWidth: '180px',
                                                    fontSize: '1.125rem',
                                                }}
                                            >
                                                Show Answer
                                            </StyledButton>
                                        )}
                                        <StyledButton 
                                            onClick={reset}
                                            sx={{
                                                minWidth: '150px',
                                                fontSize: '1.125rem',
                                            }}
                                        >
                                            {quizQuestionsLeft === 1 ? 'Next' : 'Next Character'}
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

                            <InstructionCard title="Quiz Progress">
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: '1rem',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: '1rem',
                                            color: '#4a5568',
                                        }}
                                    >
                                        Correct: {correctQuizAnswers}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: '1rem',
                                            color: '#4a5568',
                                        }}
                                    >
                                        Remaining: {quizQuestionsLeft}
                                    </Typography>
                                </Box>
                            </InstructionCard>
                        </>
                    )}
        </PageContainer>                
    );
};

export default Quiz;
