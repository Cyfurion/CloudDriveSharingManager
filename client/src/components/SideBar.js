import { Grid, Button, Typography } from "@mui/material";
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
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Button size='medium' variant='contained'sx={{
                    backgroundColor: 'blue',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '25%'
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
            </Grid>
            <Grid item xs={12}>
                <Button size='medium' variant='contained'sx={{
                    backgroundColor: 'blue',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '25%'
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
            </Grid>
            <Grid item xs={12}>
                <Button size='medium' variant='contained'sx={{
                    backgroundColor: 'blue',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '25%'
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
            </Grid>
            <Grid item xs={12}>
                <Button size='medium' variant='contained'sx={{
                    backgroundColor: 'blue',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '25%'
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
            </Grid>
            <Grid item xs={12}>
                <Button size='medium' variant='contained'sx={{
                    backgroundColor: 'blue',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '25%'
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
            </Grid>
            <Grid item xs={12}>
                <Button size='medium' variant='contained'sx={{
                    backgroundColor: 'blue',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '25%'
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
            </Grid>
            <Grid item xs={12}>
                <Button size='medium' variant='contained'sx={{
                    backgroundColor: 'blue',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '25%'
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
            </Grid>
            <Grid item xs={12}>
                <Button size='medium' variant='contained'sx={{
                    backgroundColor: 'blue',
                    fontSize : 25,
                    color: 'white',
                    borderRadius: 4,
                    width: '25%'
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
            </Grid>
        </Grid>

    );
}