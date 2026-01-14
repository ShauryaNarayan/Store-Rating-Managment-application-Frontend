import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { 
    Container, Grid, Card, CardContent, Typography, 
    Box, TextField, MenuItem, Select, FormControl, 
    Rating, Snackbar, Alert, Chip, InputAdornment
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import StorefrontIcon from '@mui/icons-material/Storefront'; // Added a simple icon for the card header

export default function UserDashboard() {
    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({ search: '', sort: '' });
    const [msg, setMsg] = useState({ open: false, type: 'success', text: '' });

    // SIMPLIFIED FETCH: No image processing needed anymore
    const fetchStores = useCallback(async () => {
        try {
            const query = `/user/stores?search=${filters.search}&sort=${filters.sort}`;
            const res = await api.get(query);
            setStores(res.data);
        } catch (err) {
            console.error("Failed to fetch stores");
        }
    }, [filters]);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    const handleRate = async (storeId, newValue, oldValue) => {
        if (!newValue) return;
        try {
            if (oldValue) {
                await api.put('/user/rating', { store_id: storeId, rating: newValue });
                setMsg({ open: true, type: 'success', text: 'Rating updated successfully!' });
            } else {
                await api.post('/user/rating', { store_id: storeId, rating: newValue });
                setMsg({ open: true, type: 'success', text: 'Rating submitted!' });
            }
            fetchStores();
        } catch (err) {
            setMsg({ open: true, type: 'error', text: 'Failed to submit rating.' });
        }
    };

    return (
        <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Navbar title="Explore Stores" />
            
            <Container maxWidth="xl" style={{ marginTop: '40px', paddingBottom: '50px' }}>
                
                {/* --- NEUMORPHIC SEARCH BAR --- */}
                 <Box mb={5} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField 
                        placeholder="Search for stores..." 
                        variant="outlined" 
                        value={filters.search} 
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })} 
                        fullWidth 
                        sx={{ 
                            flex: 2, 
                            '& .MuiOutlinedInput-root': { 
                                borderRadius: '50px', 
                                backgroundColor: '#ffffff', 
                                boxShadow: '0px 4px 15px rgba(0,0,0,0.05)', 
                                '& fieldset': { border: '1px solid transparent' }, 
                                '&:hover': { boxShadow: '0px 6px 20px rgba(0,0,0,0.1)' } 
                            } 
                        }} 
                        InputProps={{ 
                            startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: '#1976d2' }} /></InputAdornment>), 
                        }}
                    />
                     <FormControl 
                        variant="outlined" 
                        sx={{ 
                            flex: 1, 
                            minWidth: '200px', 
                            '& .MuiOutlinedInput-root': { 
                                borderRadius: '50px', 
                                backgroundColor: '#fff', 
                                boxShadow: '0px 4px 15px rgba(0,0,0,0.05)', 
                                '& fieldset': { border: '1px solid transparent' }, 
                            } 
                        }}
                    >
                        <Select 
                            value={filters.sort} 
                            onChange={(e) => setFilters({ ...filters, sort: e.target.value })} 
                            displayEmpty
                        >
                            <MenuItem value=""><em>Sort By: Recommended</em></MenuItem>
                            <MenuItem value="name">Name (A-Z)</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* --- STORES GRID (Simple & Clean) --- */}
                <Grid container spacing={4}>
                    {stores.length === 0 ? (
                        <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={10} color="#9e9e9e">
                             <SentimentDissatisfiedIcon style={{ fontSize: 60, marginBottom: 10, opacity: 0.5 }} />
                             <Typography variant="h5" fontWeight="bold">No stores found</Typography>
                             <Typography variant="body1">Try adjusting your search or filters.</Typography>
                        </Box>
                    ) : (
                        stores.map((store) => (
                            <Grid item xs={12} md={6} lg={4} key={store.id}>
                                <Card sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    borderRadius: '16px', 
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)', // Softer shadow
                                    transition: 'transform 0.2s ease', 
                                    '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' } 
                                }}>
                                    <CardContent style={{ padding: '25px', flexGrow: 1 }}>
                                        
                                        {/* Header: Icon + Name + Rating Badge */}
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Box sx={{ backgroundColor: '#e3f2fd', borderRadius: '50%', p: 1, display: 'flex' }}>
                                                    <StorefrontIcon sx={{ color: '#1976d2' }} />
                                                </Box>
                                                <Typography variant="h6" fontWeight="bold" style={{ lineHeight: 1.2 }}>
                                                    {store.name}
                                                </Typography>
                                            </Box>
                                            
                                            <Chip 
                                                icon={<StarIcon style={{ color: '#fff', fontSize: '14px' }} />} 
                                                label={store.overall_rating ? store.overall_rating.toFixed(1) : "New"} 
                                                size="small" 
                                                style={{ 
                                                    backgroundColor: store.overall_rating >= 4 ? '#2e7d32' : store.overall_rating >= 3 ? '#f9a825' : '#757575', 
                                                    color: 'white', fontWeight: 'bold', height: '24px' 
                                                }} 
                                            />
                                        </Box>

                                        {/* Address */}
                                        <Box display="flex" alignItems="center" mb={3} color="text.secondary" sx={{ backgroundColor: '#f5f5f5', p: 1, borderRadius: '8px' }}>
                                            <LocationOnIcon style={{ fontSize: 18, marginRight: 6, color: '#757575' }} />
                                            <Typography variant="body2" noWrap>
                                                {store.address}
                                            </Typography>
                                        </Box>
                                        
                                        <hr style={{ border: '0', borderTop: '1px dashed #eee', margin: '0 0 20px 0' }} />
                                        
                                        {/* Rating Input */}
                                        <Box display="flex" flexDirection="column" alignItems="center">
                                            <Typography variant="caption" color="textSecondary" style={{ marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem' }}>
                                                Rate Your Experience
                                            </Typography>
                                            <Rating 
                                                name={`rating-${store.id}`} 
                                                value={store.my_rating} 
                                                precision={1} 
                                                size="large"
                                                onChange={(event, newValue) => { handleRate(store.id, newValue, store.my_rating); }} 
                                            />
                                        </Box>

                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>

                <Snackbar 
                    open={msg.open} 
                    autoHideDuration={3000} 
                    onClose={() => setMsg({ ...msg, open: false })} 
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity={msg.type} variant="filled" sx={{ borderRadius: '50px', px: 3 }}>
                        {msg.text}
                    </Alert>
                </Snackbar>
            </Container>
        </div>
    );
}