import React, { useState } from "react";
import "../styles/LoginForm.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/users/login", {
                username,
                password,
            });

            const { success, message, token, userId } = response.data;

            if (success) {

                // Always store the username in sessionStorage for the current session
                sessionStorage.setItem("username", username);
                sessionStorage.setItem("userId", userId);
                // Store in localStorage only if "Remember me" is checked
                if (rememberMe) {
                    localStorage.setItem("username", username);
                    localStorage.setItem("userId", userId);
                }

                localStorage.setItem("authToken", token); // Store the auth token
                //alert(message); // Display login success message
                navigate("/dashboard");
            }

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message); // Display backend-provided message
            } else {
                setErrorMessage("Server error. Please try again later.");
            }
        }
    };


    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    const handleRegister = () => {
        navigate("/signup");
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Login</h1>
                <form onSubmit={handleLogin}>
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
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <i className="bx bxs-lock-alt"></i>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="options">
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />{" "}
                            Remember me
                        </label>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleForgotPassword();
                            }}
                        >
                            Forgot password?
                        </a>
                    </div>
                    <button type="submit" className="login-btn">
                        Login
                    </button>
                    <div className="register-link">
                        <p>
                            Don't have an account?{" "}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent the default link behavior
                                    handleRegister(); // Call the function to navigate
                                }}
                            >
                                Register
                            </a>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default LoginForm;
