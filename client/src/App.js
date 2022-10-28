import './App.css';

import { React } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AdapterContextProvider } from './cloudservices';
import { AuthContextProvider } from './auth';
import { StoreContextProvider } from './store';
import { SplashScreen } from './components';

function App() {
    return (
        <BrowserRouter>
            <AdapterContextProvider>
                <AuthContextProvider>
                    <StoreContextProvider>
                        <Routes>
                            <Route path='/' element={<SplashScreen />}/>
                        </Routes>
                    </StoreContextProvider>
                </AuthContextProvider>
            </AdapterContextProvider>
        </BrowserRouter>
    )
}

export default App;
