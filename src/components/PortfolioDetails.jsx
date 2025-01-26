import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../styles/PortfolioDetails.css';

const PortfolioDetails = () => {
    const { portfolioId } = useParams(); // Get portfolioId from URL
    const [portfolio, setPortfolio] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [newStock, setNewStock] = useState({
        tickerSymbol: '',
        companyName: '',
        purchasePrice: '',
        units: 1,
        purchaseDate: ''
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [stockToDelete, setStockToDelete] = useState(null);
    const [editingStock, setEditingStock] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Fetch portfolio details and stocks by portfolioId
    useEffect(() => {
        const fetchPortfolioDetailsAndStocks = async () => {
            try {
                // Get the current logged-in username (assuming it's stored in localStorage)
                const loggedInUsername = sessionStorage.getItem("username") || localStorage.getItem("username");

                // Fetch the portfolio's associated username from the backend
                const usernameResponse = await axios.get(`/api/portfolios/${portfolioId}/username`);

                if (usernameResponse.data !== loggedInUsername) {
                    // If the portfolio doesn't belong to the logged-in user
                    setErrorMessage("Portfolio does not belong to the logged-in user.");
                    return;
                }

                // If the usernames match, fetch portfolio details and stocks
                const response = await axios.get(`/api/portfolios/${portfolioId}/with-stocks`);
                setPortfolio(response.data.portfolio);
                setStocks(response.data.stocks);
            } catch (error) {
                console.error("Error fetching portfolio details:", error);
                if (error.response && error.response.status === 404) {
                    setErrorMessage("Portfolio not found.");
                } else {
                    setErrorMessage("Error fetching data.");
                }
            }
        };


        fetchPortfolioDetailsAndStocks();
    }, [portfolioId]);

    // Calculate total purchase price of stocks
    const totalPurchasePrice = stocks.reduce(
        (total, stock) => total + stock.purchasePrice * stock.units,
        0
    );

    const handleCreateStock = async (e) => {
        e.preventDefault();

        const stockData = {
            tickerSymbol: newStock.tickerSymbol,
            companyName: newStock.companyName,
            purchasePrice: newStock.purchasePrice,
            units: newStock.units,
            purchaseDate: newStock.purchaseDate
        };

        try {
            const response = await axios.post(`/api/portfolios/${portfolioId}/stocks`, stockData);
            if (response.status === 201) {
                // Make sure you're using the correct `response.data`
                setStocks((prevStocks) => [...prevStocks, response.data.stock]);
                setShowModal(false);
                setNewStock({
                    tickerSymbol: '',
                    companyName: '',
                    purchasePrice: '',
                    units: 1,
                    purchaseDate: ''
                });
            }
        } catch (err) {
            console.error("Error creating stock:", err);
            setErrorMessage("Error creating stock.");
        }
    };

    const handleUpdateStock = async (e) => {
        e.preventDefault();

        const updatedStockData = {
            companyName: editingStock.companyName,
            purchasePrice: editingStock.purchasePrice,
            units: editingStock.units,
            purchaseDate: editingStock.purchaseDate,
        };

        try {
            const response = await axios.put(
                `/api/portfolios/${portfolioId}/stocks/${editingStock.id}`,
                updatedStockData
            );

            if (response.data.success) {
                setStocks((prevStocks) =>
                    prevStocks.map((stock) =>
                        stock.id === editingStock.id ? response.data.stock : stock
                    )
                );
                setShowEditModal(false);
                setEditingStock(null);
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (err) {
            console.error("Error updating stock:", err);
            setErrorMessage("Error updating stock.");
        }
    };

    const openEditModal = (stock) => {
        setEditingStock(stock);
        setShowEditModal(true);
    };

    const openDeleteModal = (stockId) => {
        setStockToDelete(stockId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setStockToDelete(null);
        setShowDeleteModal(false);
    };

    const handleDeleteStock = async () => {
        if (stockToDelete) {
            try {
                await axios.delete(`/api/portfolios/${portfolioId}/stocks/${stockToDelete}`);
                setStocks((prevStocks) => prevStocks.filter(stock => stock.id !== stockToDelete));
                closeDeleteModal();
            } catch (err) {
                console.error("Error deleting stock:", err);
                setErrorMessage("Error deleting stock.");
            }
        }
    };

    if (errorMessage) return <p className="error-message">{errorMessage}</p>;

    return (
        <div>
            <div className="portfolio-all-details">
                <h1 className="portfolio-details">Portfolio Details</h1>
                {portfolio && (
                    <div className="portfolio-info">
                        <div className="portfolio-details">
                            <h2>{portfolio.name}</h2>
                            <p className="description-label">Description:</p>
                            <p>{portfolio.description}</p>
                        </div>
                        <p className="created-at">
                            <strong>Created on:</strong> {new Date(portfolio.createdAt).toLocaleDateString()}
                        </p>
                        <p className="total-purchase-price">
                            <strong>Total Purchase Price of Stocks:</strong> ${totalPurchasePrice.toFixed(2)}
                        </p>
                    </div>
                )}
            </div>

            <button className="add-stock-btn" onClick={() => setShowModal(true)}>
                Add New Stock
            </button>

            {stocks.length === 0 && <p>No stocks found in this portfolio.</p>}

            {stocks.length > 0 && (
                <div className="stocks-table-container">
                    <table className="stocks-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Company Name</th>
                                <th>Ticker Symbol</th>
                                <th>Purchase Price</th>
                                <th>Units</th>
                                <th>Total Value</th>
                                <th>Purchase Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock, index) => (
                                <tr key={stock.id}>
                                    <td>{index + 1}</td>
                                    <td>{stock.companyName}</td>
                                    <td>{stock.tickerSymbol}</td>
                                    <td>${stock.purchasePrice.toFixed(2)}</td>
                                    <td>{stock.units}</td>
                                    <td>${(stock.purchasePrice * stock.units).toFixed(2)}</td>
                                    <td>{new Date(stock.purchaseDate).toLocaleDateString()}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => openEditModal(stock)}>
                                            Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => openDeleteModal(stock.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create New Stock</h2>
                        <form onSubmit={handleCreateStock}>
                            <label>Ticker Symbol:</label>
                            <input type="text" value={newStock.tickerSymbol} onChange={(e) => setNewStock({ ...newStock, tickerSymbol: e.target.value })} required />
                            <label>Company Name:</label>
                            <input type="text" value={newStock.companyName} onChange={(e) => setNewStock({ ...newStock, companyName: e.target.value })} required />
                            <label>Purchase Price:</label>
                            <input type="number" step="0.01" value={newStock.purchasePrice} onChange={(e) => setNewStock({ ...newStock, purchasePrice: e.target.value })} required />
                            <label>Units:</label>
                            <input type="number" value={newStock.units} onChange={(e) => setNewStock({ ...newStock, units: e.target.value })} required />
                            <label>Purchase Date:</label>
                            <input type="date" value={newStock.purchaseDate} onChange={(e) => setNewStock({ ...newStock, purchaseDate: e.target.value })} required />
                            <div className="action-btns">
                                <button type="submit" className="add-stock-btn">Add Stock</button>
                                <button type="button" className="cancel-btn btn-for-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && editingStock && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Stock</h2>
                        <form onSubmit={handleUpdateStock}>
                            <label>Ticker Symbol:</label>
                            <input type="text" value={editingStock.tickerSymbol} readOnly disabled />
                            <label>Company Name:</label>
                            <input type="text" value={editingStock.companyName} onChange={(e) => setEditingStock({ ...editingStock, companyName: e.target.value })} required />
                            <label>Purchase Price:</label>
                            <input type="number" step="0.01" value={editingStock.purchasePrice} onChange={(e) => setEditingStock({ ...editingStock, purchasePrice: e.target.value })} required />
                            <label>Units:</label>
                            <input type="number" value={editingStock.units} onChange={(e) => setEditingStock({ ...editingStock, units: e.target.value })} required />
                            <label>Purchase Date:</label>
                            <input type="date" value={editingStock.purchaseDate} onChange={(e) => setEditingStock({ ...editingStock, purchaseDate: e.target.value })} required />
                            <div className="action-btns">
                                <button type="submit" className="add-stock-btn">Save Changes</button>
                                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Confirm Deletion</h2>
                        <p className="dlt-text">Are you sure you want to delete this stock?</p>
                        <div className="action-btns">
                            <button className="confirm-dlt-btn" onClick={handleDeleteStock}>Yes, Delete</button>
                            <button className="confirm-cancel-btn" onClick={closeDeleteModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioDetails;
