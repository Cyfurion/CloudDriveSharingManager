import './App.css';

import { React } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthContextProvider } from './auth';
import {
    SplashScreen,
    WorkSpace
} from './components';

function App() {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <Routes>
                    <Route path='/' element={<SplashScreen />}/>
                </Routes>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App;
