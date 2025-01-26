import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ChangePassword.css"; // Import styles for the component

const ChangePassword = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        // Check if the new password and confirm password match
        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        // Make an API request to change the password
        try {
            const response = await fetch("/api/users/changepassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: localStorage.getItem("username"), // Pass the current username
                    oldPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (response.status === 200) {
                // If successful, navigate to the Profile page or show a success message
                navigate("/Profile");
            } else {
                setErrorMessage(data.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            setErrorMessage("Server error: Unable to change password.");
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handlePasswordChange}>
                <div>
                    <label htmlFor="old-password">Old Password</label>
                    <input
                        type="password"
                        id="old-password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="new-password">New Password</label>
                    <input
                        type="password"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirm-password">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;
