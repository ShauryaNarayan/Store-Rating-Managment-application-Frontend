// frontend/src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Import Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

// Custom Protected Route for v5
const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
    const { user, loading } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={(props) => {
                if (loading) return <div>Loading...</div>;

                // 1. Not Logged In? -> Go to Login
                if (!user) {
                    return <Redirect to="/login" />;
                }

                // 2. Logged In but Wrong Role? -> Go to their Dashboard
                if (allowedRoles && !allowedRoles.includes(user.role)) {
                    if (user.role === 'admin') return <Redirect to="/admin/dashboard" />;
                    if (user.role === 'owner') return <Redirect to="/owner/dashboard" />;
                    if (user.role === 'user') return <Redirect to="/user/dashboard" />;
                    return <Redirect to="/login" />;
                }

                // 3. Authorized -> Render the Component
                return <Component {...props} />;
            }}
        />
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
                    <Switch>
                        {/* Public Routes */}
                        <Route path="/login" component={Login} />
                        <Route path="/signup" component={Signup} />
                        
                        {/* Protected Routes */}
                        <ProtectedRoute 
                            path="/admin/dashboard" 
                            component={AdminDashboard} 
                            allowedRoles={['admin']} 
                        />
                        
                        <ProtectedRoute 
                            path="/owner/dashboard" 
                            component={OwnerDashboard} 
                            allowedRoles={['owner']} 
                        />
                        
                        <ProtectedRoute 
                            path="/user/dashboard" 
                            component={UserDashboard} 
                            allowedRoles={['user']} 
                        />

                        {/* Default Redirect */}
                        <Route exact path="/">
                            <Redirect to="/login" />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;