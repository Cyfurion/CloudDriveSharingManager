import AdapterContext from '../cloudservices';

import React, { useContext, useState } from 'react';
import FileCard from './FileCard';
import { Box } from '@mui/system';
import { Divider, ListItem } from '@mui/material';

export default function WorkSpace() {
    const { adapter } = useContext(AdapterContext);

    const [files, setFiles] = useState(null);

    if (files == null) {
        if (adapter.googleAdapter) {
            adapter.googleAdapter.retrieve().then((value) => {
                setFiles(value);
            });
        } else if (adapter.dropboxAdapter) {
            adapter.dropboxAdapter.retrieve().then((value) => {
                setFiles(value);
            });
        }
    }

    if (files === null) {
        return <Box sx={{ border: 5, borderColor: 'black', backgroundColor: 'beige'  }}>{"LOADING"}</Box>;
    } else {
        return (
            <Box sx={{overflowY:'auto', maxHeight: 688, border: 5, borderColor: 'black', backgroundColor: 'beige'}}>
                <Box >
                <ListItem>
                    <Box sx={{ paddingLeft: 4, width: '33%' }}>Name</Box>
                    <Box sx={{ paddingLeft: 1, width: '33%' }}>Owner Email</Box>
                    <Box sx={{ paddingLeft: 1, width: '33%' }}>Date Created</Box>
                </ListItem>
                <Divider />
                {files.map((file) => (
                    <FileCard name={file.name} ownerEmail={file.owners[0].emailAddress} dateCreated={file.createdTime} />
                ))}
            </Box>
            </Box>
        );
    }
}
