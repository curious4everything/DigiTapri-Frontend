import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePosts} from '../../context/PostContext'; // Import the clearCache function

function Login() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { clearCache } = usePosts();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!usernameOrEmail || !password) {
            toast.error('Please enter both username/email and password.');
            return;
        }

        try {
            const data = await login({ usernameOrEmail, password });
            localStorage.setItem('token', data.token);
            // Clear the cache after login
             clearCache();
            toast.success('Login Successful');

            setTimeout(() => {
                navigate('/');
            }, 500);
        } catch (err) {
            console.log("Error response data:", err.response && err.response.data ? err.response.data : err);
        
            if (err.response && err.response.data && err.response.data.error) {
                // Backend-provided error
                if (err.response.data.error === 'Invalid credentials') {
                    toast.error('Invalid credentials. Please check your username/email and password.');
                } else if (err.response.data.error === 'User not found') {
                    toast.error('User not found.');
                } else if (err.response.data.error === 'Password does not match') {
                    toast.error('Password does not match.');
                } else {
                    toast.error(err.response.data.error); // Display the backend error
                }
            } else if (err.message === 'Failed to fetch') {
                // Network error
                toast.error('Network error. Please check your internet connection.');
            } else {
                // Generic error
                toast.error(err.response?.data?.error || err.message || err || 'Login failed');
            }
            // Remove this line:
            // toast.error('Direct Toast');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <fieldset style={{ width: '800px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <legend style={{ textAlign: 'center', fontWeight: 'bold' }}>Login to your account</legend>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'inline-block', width: '120px', textAlign: 'right', marginRight: '10px' }}>
                            Username/Email:
                        </label>
                        <input
                            type="text"
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                            style={{ width: 'calc(100% - 130px)', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'inline-block', width: '120px', textAlign: 'right', marginRight: '10px' }}>
                            Password:
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: 'calc(100% - 130px)', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ textAlign: 'center', marginTop: "10px", marginBottom: "10px" }}>
                        <input type="checkbox" id="captcha" name="human" value="yes" required />
                        <label htmlFor="captcha">Are You a Human?</label>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Login
                        </button>
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            Don't have an account? <Link to="/register">Register here</Link>
                        </div>

                    </div>
                </form>
            </fieldset>
            <ToastContainer />
        </div>
    );
}

export default Login;