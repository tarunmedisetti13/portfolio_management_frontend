import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/users/login', {
                username,
                password,
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard', { state: { portfolios: response.data.portfolios } });
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('An error occurred during login');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h1 style={styles.heading}>Login</h1>
                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputContainer}>
                        <label style={styles.label}>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputContainer}>
                        <label style={styles.label}>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    {error && <p style={styles.error}>{error}</p>}
                    <button type="submit" style={styles.button}>Login</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '20px',
        boxSizing: 'border-box',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        boxSizing: 'border-box',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputContainer: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        outline: 'none',
        boxSizing: 'border-box',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: '10px',
    },
    button: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007BFF',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default Login;
