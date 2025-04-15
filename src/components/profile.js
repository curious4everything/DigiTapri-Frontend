// Profile.js
import React from 'react';
import { Table } from 'react-bootstrap';

function Profile({ user }) {
    if (!user) {
        return <p>Loading profile...</p>; // Or handle loading state
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
                    <td>{user.username}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{user.email}</td>
                </tr>
            </tbody>
        </Table>
    </div>
</div>

    );
}

export default Profile;