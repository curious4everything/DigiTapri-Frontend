// src/components/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/authService';
import { Table } from 'react-bootstrap';

function Home() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token'); // Get token from local storage

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) { // Only fetch profile if token exists
        try {
          const data = await getUserProfile();
          setProfile(data);
        } catch (err) {
          setError(err.message || 'Failed to fetch profile');
        }
      } else {
        setError('Please log in to view your profile.');
      }
    };
    fetchProfile();
  }, [token]);

  
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile && token) {
    return <div>Loading profile...</div>;
  }

  if (!profile && !token) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
      <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '100px', width: '100%' }}>
    <div style={{ width: '50%' }}> {/* Adjust width as needed */}
        <Table striped bordered hover className="w-100">
            <thead>
                <tr>
                    <th colSpan="2" className="text-center">User Profile</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Username</td>
                    <td>{profile.username}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{profile.email}</td>
                </tr>
            </tbody>
        </Table>
    </div>
</div>
  );
}

export default Home;