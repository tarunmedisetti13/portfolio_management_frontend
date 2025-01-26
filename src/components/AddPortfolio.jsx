// src/components/AddPortfolio.jsx
import React, { useState } from 'react';
import axiosInstance from '../api/axios';

const AddPortfolio = () => {
    const [portfolioName, setPortfolioName] = useState('');
    const [message, setMessage] = useState('');

    const handleAddPortfolio = async () => {
        try {
            const response = await axiosInstance.post('/portfolios', {
                name: portfolioName,
                userId: 1, // Replace with dynamic user ID if necessary
            });
            setMessage(`Portfolio "${response.data.name}" added successfully!`);
            setPortfolioName('');
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    return (
        <div>
            <h2>Add Portfolio</h2>
            <input
                type="text"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                placeholder="Portfolio Name"
            />
            <button onClick={handleAddPortfolio}>Add</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddPortfolio;
