import { Box, Typography, Button } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import StyledButton from '../../components/StyledButton';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import theme from '../../styles/theme';

const Modules = ({ modules /*completedModules*/ }) => {
    const navigate = useNavigate();

    return (
        <Box>
            <Box>
                <Box
                    sx={{
                        position: 'absolute',
                        top: theme.spacing(4),
                        left: theme.spacing(4),
                    }}
                >
                    <BackButton />
                </Box>
            </Box>

            <Typography variant='h1'>Learning Modules</Typography>

            {modules.map((module) => (
                <div>
                    <Button
                        key={module.id}
                        //   style={{
                        //     backgroundColor: completedModules[module.id] ? 'green' : 'gray',
                        //     color: 'white',
                        //     margin: '0.5rem',
                        //   }}
                        onClick={() => navigate(`/modules/${module.id}`)}
                    >
                        {module.title}
                    </Button>
                </div>
            ))}
        </Box>
    );
};

export default Modules;
