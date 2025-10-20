import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import theme from '../../styles/theme';
import PageContainer from '../../components/PageContainer';
import StyledButton from '../../components/StyledButton';
import { School, Quiz as QuizIcon, MenuBook, CheckCircle } from '@mui/icons-material';

const Modules = ({ modules }) => {
    const navigate = useNavigate();

    const getModuleIcon = (type) => {
        switch (type) {
            case 'overview':
                return <School sx={{ fontSize: '2rem' }} />;
            case 'introduction':
                return <MenuBook sx={{ fontSize: '1.5rem' }} />;
            case 'learn':
                return <School sx={{ fontSize: '1.5rem' }} />;
            case 'practice-quiz':
                return <QuizIcon sx={{ fontSize: '1.5rem' }} />;
            case 'quiz':
                return <CheckCircle sx={{ fontSize: '1.5rem' }} />;
            default:
                return <School sx={{ fontSize: '1.5rem' }} />;
        }
    };

    const getModuleColor = (type) => {
        switch (type) {
            case 'overview':
                return {
                    bg: 'rgba(94, 103, 191, 0.1)',
                    border: '#5e67bf',
                    text: '#5e67bf'
                };
            case 'introduction':
                return {
                    bg: 'rgba(16, 185, 129, 0.1)',
                    border: '#10b981',
                    text: '#059669'
                };
            case 'learn':
                return {
                    bg: 'rgba(59, 130, 246, 0.1)',
                    border: '#3b82f6',
                    text: '#2563eb'
                };
            case 'practice-quiz':
                return {
                    bg: 'rgba(245, 158, 11, 0.1)',
                    border: '#f59e0b',
                    text: '#d97706'
                };
            case 'quiz':
                return {
                    bg: 'rgba(139, 92, 246, 0.1)',
                    border: '#8b5cf6',
                    text: '#7c3aed'
                };
            default:
                return {
                    bg: 'rgba(107, 114, 128, 0.1)',
                    border: '#6b7280',
                    text: '#4b5563'
                };
        }
    };

    const columns = [1, 2, 3].map((groupNum) =>
        modules.filter((module) => module.group === groupNum)
    );

    return (
        <PageContainer title="Learning Modules">
            {/* Overview Button */}
            <Card
                sx={{
                    marginBottom: '2rem',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    border: '2px solid #5e67bf',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(94, 103, 191, 0.3)',
                    },
                }}
                onClick={() => navigate('/modules/overview')}
            >
                <CardContent sx={{ padding: '1.5rem', textAlign: 'center' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                        }}
                    >
                        <School sx={{ fontSize: '2rem', color: '#5e67bf' }} />
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: '1.5rem',
                                fontWeight: 600,
                                color: '#5e67bf',
                            }}
                        >
                            Modules Overview
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Module Groups */}
            <Grid container spacing={3}>
                {columns.map((col, colIndex) => (
                    <Grid item xs={12} md={4} key={colIndex}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                            }}
                        >
                            {col.map((module) => {
                                const colors = getModuleColor(module.type);
                                return (
                                    <Card
                                        key={module.id}
                                        sx={{
                                            borderRadius: '12px',
                                            backgroundColor: colors.bg,
                                            border: `2px solid ${colors.border}`,
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 4px 12px ${colors.border}40`,
                                            },
                                        }}
                                        onClick={() => navigate(`/modules/${module.id}`)}
                                    >
                                        <CardContent sx={{ padding: '1rem' }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                }}
                                            >
                                                <Box sx={{ color: colors.text }}>
                                                    {getModuleIcon(module.type)}
                                                </Box>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: 600,
                                                        color: colors.text,
                                                    }}
                                                >
                                                    {module.title}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </PageContainer>
    );
};

export default Modules;
