import React, { useState } from "react";
import axios from "axios";
import "../styles/MarketInsights.css"; // Ensure you have a CSS file to style the component

const MarketInsights = () => {
    const [symbol, setSymbol] = useState("");
    const [stockPrice, setStockPrice] = useState(null);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (symbol.trim() === "") {
            setError("Please enter a valid stock symbol.");
            return;
        }

        try {
            // Make the API request to the new endpoint
            const response = await axios.get(`/api/stocks/getprice?symbol=${symbol}`);
            if (response.data) {
                setStockPrice(response.data);  // Assuming the response contains just the price as a string
                setError(""); // Reset error message if request is successful
            } else {
                setError("Error fetching stock price. Please try again.");
                setStockPrice(null); // Reset stock price if data is not available
            }
        } catch (error) {
            setError("An error occurred while fetching the stock price.");
            console.error("Error fetching stock price:", error);
            setStockPrice(null); // Reset stock price in case of an error
        }
    };

    return (
        <div className="market-insights-container">
            <h1>Market Insights</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Enter stock symbol (e.g., AAPL)"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {error && <p className="error-message">{error} or API limit is over</p>}

            {stockPrice !== null && stockPrice !== undefined && (
                <div className="stock-price-info">
                    <h2>Current Price:</h2>
                    <p>{stockPrice ? `$${stockPrice}` : ""}</p>
                </div>
            )}
        </div>
    );
};

export default MarketInsights;
