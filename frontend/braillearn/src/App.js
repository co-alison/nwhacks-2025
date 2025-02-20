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
        id: 'overview',
        title: 'Modules Overview',
        type: 'overview',
    },

    // {
    //     id: '0-intro',
    //     title: 'Module 0 Introduction',
    //     type: 'introduction',
    //     charsCovered: 'the locations of the braille dots 1 to 6',
    //     charDescription:
    //         'Braille is represented with six dots numbered 1 through 6. These dots form two vertical columns of three dots each.',
    // },
    // {
    //     id: '0-1-learn',
    //     title: 'Learn Dot 1',
    //     type: 'learn',
    //     char: 'dot 1',
    //     representation: '',
    // },
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
        title: 'Learn "a"',
        type: 'learn',
        char: 'lowercase "a"',
        representation: 'dot 1, on the top left',
    },
    {
        id: '1-2-learn',
        title: 'Learn "b"',
        type: 'learn',
        char: 'lowercase "b"',
        representation: 'dots 1 and 2, forming a vertical line on the top left',
    },
    {
        id: '1-1-practice-quiz',
        title: 'Practice Quiz 1.1',
        type: 'practice-quiz',
        chars: 'lowercase "a" through "b"',
        charsList: ['a', 'b'],
    },
    {
        id: '1-3-learn',
        title: 'Learn "c"',
        type: 'learn',
        char: 'lowercase "c"',
        representation:
            'dots 1 and 4, forming a horizontal line in the top row',
    },
    {
        id: '1-4-learn',
        title: 'Learn "d"',
        type: 'learn',
        char: 'lowercase "d"',
        representation: 'dots 1, 4, and 5, filling in the top right corner',
    },
    {
        id: '1-2-practice-quiz',
        title: 'Practice Quiz 1.2',
        type: 'practice-quiz',
        chars: 'lowercase "a" through "d"',
        charsList: ['a', 'b', 'c', 'd'],
    },
    {
        id: '1-5-learn',
        title: 'Learn "e"',
        type: 'learn',
        char: 'lowercase "e"',
        representation:
            'dots 1 and 5, making a diagonal line towards the top left',
    },
    {
        id: '1-6-learn',
        title: 'Learn "f"',
        type: 'learn',
        char: 'lowercase "f"',
        representation: 'dots 1, 2, and 4, filling in the top left corner',
    },
    {
        id: '1-3-practice-quiz',
        title: 'Practice Quiz 1.3',
        type: 'practice-quiz',
        chars: 'lowercase "a" through "f"',
        charsList: ['a', 'b', 'c', 'd', 'e', 'f'],
    },
    {
        id: '1-7-learn',
        title: 'Learn "g"',
        type: 'learn',
        char: 'lowercase "g"',
        representation: 'dots 1, 2, 4, and 5, filling in the first two rows',
    },
    {
        id: '1-8-learn',
        title: 'Learn "h"',
        type: 'learn',
        char: 'lowercase "h"',
        representation: 'dots 1, 2, and 5',
    },
    {
        id: '1-4-practice-quiz',
        title: 'Practice Quiz 1.4',
        type: 'practice-quiz',
        chars: 'lowercase "a" through "h"',
        charsList: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    },
    {
        id: '1-9-learn',
        title: 'Learn "i"',
        type: 'learn',
        char: 'lowercase "i"',
        representation:
            'dots 2 and 4, making a diagonal line towards the top right',
    },
    {
        id: '1-10-learn',
        title: 'Learn "j"',
        type: 'learn',
        char: 'lowercase "j"',
        representation: 'dots 2, 4, and 5',
    },
    {
        id: '1-5-practice-quiz',
        title: 'Practice Quiz 1.5',
        type: 'practice-quiz',
        chars: 'lowercase "a" through "j"',
        charsList: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
    },
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
    {
        id: '2-1-learn',
        title: 'Learn "k"',
        type: 'learn',
        char: 'lowercase "k"',
        representation: 'dots 1 and 3, which is the character "a" plus dot 3',
    },
    {
        id: '2-2-learn',
        title: 'Learn "l"',
        type: 'learn',
        char: 'lowercase "l"',
        representation:
            'dots 1, 2, and 3, which is the character "b" plus dot 3',
    },
    {
        id: '2-1-practice-quiz',
        title: 'Practice Quiz 2.1',
        type: 'practice-quiz',
        chars: 'lowercase "a", "b", "k", and "l"',
        charsList: ['a', 'b', 'k', 'l'],
    },
    {
        id: '2-3-learn',
        title: 'Learn "m"',
        type: 'learn',
        char: 'lowercase "m"',
        representation:
            'dots 1, 4, and 3, which is the character "c" plus dot 3',
    },
    {
        id: '2-4-learn',
        title: 'Learn "n"',
        type: 'learn',
        char: 'lowercase "n"',
        representation:
            'dots 1, 4, 5, and 3, which is the character "d" plus dot 3',
    },
    {
        id: '2-2-practice-quiz',
        title: 'Practice Quiz 2.2',
        type: 'practice-quiz',
        chars: 'lowercase "c", "d", "m", and "n"',
        charsList: ['c', 'd', 'm', 'n'],
    },
    {
        id: '2-5-learn',
        title: 'Learn "o"',
        type: 'learn',
        char: 'lowercase "o"',
        representation:
            'dots 1, 5, and 3, which is the character "e" plus dot 3',
    },
    {
        id: '2-6-learn',
        title: 'Learn "p"',
        type: 'learn',
        char: 'lowercase "p"',
        representation:
            'dots 1, 2, 4, and 3, which is the character "f" plus dot 3',
    },
    {
        id: '2-3-practice-quiz',
        title: 'Practice Quiz 2.3',
        type: 'practice-quiz',
        chars: 'lowercase "e", "f", "o", and "p"',
        charsList: ['e', 'f', 'o', 'p'],
    },
    {
        id: '2-7-learn',
        title: 'Learn "q"',
        type: 'learn',
        char: 'lowercase "q"',
        representation:
            'dots 1, 2, 4, 5, and 3, which is the character "g" plus dot 3', // TODO: add extra descriptions, like 'You can also think of this as all dots except dot 6'
    },
    {
        id: '2-8-learn',
        title: 'Learn "r"',
        type: 'learn',
        char: 'lowercase "r"',
        representation:
            'dots 1, 2, 5, and 3, which is the character "h" plus dot 3',
    },
    {
        id: '2-4-practice-quiz',
        title: 'Practice Quiz 2.4',
        type: 'practice-quiz',
        chars: 'lowercase "g", "h", "q", and "r"',
        charsList: ['g', 'h', 'q', 'r'],
    },
    {
        id: '2-9-learn',
        title: 'Learn "s"',
        type: 'learn',
        char: 'lowercase "s"',
        representation:
            'dots 2, 4, and 3, which is the character "i" plus dot 3',
    },
    {
        id: '2-10-learn',
        title: 'Learn "t"',
        type: 'learn',
        char: 'lowercase "t"',
        representation:
            'dots 2, 4, 5, and 3, which is the character "j" plus dot 3',
    },
    {
        id: '2-5-practice-quiz',
        title: 'Practice Quiz 2.5',
        type: 'practice-quiz',
        chars: 'lowercase "i", "j", "t", and "s"',
        charsList: ['i', 'j', 't', 's'],
    },
    {
        id: '2-quiz',
        title: 'Quiz 2',
        type: 'quiz',
        chars: 'lowercase "k" through "t"',
        charsList: ['k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
        questionCount: 10,
        passingPercentage: 80,
    },
    {
        id: '3-intro',
        title: 'Module 3 Introduction',
        type: 'introduction',
        charsCovered: 'lowercase "u" through "z"',
        charsReviewed: 'lowercase "a" through "t"',
        charDescription:
            'The lowercase letters "u" through "z" are represented the same as the lowercase letters "a" through "e", except the bottom row, dots 3 and 6, are added. The exception to the pattern is the letter "w", which does not match any previous characters seen before. More information on the letter "w" will be provided later.',
    },
    {
        id: '3-1-learn',
        title: 'Learn "u"',
        type: 'learn',
        char: 'lowercase "u"',
        representation:
            'dots 1, 3, and 6, which is the character "a" plus the bottom row',
    },
    {
        id: '3-2-learn',
        title: 'Learn "v"',
        type: 'learn',
        char: 'lowercase "v"',
        representation:
            'dots 1, 2, 3, and 6, which is the character "b" plus the bottom row',
    },
    {
        id: '3-1-practice-quiz',
        title: 'Practice Quiz 3.1',
        type: 'practice-quiz',
        chars: 'lowercase "a", "b", "k", "l", "u", and "v"',
        charsList: ['a', 'b', 'k', 'l', 'u', 'v'],
    },
    {
        id: '3-3-learn',
        title: 'Learn "w"',
        type: 'learn',
        char: 'lowercase "w"',
        representation:
            'dots 2, 4, 5, and 6. Notice that the letter "w" does not follow the pattern of the rest of the braille dots',
    },
    {
        id: '3-4-learn',
        title: 'Learn "x"',
        type: 'learn',
        char: 'lowercase "x"',
        representation:
            'dots 1, 3, 4, and 6, which is the character "c" plus the bottom row',
    },

    {
        id: '3-2-practice-quiz',
        title: 'Practice Quiz 3.2',
        type: 'practice-quiz',
        chars: 'lowercase "c", "m", "w", and "x"',
        charsList: ['c', 'm', 'w', 'x'],
    },
    {
        id: '3-5-learn',
        title: 'Learn "y"',
        type: 'learn',
        char: 'lowercase "y"',
        representation:
            'dots 1, 3, 4, 5, and 6, which is the character "d" plus the bottom row',
    },
    {
        id: '3-6-learn',
        title: 'Learn "z"',
        type: 'learn',
        char: 'lowercase "z"',
        representation:
            'dots 1, 5, 3, and 6, which is the character "e" plus the bottom row',
    },
    {
        id: '3-3-practice-quiz',
        title: 'Practice Quiz 2.3',
        type: 'practice-quiz',
        chars: 'lowercase "d", "e", "n", "o", "y", and "z"',
        charsList: ['d', 'e', 'n', 'o', 'y', 'z'],
    },
    {
        id: '3-quiz',
        title: 'Quiz 3',
        type: 'quiz',
        chars: 'lowercase "u" through "z"',
        charsList: ['u', 'v', 'w', 'x', 'y', 'z'],
        questionCount: 10,
        passingPercentage: 80,
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
                            fontSize: '1.6rem',
                            fontFamily: 'Roboto, sans-serif',
                            padding: '1.5rem',
                        }}
                    >
                        About
                    </Button>
                    <Button
                        component={Link}
                        to='/instructions'
                        sx={{
                            fontSize: '1.6rem',
                            fontFamily: 'Roboto, sans-serif',
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
