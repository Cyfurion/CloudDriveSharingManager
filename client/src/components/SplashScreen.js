import {LoginPage, TopBar} from './';
import { Box } from '@mui/system';

export default function SplashScreen() {
    return ( 
        <Box >
            <TopBar />
            <LoginPage/>
        </Box>
    );
}