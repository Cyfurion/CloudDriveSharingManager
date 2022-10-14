import {LoginPage, TopBar} from './';
import { Box } from '@mui/system';
import AuthContext from '../auth';
import { useContext } from 'react';
import { WorkSpace } from './';

export default function SplashScreen() {
    const { auth }  = useContext(AuthContext);

    if( auth.isAuthorized ){
        console.log(auth.jankFiles);
        return(
            <Box sx = {{textAlign:'inline'}} >
                <TopBar />
                <WorkSpace />
            </Box>
        )
    }
    return ( 
        <Box >
            <TopBar />
            <LoginPage/>
        </Box>
    );
}