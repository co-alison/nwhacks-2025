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
import Modules from './pages/Modules/Modules';
import ModulePage from './pages/Modules/ModulePage';

const modules = [
    {
        id: '1-intro',
        title: 'Module 1 Introduction',
        type: 'introduction',
        charsCovered: 'lowercase "a" through "j"',
        charDescription:
            'The lowercase letters “a” through “j” are represented using the dots in the top two rows. This is dots 1, 2, 4, and 5.',
    },
    {
        id: '1-1-learn',
        title: 'Learn 1.1',
        type: 'learn',
        char: 'lowercase "a"',
        representation: 'dot 1, on the top left',
    },
    {
        id: '1-2-learn',
        title: 'Learn 1.2',
        type: 'learn',
        char: 'lowercase "b"',
        representation: 'dots 1 and 3, forming a vertical line on the top left',
    },
    {
        id: '1-1-practice-quiz',
        title: 'Practice Quiz 1.1',
        type: 'practice-quiz',
        chars: 'lowercase "a" through "b"',
        charsList: ['a', 'b'],
    },
    // {
    //     id: '1-2-practice-quiz',
    //     title: 'Practice Quiz 1.2',
    //     type: 'practice-quiz',
    //     chars: 'lowercase "a" through "d"',
    //     charsList: ['a', 'b', 'c', 'd'],
    // },
    // {
    //     id: '1-3-practice-quiz',
    //     title: 'Practice Quiz 1.3',
    //     type: 'practice-quiz',
    // },
    {
        id: '1-quiz',
        title: 'Quiz 1',
        type: 'quiz',
        chars: 'lowercase "a" through "j"',
        charsList: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
        questionCount: 10,
        passingPercentage: 80,
    },
    {
        id: '2-intro',
        title: 'Module 2 Introduction',
        type: 'introduction',
        charsCovered: 'lowercase "k" through "t"',
        charsReviewed: 'lowercase "a" through "j"',
        charDescription:
            'The lowercase letters "k" through "t" are represented the same as the lowercase letters "a" through "j", except the bottom left dot, dot 3, is added.',
    },
];

function App() {
    // const [introCompleted, setIntroCompleted] = useState(false);
    // const [m1Completed, setm1Completed] = useState(false);
    // const [m2Completed, setm2Completed] = useState(false);
    // const [m3Completed, setm3Completed] = useState(false);

    // const [completedModules, setCompletedModules] = useState({});

    // const markComplete = (moduleId) => {
    //     setCompletedModules((prev) => ({
    //         ...prev,
    //         [moduleId]: true,
    //     }));
    // };

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

                <Route path='/modules'>
                    <Route
                        index
                        element={
                            <Modules
                                modules={modules}
                                // completedModules={completedModules}
                            />
                        }
                    />
                    <Route
                        path=':moduleId'
                        element={
                            <ModulePage
                                modules={modules}
                                // completedModules={completedModules}
                                // markComplete={markComplete}
                            />
                        }
                    />
                </Route>

                <Route path='/about' element={<About />} />
                <Route path='/instructions' element={<Instructions />} />
            </Routes>
        </Router>
    );
}

export default App;
