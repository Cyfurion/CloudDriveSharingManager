import {LoginPage,WorkSpace, TopBar, SideBar} from './';
import { Box , Grid} from '@mui/material';
import AuthContext from '../auth';
import { useContext } from 'react';

export default function SplashScreen() {
    const { auth }  = useContext(AuthContext);

    if (auth.isAuthorized) {
        return (
            <Box>
                <Grid container>
                    <Grid item xs={12}>
                        <TopBar />
                    </Grid>
                    <Grid item xs={2}>
                        <SideBar />
                    </Grid>
                    <Grid item xs={10}>
                        <WorkSpace />
                    </Grid>
                </Grid>
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
