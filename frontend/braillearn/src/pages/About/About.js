import React from 'react';
import theme from '../../styles/theme';
import { Box, Container, Card, CardContent, Typography, Avatar, Chip } from '@mui/material';
import { School, EmojiEvents, Accessible, Groups } from '@mui/icons-material';

const About = () => {
    const teamMembers = [
        { name: 'Alison Co' },
        { name: 'Cindy Cui' },
        { name: 'Mayank Rastogi' },
        { name: 'Tammy Kim' },
    ];

    const stats = [
        {
            icon: <School sx={{ fontSize: '2rem' }} />,
            value: '10%',
            label: 'Blind individuals are Braille literate',
            color: '#5e67bf',
        },
        {
            icon: <EmojiEvents sx={{ fontSize: '2rem' }} />,
            value: '90%',
            label: 'Of employed blind people know Braille',
            color: '#8ec6f7',
        },
        {
            icon: <Accessible sx={{ fontSize: '2rem' }} />,
            value: '1 in 3',
            label: 'Non-Braille readers are employed',
            color: '#6b7fd7',
        },
    ];

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 70px)',
                background: 'linear-gradient(135deg, #f8f9fc 0%, #e8ecf7 100%)',
                paddingBottom: '4rem',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    component="main"
                    role="main"
                    sx={{
                        paddingTop: '2rem',
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '3rem',
                        }}
                    >
                        <Typography
                            variant='h4'
                            component="h1"
                            sx={{
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                fontWeight: 700,
                                color: '#1a1a1a',
                                textAlign: 'center',
                                flex: 1,
                            }}
                        >
                            About Braillearn
                        </Typography>
                        <Box sx={{ width: '100px' }} />
                    </Box>

                    {/* Hero Section */}
                    <Card
                        sx={{
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            border: '2px solid #e2e8f0',
                            marginBottom: '2rem',
                            background: theme.palette.custom.gradient,
                        }}
                    >
                        <CardContent sx={{ padding: { xs: '2rem', md: '3rem' }, textAlign: 'center' }}>
                            <Typography
                                variant="h2"
                                component="h2"
                                sx={{
                                    fontSize: { xs: '2rem', md: '2.5rem' },
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    marginBottom: '1rem',
                                }}
                            >
                                What is Braillearn?
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: { xs: '1.125rem', md: '1.25rem' },
                                    color: '#ffffff',
                                    lineHeight: 1.8,
                                    maxWidth: '800px',
                                    margin: '0 auto',
                                }}
                            >
                                An accessible, interactive platform designed to make learning Braille 
                                immersive and accessible for visually impaired individuals. Learn anytime, 
                                anywhere to improve communication and employability.
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Stats Section */}
                    <Box sx={{ marginBottom: '2rem' }}>
                        <Typography
                            variant="h5"
                            component="h2"
                            sx={{
                                fontSize: { xs: '1.5rem', md: '1.75rem' },
                                fontWeight: 600,
                                color: '#1a1a1a',
                                marginBottom: '1.5rem',
                                textAlign: 'center',
                            }}
                        >
                            Why Braille Matters
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                                gap: '1.5rem',
                            }}
                        >
                            {stats.map((stat, index) => (
                                <Card
                                    key={index}
                                    sx={{
                                        borderRadius: '12px',
                                        backgroundColor: '#ffffff',
                                        border: '2px solid #e2e8f0',
                                        transition: 'transform 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ padding: '2rem', textAlign: 'center' }}>
                                        <Box
                                            sx={{
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '50%',
                                                background: `${stat.color}20`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 1rem',
                                                color: stat.color,
                                            }}
                                            aria-hidden="true"
                                        >
                                            {stat.icon}
                                        </Box>
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                fontSize: '2.5rem',
                                                fontWeight: 700,
                                                color: stat.color,
                                                marginBottom: '0.5rem',
                                            }}
                                        >
                                            {stat.value}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontSize: '1rem',
                                                color: '#4a5568',
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {stat.label}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>

                    {/* Motivation Section */}
                    <Card
                        sx={{
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            border: '2px solid #e2e8f0',
                            marginBottom: '2rem',
                            backgroundColor: '#ffffff',
                        }}
                    >
                        <CardContent sx={{ padding: { xs: '2rem', md: '3rem' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <Box
                                    sx={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'rgba(94, 103, 191, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '1rem',
                                        color: theme.palette.custom.buttonBackground,
                                    }}
                                    aria-hidden="true"
                                >
                                    <EmojiEvents sx={{ fontSize: '1.5rem' }} />
                                </Box>
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    sx={{
                                        fontSize: { xs: '1.5rem', md: '1.75rem' },
                                        fontWeight: 600,
                                        color: '#1a1a1a',
                                    }}
                                >
                                    Our Motivation
                                </Typography>
                            </Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: '1.125rem',
                                    color: '#4a5568',
                                    lineHeight: 1.8,
                                }}
                            >
                                Braille is a universal system available in every language. However, only 10% 
                                of blind individuals are Braille literate, while 90% of employed blind people 
                                are proficient in Braille. Among adults who don't know Braille, only one in 
                                three is employed. Proficiency in Braille is crucial for visually impaired 
                                children to compete with their sighted peers academically and succeed in the 
                                workforce. Braillearn aims to make learning Braille immersive and accessible, 
                                enabling more visually impaired individuals to learn Braille anytime, anywhere, 
                                improving communication and employability.
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Team Section */}
                    <Card
                        sx={{
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            border: '2px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                        }}
                    >
                        <CardContent sx={{ padding: { xs: '2rem', md: '3rem' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                                <Box
                                    sx={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'rgba(94, 103, 191, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '1rem',
                                        color: theme.palette.custom.buttonBackground,
                                    }}
                                    aria-hidden="true"
                                >
                                    <Groups sx={{ fontSize: '1.5rem' }} />
                                </Box>
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    sx={{
                                        fontSize: { xs: '1.5rem', md: '1.75rem' },
                                        fontWeight: 600,
                                        color: '#1a1a1a',
                                    }}
                                >
                                    Meet the Team
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
                                    gap: '2rem',
                                    justifyItems: 'center',
                                }}
                            >
                                {teamMembers.map((member, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            textAlign: 'center',
                                            transition: 'transform 0.2s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            },
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: { xs: 80, md: 100 },
                                                height: { xs: 80, md: 100 },
                                                margin: '0 auto 1rem',
                                                background: theme.palette.custom.gradient,
                                                fontSize: { xs: '1.5rem', md: '2rem' },
                                                fontWeight: 700,
                                            }}
                                        >
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </Avatar>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontSize: { xs: '0.9rem', md: '1rem' },
                                                fontWeight: 600,
                                                color: '#1a1a1a',
                                            }}
                                        >
                                            {member.name}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
};

export default About;