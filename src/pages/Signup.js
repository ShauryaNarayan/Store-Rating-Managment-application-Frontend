import React, { useState } from 'react';
import api from '../api/axios';
import { useHistory, Link } from 'react-router-dom';
import { 
    Box, Button, TextField, Typography, Paper, 
    InputAdornment, IconButton, Alert 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import HomeIcon from '@mui/icons-material/Home';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import './Login.css'; // Re-using the beautiful styles from Login

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', address: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const history = useHistory();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        
        // Basic Validation
        if (formData.name.length < 5) return setError("Name must be at least 5 characters");
        if (formData.password.length < 6) return setError("Password must be at least 6 characters");

        try {
            await api.post('/auth/signup', formData);
            setSuccess(true);
            setTimeout(() => {
                history.push('/login');
            }, 2000); // Redirect to login after 2 seconds
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed. Try again.');
        }
    };

    return (
        <div className="login-root">
            <div className="login-overlay"></div>

            <Paper elevation={10} className="login-card">
                
                {/* Icon Header */}
                <div className="icon-circle" style={{ backgroundColor: '#2e7d32' }}> {/* Green for Signup */}
                    <PersonAddIcon style={{ fontSize: 35 }} />
                </div>

                <Typography component="h1" variant="h4" style={{ fontWeight: 800, color: '#333', marginBottom: '10px' }}>
                    Join Us!
                </Typography>
                <Typography variant="body1" style={{ color: '#666', marginBottom: '20px' }}>
                    Create your account to start rating
                </Typography>

                {error && <Alert severity="error" style={{ width: '100%', marginBottom: '20px' }}>{error}</Alert>}
                {success && <Alert severity="success" style={{ width: '100%', marginBottom: '20px' }}>Account created! Redirecting...</Alert>}

                <Box component="form" onSubmit={handleSignup} style={{ width: '100%' }}>
                    
                    {/* Name Field */}
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-spacing"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>
                            ),
                            style: { borderRadius: '10px' }
                        }}
                    />

                    {/* Email Field */}
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-spacing"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>
                            ),
                            style: { borderRadius: '10px' }
                        }}
                    />

                    {/* Password Field */}
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        className="input-spacing"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            style: { borderRadius: '10px' }
                        }}
                    />

                    {/* Address Field */}
                    <TextField
                        variant="outlined"
                        fullWidth
                        label="Address (Optional)"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="input-spacing"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><HomeIcon color="action" /></InputAdornment>
                            ),
                            style: { borderRadius: '10px' }
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="submit-btn"
                        style={{ background: 'linear-gradient(45deg, #43a047 30%, #66bb6a 90%)' }} // Green Gradient for Signup
                    >
                        Create Account
                    </Button>

                    <Box mt={3}>
                        <Link to="/login" style={{ color: '#2e7d32', textDecoration: 'none', fontWeight: 'bold' }}>
                            Already have an account? Log In
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </div>
    );
}