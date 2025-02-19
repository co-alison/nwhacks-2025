import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import theme from '../../styles/theme';

const Modules = ({ modules }) => {
    const navigate = useNavigate();

    return (
        <Box sx={{ textAlign: 'center', padding: theme.spacing(4) }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: theme.spacing(4),
                    left: theme.spacing(4),
                }}
            >
                <BackButton />
            </Box>
            <Typography
                variant="h1"
                sx={{
                    fontSize: '3rem',
                    marginBottom: theme.spacing(3),
                }}
            >
                Learning Modules
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: theme.spacing(1),
                }}
            >
                {modules.map((module) => (
                    <Button
                        key={module.id}
                        onClick={() => navigate(`/modules/${module.id}`)}
                        sx={{
                            fontSize: '1.2rem',
                            width: '50%',
                            maxWidth: '20rem',
                            padding: theme.spacing(0.5),
                            textTransform: 'none',
                        }}
                        variant="outlined"
                    >
                        {module.title}
                    </Button>
                ))}
            </Box>
        </Box>
    );
};

export default Modules;
