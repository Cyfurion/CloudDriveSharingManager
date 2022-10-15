import { Button } from "@mui/material";

export default function QueryBuilderButton () {
    return (
        <Button sx={{
            color: 'black', 
            backgroundColor: 'yellow', 
            minWidth: 'max-content', 
            whitespace: 'nowrap',
            borderRadius: 2,
            boxShadow: 4,
            fontSize: 18
        }}>
            Query Builder
        </Button>
    );
}
