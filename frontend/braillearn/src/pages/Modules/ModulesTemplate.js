// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, Typography, Icon } from '@mui/material';

// const ModulesTemplate = ({ title, isCompleted, onComplete, navigateTo }) => {
//     const navigate = useNavigate();

//     return (
//         <Box
//             display='flex'
//             justifyContent='center'
//             flexDirection='column'
//             alignItems='center'
//         >
//             <div className='module-page'>
//                 <h1>{title}</h1>
//                 <p>Status: {isCompleted ? 'Completed' : 'Not Completed'}</p>
//                 <button onClick={onComplete} disabled={isCompleted}>
//                     {isCompleted ? 'Module Completed' : 'Mark as Complete'}
//                 </button>
//                 <button onClick={() => navigate(navigateTo)}>
//                     Go to Next Module
//                 </button>
//             </div>
//         </Box>
//     );
// };

// export default ModulesTemplate;
