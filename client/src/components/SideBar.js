import { Button, Typography, Box, Stack } from "@mui/material";
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import LockIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';
import HistoryIcon from '@mui/icons-material/History';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import ScreenLockLandscapeIcon from '@mui/icons-material/ScreenLockLandscape';
import LockResetIcon from '@mui/icons-material/LockReset';
import HomeIcon from '@mui/icons-material/Home';

export default function SideBar() {
    return (
        <Box sx={{ border: 5, borderRight: 0, height: 688}} >
            <Stack sx={{ padding: 2}}spacing={3} backgroundColor='beige' alignItems='center'>
                <Button variant='contained'sx={{
                    backgroundColor: '00AAFF',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '75%'
                    }}
                    startIcon={<TroubleshootIcon sx={{color:'black'}}/>}
                >
                    <Typography sx={{
                        backgroundColor: 'inherited',
                        color: 'white',
                        padding: 1
                    }}>
                    Analysis
                    </Typography>
                </Button>
                <Button size='medium' variant='contained'sx={{
                    backgroundColor: '00AAFF',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '75%'
                    }}
                    startIcon={<LockIcon sx={{color:'black'}}/>}
                >
                    <Typography sx={{
                        backgroundColor: 'inherited',
                        color: 'white',
                        padding: 1
                    }}>
                    Permissions
                    </Typography>
                </Button>
                <Button size='medium' variant='contained'sx={{
                    backgroundColor: '00AAFF',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '75%'
                    }}
                    startIcon={<RefreshIcon sx={{color:'black'}}/>}
                >
                    <Typography sx={{
                        backgroundColor: 'inherited',
                        color: 'white',
                        padding: 1
                    }}>
                    Refresh
                    </Typography>
                </Button>
                <Button size='medium' variant='contained'sx={{
                    backgroundColor: '00AAFF',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '75%'
                    }}
                    startIcon={<HistoryIcon sx={{color:'black'}}/>}
                >
                    <Typography sx={{
                        backgroundColor: 'inherited',
                        color: 'white',
                        padding: 1
                    }}>
                    History
                    </Typography>
                </Button>
                <Button size='medium' variant='contained'sx={{
                    backgroundColor: '00AAFF',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '75%'
                    }}
                    startIcon={<FlipCameraIosIcon sx={{color:'black'}}/>}
                >
                    <Typography sx={{
                        backgroundColor: 'inherited',
                        color: 'white',
                        padding: 1
                    }}>
                    Switch Snapshot
                    </Typography>
                </Button>
                <Button size='medium' variant='contained'sx={{
                    backgroundColor: '00AAFF',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '75%'
                    }}
                    startIcon={<ScreenLockLandscapeIcon sx={{color:'black'}}/>}
                >
                    <Typography sx={{
                        backgroundColor: 'inherited',
                        color: 'white',
                        padding: 1
                    }}>
                    Access Control Requirements
                    </Typography>
                </Button>
                <Button size='medium' variant='contained'sx={{
                    backgroundColor: '00AAFF',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '75%'
                    }}
                    startIcon={<LockResetIcon sx={{color:'black'}}/>}
                >
                    <Typography sx={{
                        backgroundColor: 'inherited',
                        color: 'white',
                        padding: 1
                    }}>
                    Validate ACRs
                    </Typography>
                </Button>
                <Button size='medium' variant='contained'sx={{
                    backgroundColor: '00AAFF',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '75%'
                    }}
                    startIcon={<HomeIcon sx={{color:'black'}}/>}
                >
                    <Typography sx={{
                        backgroundColor: 'inherited',
                        color: 'white',
                        padding: 1
                    }}>
                    Home
                    </Typography>
                </Button>
            </Stack>
        </Box>
    );
}
