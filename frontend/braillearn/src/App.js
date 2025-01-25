import { React, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { createTheme, ThemeProvider, Typography } from '@mui/material';
import theme from './styles/theme';
import Home from './pages/Home/Home';
import Display from './pages/Display/Display';
import Practice from './pages/Practice/Practice';
import About from './pages/About/About';
import Instructions from './pages/Instructions/Instructions';
import Quiz from './pages/Quiz/Quiz';
import Learn from './pages/Modules/Learn';
import ModulePage from './pages/Modules/ModulePages';

const modules = [
    {
        id: 'module1-intro',
        title: 'Module 1 Introduction',
        type: 'introduction',
    },
    { id: 'learn1-1', title: 'Learn 1.1', type: 'learn' },
    { id: 'learn1-2', title: 'Learn 1.2', type: 'learn' },
    {
        id: 'practice-quiz-1-1',
        title: 'Practice Quiz 1.1',
        type: 'practice-quiz',
    },
    {
        id: 'practice-quiz-1-2',
        title: 'Practice Quiz 1.2',
        type: 'practice-quiz',
    },
    {
        id: 'practice-quiz-1-2',
        title: 'Practice Quiz 1.2',
        type: 'practice-quiz',
    },
    { id: 'quiz-1', title: 'Quiz 1', type: 'quiz' },
];

function App() {
    // const [introCompleted, setIntroCompleted] = useState(false);
    // const [m1Completed, setm1Completed] = useState(false);
    // const [m2Completed, setm2Completed] = useState(false);
    // const [m3Completed, setm3Completed] = useState(false);

    const [completedModules, setCompletedModules] = useState({});

    const markComplete = (moduleId) => {
        setCompletedModules((prev) => ({
            ...prev,
            [moduleId]: true,
        }));
    };

    return (
        <Router>
            <AppBar
                position='static'
                sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
            >
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                        component={Link}
                        to='/about'
                        sx={{
                            color: theme.palette.custom.textPurple,
                            fontSize: '1.4rem',
                            fontFamily: 'Roboto',
                            padding: '1.5rem',
                        }}
                    >
                        About
                    </Button>
                    <Button
                        component={Link}
                        to='/instructions'
                        sx={{
                            fontSize: '1.4rem',
                            fontFamily: 'Roboto',
                            padding: '1.5rem',
                        }}
                    >
                        Instructions
                    </Button>
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/display' element={<Display />} />
                <Route path='/practice' element={<Practice />} />
                <Route path='/quiz' element={<Quiz />} />

                <Route
                    path='/learn'
                    element={
                        <Learn
                            modules={modules}
                            /*completedModules={completedModules}*/
                        />
                    }
                />
                <Route
                    path='/:moduleId' // TODO: can this be /learn/:moduleId?
                    element={
                        <ModulePage
                            modules={modules}
                            /*completedModules={completedModules}*/
                            /*markComplete={markComplete}*/
                        />
                    }
                />

                <Route path='/about' element={<About />} />
                <Route path='/instructions' element={<Instructions />} />
            </Routes>
        </Router>
    );
}

export default App;
