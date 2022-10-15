import React from "react"
import { Typography } from "@mui/material"
import AuthContext from "../auth"
import { useContext } from "react"

export default function AppLogo() {
    const { auth } = useContext(AuthContext)

    let title = "Cloud Drive Sharing Manager"
    if( auth.isAuthorized){
        title = "CDSM";
    }

    return(
        <Typography noWrap
        sx={{
            color: 'black',
            fontFamily: 'monospace',
            fontWeight: 40,
            fontSize: 35
        }}>
            {title}
        </Typography>
    )
}
