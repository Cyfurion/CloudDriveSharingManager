import React from "react";
import {GoogleLoginButton} from './';
import { Typography, Box} from "@mui/material";
import {DropboxLoginButton} from './';

export default function LoginPage(){

    return(
        <Box
            sx={{
                height: '93vh',
                display:'flex', 
                border:5,
                borderColor:'black',
                backgroundColor:'beige',
                alignItems:'center',
                flexDirection:'column',
                justifyContent:'center'
            }}
        >
            <Typography 
                sx={{
                    fontSize: 40,
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    padding: 5
                }}
            >
                Service Login
            </Typography>
            <GoogleLoginButton/>
            <DropboxLoginButton/>
        </Box>
    )
}