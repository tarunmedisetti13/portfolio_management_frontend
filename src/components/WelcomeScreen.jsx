import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/WelcomeScreen.css";

const WelcomeScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Automatically redirect to the login page after 3 seconds
        const timer = setTimeout(() => {
            navigate("/login");
        }, 3000);

        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, [navigate]);

    return (
        <div className="welcome-container">
            <h1 className="welcome-message">
                Welcome to <span>Portfolio Management</span>
            </h1>
            <p className="sub-message">Manage your stocks with ease and confidence.</p>
        </div>
    );
};

export default WelcomeScreen;
