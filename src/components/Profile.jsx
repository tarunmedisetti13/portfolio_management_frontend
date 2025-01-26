import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = ({ onClose }) => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Function to handle the logout confirmation
    const handleLogoutConfirmation = () => {
        setShowLogoutModal(true); // Show the confirmation modal
    };

    const handleLogout = () => {
        // Remove user data from storage
        sessionStorage.clear();
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        localStorage.removeItem("authToken");

        // Show a confirmation message or use navigate directly
        navigate("/login", { replace: true });
    };

    const closeLogoutModal = () => {
        setShowLogoutModal(false); // Close the modal without logging out
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <h2>Profile</h2>
                <ul>
                    <li>
                        <Link to="/change-password" className="profile-link">
                            Change Password
                        </Link>
                    </li>
                    <li>
                        <Link to="/change-username" className="profile-link">
                            Change Username
                        </Link>
                    </li>
                    <li>
                        <button
                            className="profile-link logout-btn"
                            onClick={handleLogoutConfirmation}
                        >
                            Logout
                        </button>
                    </li>
                </ul>
                <button className="close-profile-btn" onClick={onClose}>
                    Close
                </button>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Confirm Logout</h2>
                        <p className="dlt-text">Are you sure you want to log out?</p>
                        <div className="action-btns">
                            <button
                                className="confirm-dlt-btn"
                                onClick={handleLogout}
                            >
                                Yes, Logout
                            </button>
                            <button
                                className="confirm-cancel-btn"
                                onClick={closeLogoutModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
