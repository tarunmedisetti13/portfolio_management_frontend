import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        // Remove user data from storage
        sessionStorage.clear();
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        localStorage.removeItem("authToken");

        // Navigate to the login page
        navigate("/login");
    };

    const openConfirmLogout = () => {
        setShowConfirmLogout(true);
    };

    const closeConfirmLogout = () => {
        setShowConfirmLogout(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Brand Name or Logo */}
                <div className="navbar-logo">
                    <Link to="/" className="navbar-link">
                        Stock Portfolio
                    </Link>
                </div>

                {/* Menu Toggle Button (Visible on Mobile) */}
                <button className="menu-toggle" onClick={toggleMenu}>
                    ☰
                </button>

                {/* Navigation Links */}
                <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
                    <ul>
                        <li>
                            <Link to="/dashboard" className="navbar-link">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/portfolios" className="navbar-link">
                                Portfolios
                            </Link>
                        </li>
                        <li>
                            <Link to="/stocks" className="navbar-link">
                                Stocks
                            </Link>
                        </li>
                        <li>
                            <Link to="/market-insights" className="navbar-link">
                                Market Insights
                            </Link>
                        </li>
                        <li>
                            <Link to="/transactions" className="navbar-link">
                                Transactions
                            </Link>
                        </li>
                        <li>
                            <Link to="/help" className="navbar-link">
                                Help
                            </Link>
                        </li>
                        <li>
                            <button
                                className="navbar-link logout-btn"
                                onClick={openConfirmLogout}
                            >
                                Logout
                            </button>

                        </li>
                    </ul>
                </div>
            </div>

            {/* Logout Confirmation Dialog */}
            {showConfirmLogout && (
                <div className="confirm-logout-modal">
                    <div className="modal-content">
                        <p>Are you sure you want to log out?</p>
                        <div className="modal-actions">
                            <button
                                className="confirm-btn"
                                onClick={handleLogout}
                            >
                                Yes, Logout
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={closeConfirmLogout}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
