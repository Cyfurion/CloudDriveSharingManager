import React from "react";
import Box from '@mui/material/Box';
import {GoogleLoginButton} from './';

export default function LoginPage(){

    return(
        <Box>
            <h1> Service Login</h1>
            <GoogleLoginButton></GoogleLoginButton>
        </Box>
    )
}