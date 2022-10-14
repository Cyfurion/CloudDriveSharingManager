import * as React from 'react';
import { Box, Toolbar} from '@mui/material';
import UserNavBar from './UserNavBar';
import AppLogo from './AppLogo';
import { useContext } from 'react';
import AuthContext from '../auth';

export default function TopBar() {
  const { auth } = useContext(AuthContext);

  if( auth.isAuthorized){
    return (
      <Toolbar sx={{backgroundColor: 'beige'}}>
        <UserNavBar />
      </Toolbar>
    )
  }


  return (
    <Box>
      <Toolbar maxHeight="65px"  sx={{ backgroundColor: 'beige'}}>
      <AppLogo/>
      </Toolbar>
    </Box>
  )
}

