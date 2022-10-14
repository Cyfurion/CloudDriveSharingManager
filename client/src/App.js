import './App.css';

import { React } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AdapterContextProvider } from './cloudservices';
import { AuthContextProvider } from './auth';
import {
    SplashScreen,
    LoginPage
} from './components';

function App() {
    return (
        <BrowserRouter>
            <AdapterContextProvider>
                <AuthContextProvider>
                    <Routes>
                        <Route path='/' element={<SplashScreen />}/>
                    </Routes>
                </AuthContextProvider>
            </AdapterContextProvider>
        </BrowserRouter>
    )
}

export default App;
