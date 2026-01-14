import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { 
    Container, Grid, Card, CardContent, Typography, Button, 
    Box, Tabs, Tab, TextField, MenuItem, Select, InputLabel, FormControl,
    Table, TableBody, TableCell, TableHead, TableRow, Paper, Alert, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [tabValue, setTabValue] = useState(0);
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
    // REVERTED: Removed image states
    const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });

    useEffect(() => { fetchDashboardData(); }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/admin/dashboard');
            setStats(res.data);
            const usersRes = await api.get('/admin/users');
            setUsers(usersRes.data);
            const storesRes = await api.get('/admin/stores');
            setStores(storesRes.data);
        } catch (err) { console.error("Failed to fetch data"); }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            await api.post('/admin/users', newUser);
            setMessage({ type: 'success', text: 'User created successfully!' });
            fetchDashboardData(); 
            setNewUser({ name: '', email: '', password: '', address: '', role: 'user' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to create user' });
        }
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            // REVERTED: Sending only basic data
            await api.post('/admin/stores', newStore);
            setMessage({ type: 'success', text: 'Store created successfully!' });
            fetchDashboardData();
            setNewStore({ name: '', email: '', address: '', owner_id: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to create store' });
        }
    };

    const handleDeleteUser = async (id) => {
        if(!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setMessage({ type: 'success', text: 'User deleted!' });
            fetchDashboardData();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || "Delete failed" });
        }
    };

    const handleDeleteStore = async (id) => {
        if(!window.confirm("Are you sure you want to delete this store?")) return;
        try {
            await api.delete(`/admin/stores/${id}`);
            setMessage({ type: 'success', text: 'Store deleted!' });
            fetchDashboardData();
        } catch (err) {
            setMessage({ type: 'error', text: "Delete failed" });
        }
    };

    return (
        <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Navbar title="System Admin Dashboard" />
            <Container maxWidth="lg" style={{ marginTop: '40px', paddingBottom: '50px' }}>
                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} md={4}><Card style={{ backgroundColor: '#e3f2fd' }}><CardContent><Typography color="textSecondary">Total Users</Typography><Typography variant="h3">{stats.totalUsers}</Typography></CardContent></Card></Grid>
                    <Grid item xs={12} md={4}><Card style={{ backgroundColor: '#e8f5e9' }}><CardContent><Typography color="textSecondary">Total Stores</Typography><Typography variant="h3">{stats.totalStores}</Typography></CardContent></Card></Grid>
                    <Grid item xs={12} md={4}><Card style={{ backgroundColor: '#fff3e0' }}><CardContent><Typography color="textSecondary">Total Ratings</Typography><Typography variant="h3">{stats.totalRatings}</Typography></CardContent></Card></Grid>
                </Grid>

                {message.text && <Alert severity={message.type} style={{ marginBottom: '20px' }}>{message.text}</Alert>}

                <Paper>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} indicatorColor="primary" textColor="primary" centered>
                        <Tab label="User Management" />
                        <Tab label="Store Management" />
                    </Tabs>

                    <TabPanel value={tabValue} index={0}>
                        <Box component="form" onSubmit={handleCreateUser} sx={{ mb: 4, p: 2, border: '1px dashed #ccc' }}>
                           <Typography variant="h6" gutterBottom>Add New User</Typography>
                           <Grid container spacing={2}>
                               <Grid item xs={12} sm={6}><TextField fullWidth label="Name (Min 10 chars)" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} /></Grid>
                               <Grid item xs={12} sm={6}><TextField fullWidth label="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} /></Grid>
                               <Grid item xs={12} sm={6}><TextField fullWidth label="Password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} /></Grid>
                               <Grid item xs={12} sm={6}><TextField fullWidth label="Address" value={newUser.address} onChange={e => setNewUser({...newUser, address: e.target.value})} /></Grid>
                               <Grid item xs={12} sm={6}>
                                   <FormControl fullWidth>
                                       <InputLabel>Role</InputLabel>
                                       <Select value={newUser.role} label="Role" onChange={e => setNewUser({...newUser, role: e.target.value})}>
                                           <MenuItem value="user">Normal User</MenuItem>
                                           <MenuItem value="owner">Store Owner</MenuItem>
                                           <MenuItem value="admin">Admin</MenuItem>
                                       </Select>
                                   </FormControl>
                               </Grid>
                               <Grid item xs={12}><Button type="submit" variant="contained" color="primary">Create User</Button></Grid>
                           </Grid>
                       </Box>
                        <Table>
                            <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell align="right">Action</TableCell></TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell>{u.name}</TableCell><TableCell>{u.email}</TableCell>
                                        <TableCell><span style={{ padding: '5px 10px', borderRadius: '15px', color: 'white', backgroundColor: u.role === 'admin' ? '#d32f2f' : u.role === 'owner' ? '#2e7d32' : '#1976d2' }}>{u.role.toUpperCase()}</span></TableCell>
                                        <TableCell align="right">{u.role !== 'admin' && (<IconButton onClick={() => handleDeleteUser(u.id)} color="error"><DeleteIcon /></IconButton>)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <Box component="form" onSubmit={handleCreateStore} sx={{ mb: 4, p: 2, border: '1px dashed #ccc' }}>
                            <Typography variant="h6" gutterBottom>Add New Store</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}><TextField fullWidth label="Store Name" value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth label="Store Email" value={newStore.email} onChange={e => setNewStore({...newStore, email: e.target.value})} /></Grid>
                                <Grid item xs={12}><TextField fullWidth label="Address" value={newStore.address} onChange={e => setNewStore({...newStore, address: e.target.value})} /></Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Owner</InputLabel>
                                        <Select value={newStore.owner_id} label="Owner" onChange={e => setNewStore({...newStore, owner_id: e.target.value})}>
                                            {users.filter(u => u.role === 'owner').map(owner => (
                                                <MenuItem key={owner.id} value={owner.id}>{owner.name} ({owner.email})</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {/* REVERTED: No Image Inputs here anymore */}
                                <Grid item xs={12}><Button type="submit" variant="contained" color="primary">Create Store</Button></Grid>
                            </Grid>
                        </Box>
                        <Table>
                            <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow><TableCell>Store Name</TableCell><TableCell>Address</TableCell><TableCell>Avg Rating</TableCell><TableCell align="right">Action</TableCell></TableRow>
                            </TableHead>
                            <TableBody>
                                {stores.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell>{s.name}</TableCell><TableCell>{s.address}</TableCell><TableCell>{s.averageRating ? s.averageRating.toFixed(1) : 'N/A'}</TableCell>
                                        <TableCell align="right"><IconButton onClick={() => handleDeleteStore(s.id)} color="error"><DeleteIcon /></IconButton></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabPanel>
                </Paper>
            </Container>
        </div>
    );
}