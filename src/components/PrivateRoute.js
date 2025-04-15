// components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem('token'); // Or wherever you store your token
    console.log("Token:", token);
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;