import { SearchBar, QueryBuilderButton, LogOutButton, AppLogo } from "./";
import { Box, Grid } from "@mui/material";

export default function UserNavBar() {
    return (
        <div class="flex flex-nowrap justify-between p-3">
            <div>
                <AppLogo />
            </div>
            <div class="flex">
                <SearchBar />
                <QueryBuilderButton />
            </div>
            <div>
                <LogOutButton />
            </div>
        </div>
    );
}
