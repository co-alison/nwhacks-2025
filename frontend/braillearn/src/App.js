import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { createTheme, ThemeProvider, Typography } from '@mui/material';
import theme from './styles/theme';
import Home from './pages/Home/Home';
import Learn from './pages/Learn/Learn';
import Practice from './pages/Practice/Practice';
import About from './pages/About/About';
import Instructions from './pages/Instructions/Instructions';
import Quiz from './pages/Quiz/Quiz';

function App() {
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
                <Route path='/learn' element={<Learn />} />
                <Route path='/practice' element={<Practice />} />
                <Route path='/quiz' element={<Quiz />} />
                <Route path='/about' element={<About />} />
                <Route path='/instructions' element={<Instructions />} />
            </Routes>
        </Router>
    );
}

export default App;
