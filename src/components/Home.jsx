import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    // Handle logout and clear session
    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear the token from storage
        navigate("/login"); // Redirect to login page
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Welcome to the Home Page!</h1>
            <p style={styles.subHeading}>
                You are successfully logged in. Explore the features of this application!
            </p>
            <div style={styles.buttons}>
                <button style={styles.button} onClick={() => navigate("/profile")}>
                    Go to Profile
                </button>
                <button style={{ ...styles.button, backgroundColor: "red" }} onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

// Inline styles for basic design
const styles = {
    container: {
        textAlign: "center",
        marginTop: "50px",
    },
    heading: {
        fontSize: "2.5rem",
        color: "#333",
    },
    subHeading: {
        fontSize: "1.25rem",
        color: "#666",
        marginBottom: "30px",
    },
    buttons: {
        display: "flex",
        justifyContent: "center",
        gap: "15px",
    },
    button: {
        padding: "10px 20px",
        fontSize: "1rem",
        cursor: "pointer",
        border: "none",
        borderRadius: "5px",
        backgroundColor: "#4CAF50",
        color: "white",
        transition: "background-color 0.3s",
    },
};

export default Home;
