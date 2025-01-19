import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Learn from './pages/Learn/Learn';
import Practice from './pages/Practice/Practice';
import Quiz from './pages/Quiz/Quiz';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/learn' element={<Learn />} />
                <Route path='/practice' element={<Practice />} />
                <Route path='/quiz' element={<Quiz />} />
            </Routes>
        </Router>
    );
}

export default App;
