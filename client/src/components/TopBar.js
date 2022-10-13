import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import AppLogo from './AppLogo';

export default function TopBar() {

  return (
    <AppBar position="static" style={{background:'#FFFFFF'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AppLogo />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

