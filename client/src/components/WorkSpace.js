import * as React from 'react';
import FileCard from './FileCard';
import { Box , Container} from '@mui/system';
import AuthContext from '../auth';
import { useContext } from 'react';
import {Divider, ListItem } from '@mui/material';


export default function BasicTable() {
    const { auth } = useContext(AuthContext);
  return (
    <Box sx={{border: 5, borderColor: 'black',backgroundColor:'beige'}}>
        <ListItem  >
            <Box sx={{ paddingLeft: 4, width:'33%'}}>Name</Box>
            <Box sx={{ paddingLeft : 1, width: '33%'}}>Owner Email</Box>
            <Box sx={{ paddingLeft: 1, width: '33%'}}>Date Created</Box>
        </ListItem>
        <Divider />
       { auth.jankFiles.map( ( file) =>(
            <FileCard  name={file.name} ownerEmail={file.owners[0].emailAddress} dateCreated={file.createdTime}/>
        ))}
    </Box>
  );
}
