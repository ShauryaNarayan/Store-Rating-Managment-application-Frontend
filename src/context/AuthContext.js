import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Check if user is already logged in (on page refresh)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    setUser({ token, ...decoded });
                }
            } catch (error) {
                console.error("Invalid token found");
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    // 2. Login Function (Connects to Backend & Returns User Role)
    const login = async (email, password) => {
        // Send email/pass to backend
        const res = await api.post('/auth/login', { email, password });
        
        // Get the token from the response
        const { token } = res.data;

        // Save token to browser storage
        localStorage.setItem('token', token);
        
        // Decode token to get user ID and Role
        const decoded = jwtDecode(token);
        
        // Update global state
        setUser({ token, ...decoded });

        // CRITICAL: Return the decoded user so Login.js can check the role!
        return decoded;
    };

    // 3. Logout Function
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        // Optional: specific redirect logic can be handled in components
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};