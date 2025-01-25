import { Box, Typography, Icon } from '@mui/material'; // Importing Material-UI components for consistent styling.
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import StyledButton from '../../components/StyledButton';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import theme from '../../styles/theme';

const Learn = ({ modules, /*completedModules*/ }) => {
    const navigate = useNavigate();

  return (
    <div className="navigation-page">
      <h1>Learning Modules</h1>
      {modules.map((module) => (
        <button
          key={module.id}
        //   style={{
        //     backgroundColor: completedModules[module.id] ? 'green' : 'gray',
        //     color: 'white',
        //     margin: '0.5rem',
        //   }}
          onClick={() => navigate(`/${module.id}`)}
        >
          {module.title}
        </button>
      ))}
    </div>
  );
};

export default Learn;
