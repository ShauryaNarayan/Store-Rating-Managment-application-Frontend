import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { 
    Container, Grid, Card, CardContent, Typography, 
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip 
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export default function OwnerDashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/owner/dashboard');
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch owner data", err);
            }
        };
        fetchData();
    }, []);

    if (!data) return <Typography style={{ padding: 20 }}>Loading dashboard...</Typography>;

    return (
        <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Navbar title="Store Analytics" />

            <Container maxWidth="lg" style={{ marginTop: '40px' }}>
                
                <Box mb={4}>
                    <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                        Dashboard: {data.storeName}
                    </Typography>
                    <Typography color="textSecondary">Track your customer feedback</Typography>
                </Box>

                {/* STAT CARD */}
                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} md={4}>
                        <Card style={{ backgroundColor: '#fff3e0', borderLeft: '5px solid #ff9800' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Average Rating
                                </Typography>
                                <Box display="flex" alignItems="center">
                                    <Typography variant="h2" style={{ fontWeight: 'bold', color: '#333' }}>
                                        {data.averageRating ? data.averageRating.toFixed(1) : "0.0"}
                                    </Typography>
                                    <StarIcon style={{ fontSize: 50, color: '#ff9800', marginLeft: 10 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                            <Typography color="textSecondary" variant="h5">
                                Total Reviews: {data.ratings.length}
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>

                {/* RATINGS TABLE */}
                <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
                    Customer Reviews
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead style={{ backgroundColor: '#eeeeee' }}>
                            <TableRow>
                                <TableCell><strong>Customer Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Rating</strong></TableCell>
                                <TableCell><strong>Date</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.ratings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">No ratings yet.</TableCell>
                                </TableRow>
                            ) : (
                                data.ratings.map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                icon={<StarIcon style={{ width: 15 }} />} 
                                                label={`${row.rating} / 5`} 
                                                size="small"
                                                style={{ 
                                                    backgroundColor: row.rating >= 4 ? '#e8f5e9' : '#ffebee', 
                                                    color: row.rating >= 4 ? '#2e7d32' : '#c62828'
                                                }} 
                                            />
                                        </TableCell>
                                        <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </div>
    );
}