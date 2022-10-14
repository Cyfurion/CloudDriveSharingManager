import { SearchBar, QueryBuilderButton, LogOutButton } from "./";
import { Box } from "@mui/system";

export default function UserNavBar() {
    return ( 
        <Box noWrap >
            <SearchBar/>
            <QueryBuilderButton/>
            <LogOutButton/>
        </Box>
    );
}