import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import {
    Container, Grid, Card, CardContent, Typography, Button,
    Box, Table, TableBody, TableCell, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Snackbar, Alert, Chip
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';

export default function OwnerDashboard() {
    const [stats, setStats] = useState({
        storeName: '',
        address: '',
        averageRating: 0,
        totalRatings: 0,
        ratingsList: []
    });
    
    // --- Password Change State ---
    const [openPass, setOpenPass] = useState(false);
    const [passData, setPassData] = useState({ old: '', new: '' });
    const [msg, setMsg] = useState({ open: false, type: '', text: '' });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/owner/dashboard');
            setStats(res.data);
        } catch (err) {
            console.error("Failed to fetch owner data");
        }
    };

    // --- Handle Password Change ---
    const handleChangePassword = async () => {
        try {
            await api.patch('/auth/update-password', {
                oldPassword: passData.old,
                newPassword: passData.new
            });
            setMsg({ open: true, type: 'success', text: 'Password changed successfully!' });
            setOpenPass(false);
            setPassData({ old: '', new: '' });
        } catch (err) {
            setMsg({ open: true, type: 'error', text: err.response?.data?.error || 'Failed to update' });
        }
    };

    return (
        <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Navbar title="Owner Dashboard" />

            <Container maxWidth="lg" style={{ marginTop: '40px', paddingBottom: '50px' }}>
                
                {/* --- Header & Change Password Button --- */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            {stats.storeName || "My Store"}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            {stats.address}
                        </Typography>
                    </Box>
                    <Button variant="contained" color="secondary" onClick={() => setOpenPass(true)}>
                        Change Password
                    </Button>
                </Box>

                {/* --- STATS CARDS --- */}
                <Grid container spacing={3} mb={5}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ bgcolor: '#e8f5e9', height: '100%' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Average Rating</Typography>
                                <Box display="flex" alignItems="center">
                                    <Typography variant="h3" fontWeight="bold" sx={{ mr: 2 }}>
                                        {stats.averageRating}
                                    </Typography>
                                    <StarIcon sx={{ fontSize: 40, color: '#2e7d32' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ bgcolor: '#e3f2fd', height: '100%' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Total Reviews</Typography>
                                <Box display="flex" alignItems="center">
                                    <Typography variant="h3" fontWeight="bold" sx={{ mr: 2 }}>
                                        {stats.totalRatings}
                                    </Typography>
                                    <PersonIcon sx={{ fontSize: 40, color: '#1565c0' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* --- RATINGS LIST --- */}
                <Typography variant="h5" gutterBottom fontWeight="bold">Customer Feedback</Typography>
                <Paper sx={{ overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><b>Customer Name</b></TableCell>
                                <TableCell><b>Email</b></TableCell>
                                <TableCell><b>Rating Provided</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stats.ratingsList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">No ratings yet.</TableCell>
                                </TableRow>
                            ) : (
                                stats.ratingsList.map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>{row.user_name}</TableCell>
                                        <TableCell>{row.user_email}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                icon={<StarIcon style={{ color: '#fff', fontSize: '14px' }} />}
                                                label={`${row.rating} / 5`} 
                                                size="small"
                                                style={{ 
                                                    backgroundColor: row.rating >= 4 ? '#2e7d32' : row.rating >= 3 ? '#f9a825' : '#d32f2f', 
                                                    color: 'white', fontWeight: 'bold' 
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>

                {/* --- CHANGE PASSWORD DIALOG --- */}
                <Dialog open={openPass} onClose={() => setOpenPass(false)}>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogContent>
                        <TextField 
                            margin="dense" label="Old Password" type="password" fullWidth 
                            value={passData.old}
                            onChange={(e) => setPassData({...passData, old: e.target.value})} 
                        />
                        <TextField 
                            margin="dense" label="New Password" type="password" fullWidth 
                            value={passData.new}
                            onChange={(e) => setPassData({...passData, new: e.target.value})} 
                            helperText="8-16 chars, 1 Upper, 1 Special"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenPass(false)}>Cancel</Button>
                        <Button onClick={handleChangePassword} variant="contained" color="primary">Update</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={msg.open} autoHideDuration={3000} onClose={() => setMsg({ ...msg, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity={msg.type === 'success' ? 'success' : 'error'} variant="filled">
                        {msg.text}
                    </Alert>
                </Snackbar>

            </Container>
        </div>
    );
}