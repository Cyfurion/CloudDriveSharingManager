import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';
import { Divider } from '@mui/material/';



export default function FileCard ( props ) {
    return (
        <Box>
            <ListItem sx={{backgroundColor:'beige'}}>
            <InsertDriveFileIcon />
                <Box sx={{paddingLeft:1, flexDirection: 'row', width:'33%'}}>{props.name}</Box>
                <Box sx={{paddingLeft:1, flexDirection: 'row', width: '33%'}}>{props.ownerEmail}</Box>
                <Box sx={{paddingLeft:1, flexDirection: 'row', width: '33%'}}>{props.dateCreated}</Box>
            </ListItem>
            <Divider />
        </Box>
        
    )
}
