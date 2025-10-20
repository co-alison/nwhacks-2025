import React from 'react';
import { Box, Typography, Card, CardContent, LinearProgress, Chip } from '@mui/material';

/**
 * StatusCard - Reusable card component for displaying practice/quiz/display status
 * 
 * @param {Object} statusConfig - Configuration object containing:
 *   - icon: React element for the status icon
 *   - title: Main title text
 *   - subtitle: Subtitle/description text
 *   - color: Theme color for the status
 *   - bgColor: Background color for icon circle
 *   - showProgress: Boolean to show progress bar
 *   - correctAnswer: Optional correct answer to display
 * @param {string} status - Current status state (for animations)
 * @param {React.ReactNode} children - Action buttons or additional content
 * @param {boolean} showingCorrectAnswer - Whether to show correct answer chip
 * @param {string} correctAnswerText - Text for correct answer chip
 */
const StatusCard = ({ 
    statusConfig, 
    status, 
    children,
    showingCorrectAnswer = false,
    correctAnswerText = null,
    listenStates = []
}) => {
    if (!statusConfig) return null;

    const isListening = listenStates.includes(status);

    return (
        <Card
            sx={{
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '2px solid #e2e8f0',
            }}
        >
            <CardContent
                sx={{
                    padding: { xs: '1.5rem', md: '2rem' },
                    textAlign: 'center',
                }}
            >
                {/* Status Icon */}
                <Box
                    sx={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: statusConfig.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        color: statusConfig.color,
                        animation: isListening ? 'pulse 2s ease-in-out infinite' : 'none',
                        '@keyframes pulse': {
                            '0%, 100%': {
                                opacity: 1,
                                transform: 'scale(1)',
                            },
                            '50%': {
                                opacity: 0.8,
                                transform: 'scale(1.05)',
                            },
                        },
                    }}
                    aria-hidden="true"
                >
                    {statusConfig.icon}
                </Box>

                {/* Status Title */}
                <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                        fontWeight: 600,
                        color: '#1a1a1a',
                        marginBottom: '0.5rem',
                    }}
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {statusConfig.title}
                </Typography>

                {/* Status Subtitle */}
                <Typography
                    variant="body1"
                    component="p"
                    sx={{
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        color: '#4a5568',
                        marginBottom: '1rem',
                        lineHeight: 1.5,
                    }}
                >
                    {statusConfig.subtitle}
                </Typography>

                {/* Correct Answer Display */}
                {statusConfig.correctAnswer && (
                    <Chip
                        label={`Correct Answer: ${statusConfig.correctAnswer}`}
                        sx={{
                            fontSize: '0.875rem',
                            padding: '0.5rem 0.75rem',
                            height: 'auto',
                            backgroundColor: '#10b98115',
                            color: '#059669',
                            fontWeight: 600,
                            marginBottom: '1rem',
                            border: '2px solid #10b981',
                        }}
                    />
                )}

                {/* Showing Correct Answer Chip */}
                {showingCorrectAnswer && correctAnswerText && (
                    <Chip
                        label={`Correct Answer: ${correctAnswerText}`}
                        sx={{
                            fontSize: '0.875rem',
                            padding: '0.5rem 0.75rem',
                            height: 'auto',
                            backgroundColor: '#10b98115',
                            color: '#059669',
                            fontWeight: 600,
                            marginBottom: '1rem',
                            border: '2px solid #10b981',
                        }}
                    />
                )}

                {/* Progress Bar for Listening */}
                {statusConfig.showProgress && (
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '300px',
                            margin: '0 auto 1rem',
                        }}
                    >
                        <LinearProgress
                            sx={{
                                height: '6px',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(94, 103, 191, 0.2)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#5e67bf',
                                },
                            }}
                        />
                    </Box>
                )}

                {/* Action Buttons */}
                {children && (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        {children}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default StatusCard;
