import React, { useState } from "react";
import "../styles/LoginForm.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        // Validate if the email is a valid Gmail address
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid Gmail address.");
            return;
        }

        // Validate the username (doesn't start with a number, no special characters except _ - .)
        const usernameRegex = /^(?!\d)(?!.*[^a-zA-Z0-9._-]).+$/;
        if (!usernameRegex.test(username)) {
            setErrorMessage("Username must not start with a number and can only contain letters, numbers, and _ . - characters.");
            return;
        }

        // Check username length (min 3, max 20 characters)
        if (username.length < 3 || username.length > 20) {
            setErrorMessage("Username must be between 3 and 20 characters.");
            return;
        }

        // Check password length (min 6, max 20 characters)
        if (password.length < 6 || password.length > 20) {
            setErrorMessage("Password must be between 6 and 20 characters.");
            return;
        }

        try {
            // Make the POST request to the backend API
            const response = await axios.post("/api/users/signup", {
                username,
                email,
                password
            });

            if (response.data.success) {
                alert(`Account created for ${username}!`);
                navigate("/login");
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Server error during sign-up");
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Sign Up</h1>
                <form onSubmit={handleSignup}>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <i className="bx bxs-user"></i>
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <i className="bx bxs-envelope"></i>
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <i className="bx bxs-lock-alt"></i>
                    </div>
                    <button type="submit" className="login-btn">
                        Sign Up
                    </button>
                </form>
                <div className="register-link">
                    <p>
                        Already have an account?{" "}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/login"); // Navigate to the login page
                            }}
                        >
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
