import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import theme from '../../styles/theme';

const Modules = ({ modules }) => {
    const navigate = useNavigate();

    const renderButton = (module) => {
        let variant = '';
        let size = '';

        switch (module.type) {
            case 'overview':
                variant = 'contained';
                size = 'large';
                break;
            case 'introduction':
                variant = 'contained';
                size = 'small';
                break;
            case 'practice-quiz':
                variant = 'outlined';
                size = 'small';
                break;
            case 'quiz':
                variant = 'contained';
                size = 'small';
                break;
            default:
                variant = 'text';
                size = 'small';
        }

        return (
            <Button
                key={module.id || module.title}
                variant={variant}
                size={size}
                onClick={() => navigate(`/modules/${module.id}`)}
                sx={{
                    fontSize: '1.2rem',
                    width: '50%',
                    maxWidth: '20rem',
                    padding: theme.spacing(0.5),
                    textTransform: 'none',
                }}
            >
                {module.title}
            </Button>
        );
    };

    const columns = [1, 2, 3].map((groupNum) =>
        modules.filter((module) => module.group === groupNum)
    );

    return (
        <Box sx={{ textAlign: 'center', padding: theme.spacing(4) }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: theme.spacing(4),
                    left: theme.spacing(4),
                }}
            >
            </Box>

            <Typography
                variant='h1'
                sx={{
                    fontSize: '3rem',
                    marginBottom: theme.spacing(3),
                }}
            >
                Learning Modules
            </Typography>

            <Button
                key={'overview'}
                variant='contained'
                size='large'
                onClick={() => navigate(`/modules/overview`)}
                sx={{
                    fontSize: '1.2rem',
                    width: '50%',
                    maxWidth: '20rem',
                    padding: theme.spacing(0.5),
                    textTransform: 'none',
                    mb: theme.spacing(4),
                }}
            >
                {'Modules Overview'}
            </Button>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: theme.spacing(10),
                }}
            >
                {columns.map((col, i) => (
                    <Box
                        key={i}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: theme.spacing(2),
                            minWidth: 400,
                            alignItems: 'center',
                        }}
                    >
                        {col.map((module) => renderButton(module))}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Modules;
