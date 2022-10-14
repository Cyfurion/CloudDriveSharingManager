import {LoginPage, TopBar} from './';
import { Box } from '@mui/system';
import AuthContext from '../auth';
import { useContext } from 'react';
import { WorkSpace } from './';

export default function SplashScreen() {
    const { auth }  = useContext(AuthContext);

    if (auth.isAuthorized) {
        return (
            <Box>
                <TopBar />
                <WorkSpace />
            </Box>
        );
    }
    return ( 
        <Box >
            <TopBar />
            <LoginPage/>
        </Box>
    );
}