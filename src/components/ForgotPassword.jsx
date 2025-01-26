import React, { useState } from "react";
import "../styles/ForgotPassword.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1); // Steps: 1 - Email, 2 - OTP Verification, 3 - Reset Password
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Loading state for button disable
    const navigate = useNavigate();

    // Handle sending a reset link or OTP
    const handleSendResetLink = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true
        try {
            const response = await axios.post(
                `http://localhost:8080/passwordmanagement/forgot-password/${email}`
            );

            setMessage(response.data);
            setStep(2);
            setError("");
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to send OTP. Please try again."
            );
            setMessage("");
        } finally {
            setLoading(false); // Reset loading state after request is finished
        }
    };

    // Handle OTP verification
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true
        try {
            const response = await axios.post(
                `http://localhost:8080/passwordmanagement/verifyOtp/${otp}/${email}`
            );

            setMessage(response.data);
            setStep(3);
            setError("");
        } catch (err) {
            setError(err.response?.data || "Invalid OTP. Please try again.");
            setMessage("");
        } finally {
            setLoading(false); // Reset loading state after request is finished
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true
        try {
            const encodedPassword = encodeURIComponent(newPassword);  // Ensure password is URL-encoded
            const payload = {
                email: email,  // Pass the email
                password: encodedPassword  // Pass the password
            };

            const response = await axios.post(
                `http://localhost:8080/passwordmanagement/changepassword`,
                payload  // Send the object with email and password
            );

            setMessage(response.data);
            setError("");  // Reset any errors

            // Navigate to login directly after success
            setTimeout(() => navigate("/login"), 3000);  // Delay for smooth transition, if needed

        } catch (err) {
            setError(err.response?.data?.message || "Failed to change the password.");
            setMessage("");
        } finally {
            setLoading(false); // Reset loading state after request is finished
        }
    };


    // Handle going back to login
    const handleBackToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <h1 className="forgot-password-title">Forgot Password</h1>

                {step === 1 && (
                    <form onSubmit={handleSendResetLink}>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <i className="bx bxs-envelope"></i>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        {message && <p className="success-message">{message}</p>}
                        <button type="submit" className="reset-btn" disabled={loading}>
                            {loading ? "Sending..." : "Send OTP"} {/* Button text based on loading */}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <i className="bx bxs-key"></i>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        {message && <p className="success-message">{message}</p>}
                        <button type="submit" className="reset-btn" disabled={loading}>
                            {loading ? "Verifying..." : "Verify OTP"} {/* Button text based on loading */}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleChangePassword}>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <i className="bx bxs-lock"></i>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        {message && <p className="success-message">{message}</p>}
                        <button type="submit" className="reset-btn" disabled={loading}>
                            {loading ? "Changing..." : "Change Password"} {/* Button text based on loading */}
                        </button>
                    </form>
                )}

                <button className="back-to-login-btn" onClick={handleBackToLogin}>
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default ForgotPassword;
