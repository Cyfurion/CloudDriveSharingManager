import { SearchBar, QueryBuilderButton, LogOutButton, AppLogo } from "./";
import { Box, Grid } from "@mui/material";

export default function UserNavBar() {
    return (
        <Grid
            container
            direction="row"
            justifyContent="flex"
            alignItems="inline-box"      
            maxHeight="65px"  
        >
            <Box>
                <AppLogo />
            </Box>
            <Box>
                <SearchBar />
            </Box>
            <Box>
                <QueryBuilderButton />
            </Box>
            <Box>
                <LogOutButton />
            </Box>
        </Grid>
    );
}
