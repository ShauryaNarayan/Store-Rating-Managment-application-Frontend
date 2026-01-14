import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Navbar({ title }) {
    const { user, logout } = useContext(AuthContext);

    return (
        <AppBar position="static" style={{ backgroundColor: '#ffffff', boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', padding: '0 10px' }}>
            <Toolbar style={{ justifyContent: 'space-between' }}>

                {/* LEFT SIDE: LOGO / BRAND */}
                <Box display="flex" alignItems="center">
                    <Typography variant="h5" style={{ fontWeight: 'bold', color: '#333', marginRight: '10px' }}>
                        ⚡ RateMyShop
                    </Typography>

                    {/* Vertical Divider */}
                    <div style={{ width: '1px', height: '25px', backgroundColor: '#e0e0e0', margin: '0 15px' }}></div>

                    <Typography variant="body1" style={{ color: '#666', fontWeight: 500 }}>
                        {title}
                    </Typography>
                </Box>

                {/* RIGHT SIDE: USER INFO & LOGOUT */}
                <Box display="flex" alignItems="center" gap={3}>
                    {/* User Name Display */}
                    <Box display="flex" alignItems="center" style={{ color: '#555' }}>
                        <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', width: 32, height: 32, fontSize: 14, marginRight: 1 }}>
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                        <Typography variant="body2" style={{ fontWeight: 600 }}>
                            {user?.name?.split(' ')[0]} 
                        </Typography>
                    </Box>

                    {/* Styled Logout Button (Pill Shape) */}
                    <Button
                        onClick={logout}
                        variant="contained"
                        color="primary"
                        endIcon={<LogoutIcon style={{ fontSize: 18 }} />}
                        style={{
                            borderRadius: '50px', // Pill shape
                            textTransform: 'none',
                            padding: '6px 20px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)' 
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}