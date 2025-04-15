import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import NavbarComponent from './components/navbar';
import Login from './pages/auth/Login';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import Register from "./pages/auth/Register";
import Feed from "./pages/feed";
import Profile from './components/profile'; // Import Profile component
import { PostProvider } from './context/PostContext';

function App() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const usernameOrEmail = localStorage.getItem('usernameOrEmail'); // Get username or email
        if (usernameOrEmail) {
            // Fetch user profile data using username or email
            fetch(`/api/profile/${usernameOrEmail}`) // Replace with your backend profile endpoint
                .then(response => response.json())
                .then(data => setUser(data))
                .catch(error => {
                    console.error('Error fetching profile:', error);
                    navigate('/login'); // Redirect to login if profile fetch fails
                });
        }
    }, [navigate]);

    return (
        <div>
            <PostProvider>
            <NavbarComponent />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile user={user} />} /> {/* Profile route */}
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route path="/feed" element={<Feed />} />
                </Route>
            </Routes>
            </PostProvider>
        </div>
    );
}

export default App;