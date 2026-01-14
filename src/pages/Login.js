import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHistory, Link } from 'react-router-dom';
import { 
    Box, Button, TextField, Typography, Paper, 
    InputAdornment, IconButton, Alert 
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    
    const { login } = useContext(AuthContext);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // 1. Wait for login to finish and GET THE USER INFO
            // (This works because we updated AuthContext to return the user data)
            const user = await login(email, password);
            
            // 2. Redirect based on ROLE
            if (user && user.role === 'admin') {
                history.push('/admin/dashboard');
            } else if (user && user.role === 'owner') {
                history.push('/owner/dashboard'); 
            } else {
                // Default for 'user' or anyone else
                history.push('/user/dashboard'); 
            }

        } catch (err) {
            console.error("Login failed:", err);
            // Error Handling Logic
            if (err.response) {
                setError(err.response.data.error || 'Login failed');
            } else if (err.request) {
                setError('Network Error: Server is not running.');
            } else {
                setError('Invalid credentials or Server Error');
            }
        }
    };

    return (
        <div className="login-root">
            <div className="login-overlay"></div>

            <Paper elevation={10} className="login-card">
                
                <div className="icon-circle">
                    <LockIcon style={{ fontSize: 35 }} />
                </div>

                <Typography component="h1" variant="h4" style={{ fontWeight: 800, color: '#333', marginBottom: '10px' }}>
                    Welcome Back!
                </Typography>
                <Typography variant="body1" style={{ color: '#666', marginBottom: '30px' }}>
                    Sign in to manage your store
                </Typography>

                {error && <Alert severity="error" style={{ width: '100%', marginBottom: '20px' }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} style={{ width: '100%' }}>
                    
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-spacing"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon color="primary" />
                                </InputAdornment>
                            ),
                            style: { borderRadius: '10px' }
                        }}
                    />

                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-spacing"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon color="primary" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            style: { borderRadius: '10px' }
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="submit-btn"
                    >
                        Sign In
                    </Button>

                    <Box mt={3}>
                        <Link to="/signup" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
                            New here? Create an account
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </div>
    );
}