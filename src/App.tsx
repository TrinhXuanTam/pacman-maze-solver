import React from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import './css/base.scss';
import {HomePage} from "./pages/home/home-page";
import {GamePage} from "./pages/game/game-page";
import {PageContainer} from "./layouts/page-container/page-container";

function App() {
    return (
        <PageContainer>
            <Router>
                <Routes>
                    <Route path='/' element={<HomePage/>}/>
                    <Route path='/game' element={<Navigate to='/'/>}/>
                    <Route path='/game/:id' element={<GamePage/>}/>
                </Routes>
            </Router>
        </PageContainer>
    );
}

export default App;
