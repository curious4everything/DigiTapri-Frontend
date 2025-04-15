import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService'; // Assuming you have a register service
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !username || !password) {
            toast.error('Please fill in all fields.');
            return;
        }

        try {
            const userData = { username, email, password };
            await register(userData);
            toast.success('Registration Successful');
            // Delay navigation slightly
            setTimeout(() => {
                navigate('/login');
            }, 500);
        } catch (err) {
            console.error("Registration error:", err);

            if (err.response && err.response.data && err.response.data.error) {
                // Backend-provided error message
                if (err.response.data.error === "Username already exists") {
                    toast.error("Username already exists");
                } else if (err.response.data.error === "Email already exists") {
                    toast.error("Email already exists");
                } else {
                     toast.error(err.response.data.error); // Display generic backend error
                }

            } else {
                // Generic error message
                toast.error('Registration failed. Please try again.');
            }
        }
    };


    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <fieldset style={{ width: '800px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <legend style={{ textAlign: 'center', fontWeight: 'bold' }}>Register your account</legend>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'inline-block', width: '120px', textAlign: 'right', marginRight: '10px' }}>
                            Email:
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: 'calc(100% - 130px)', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'inline-block', width: '120px', textAlign: 'right', marginRight: '10px' }}>
                            Username:
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                    <div style={{ textAlign: 'center', marginTop:"10px",marginBottom: "10px"}}>
                        <input type="checkbox" id="captcha" name="human" value="yes" required/>
                        <label for="captcha">Are You a Human?</label>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Register
                        </button>
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                                Already have an account? <Link to="/login">Login</Link>
                                            </div>
                    </div>
                </form>
            </fieldset>
            <ToastContainer />
        </div>
    );
}

export default Register;