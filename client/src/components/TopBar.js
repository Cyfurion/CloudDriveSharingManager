import * as React from 'react';
import { Box, Toolbar, Grid} from '@mui/material';
import UserNavBar from './UserNavBar';
import AppLogo from './AppLogo';
import { useContext } from 'react';
import AuthContext from '../auth';

export default function TopBar() {
  const { auth } = useContext(AuthContext);
  
  if( auth.isAuthorized){
    return (
      <Box>
      <Toolbar  noWrap sx={{ backgroundColor: 'beige'}}>
      <AppLogo/>
      <UserNavBar/>
      </Toolbar>
      </Box>
    )
  }


  return (
    <Box>
      <Toolbar  noWrap sx={{ backgroundColor: 'beige'}}>
      <AppLogo/>
      </Toolbar>
    </Box>
  )
}

