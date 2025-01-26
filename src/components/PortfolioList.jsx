import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/PortfolioList.css';

const PortfolioList = () => {
    const [portfolios, setPortfolios] = useState([]);
    const [newPortfolioName, setNewPortfolioName] = useState('');
    const [newPortfolioDescription, setNewPortfolioDescription] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPortfolio, setEditingPortfolio] = useState(null);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingPortfolioId, setDeletingPortfolioId] = useState(null);

    const getUserId = () => {
        const storedUserId = sessionStorage.getItem("userid") || localStorage.getItem("userid");
        if (!storedUserId) {
            setError("No user logged in.");
            return null;
        }
        return storedUserId;
    };

    const getUsername = () => {
        const storedUsername = sessionStorage.getItem("username") || localStorage.getItem("username");
        if (!storedUsername) {
            setError("No user logged in.");
            return null;
        }
        return storedUsername;
    };

    useEffect(() => {
        const fetchPortfolios = async () => {
            const storedUsername = getUsername();
            if (!storedUsername) return;

            try {
                const response = await axios.get(`/api/portfolios/${storedUsername}`);
                const { data } = response;
                if (data.length > 0) {
                    setPortfolios(data);
                    setError(''); // Reset error when data is successfully fetched
                } else {
                    setPortfolios([]);
                    setError(''); // Reset error when no portfolios are found
                }
            } catch (err) {
                setError("Error fetching portfolios. Please try again.");
            }
        };

        fetchPortfolios();
    }, []);

    const handleDeletePortfolio = (id) => {
        setDeletingPortfolioId(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`/api/portfolios/${deletingPortfolioId}`);
            setPortfolios(portfolios.filter((portfolio) => portfolio.id !== deletingPortfolioId));
            setShowDeleteModal(false);
        } catch (err) {
            setError("Error deleting portfolio.");
        }
    };

    const handleCreatePortfolio = async (e) => {
        e.preventDefault();
        const storedUsername = getUsername();
        if (!storedUsername) return;

        if (!newPortfolioName.trim()) {
            setError("Portfolio name cannot be empty.");
            return;
        }

        const newPortfolioData = {
            name: newPortfolioName.trim(),
            description: newPortfolioDescription.trim(),
        };

        try {
            const response = await axios.post(`/api/portfolios?username=${storedUsername}`, newPortfolioData);
            if (response.status === 201) {
                setPortfolios([...portfolios, response.data]);
                setShowModal(false);
                setNewPortfolioName('');
                setNewPortfolioDescription('');
            }
        } catch (err) {
            setError("Error creating portfolio. Please try again.");
        }
    };

    const handleEditPortfolio = (portfolio) => {
        setEditingPortfolio(portfolio);
        setShowEditModal(true);
    };

    const handleUpdatePortfolio = async (e) => {
        e.preventDefault();

        if (!editingPortfolio.name.trim()) {
            setError("Portfolio name cannot be empty.");
            return;
        }

        try {
            const response = await axios.put(`/api/portfolios/${editingPortfolio.id}`, editingPortfolio);
            if (response.status === 200) {
                setPortfolios(
                    portfolios.map((portfolio) =>
                        portfolio.id === editingPortfolio.id ? response.data : portfolio
                    )
                );
                setShowEditModal(false);
                setEditingPortfolio(null);
            }
        } catch (err) {
            setError("Error updating portfolio.");
        }
    };

    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="portfolio-list">
            <h1>Your Portfolios</h1>
            <button className="create-portfolio-btn" onClick={() => setShowModal(true)}>
                Create Portfolio
            </button>
            {/* Portfolio List */}
            {portfolios.length === 0 && !error ? (
                <div className="no-portfolios">
                    <p>You currently have no portfolios.</p>
                </div>
            ) : (
                <ul className="portfolio-item-with-actions">
                    {portfolios.map((portfolio) => (
                        <li className="portfolio-list-name" key={portfolio.id}>
                            <div className="portfolio-item">
                                <Link to={`/portfolio/${portfolio.id}`}>{portfolio.name}</Link>
                                <button className="edit-btn" onClick={() => handleEditPortfolio(portfolio)}>
                                    Edit
                                </button>
                                <button className="delete-btn" onClick={() => handleDeletePortfolio(portfolio.id)}>
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal for Create Portfolio */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create Portfolio</h2>
                        <form onSubmit={handleCreatePortfolio}>
                            <div className="create-portfolio-form">
                                <input
                                    type="text"
                                    placeholder="Portfolio Name"
                                    value={newPortfolioName}
                                    onChange={(e) => setNewPortfolioName(e.target.value)}
                                    required
                                    maxLength="25"
                                />
                                <textarea
                                    placeholder="Portfolio Description"
                                    value={newPortfolioDescription}
                                    onChange={(e) => setNewPortfolioDescription(e.target.value)}
                                    maxLength="200"
                                />
                                <div className="modal-buttons">
                                    <button className="btn1" type="submit">Create</button>
                                    <button className="btn2" type="button" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Edit Portfolio */}
            {showEditModal && editingPortfolio && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit Portfolio</h2>
                        <form onSubmit={handleUpdatePortfolio}>
                            <div className="create-portfolio-form">
                                <label>Portfolio Name:</label>
                                <input
                                    type="text"
                                    value={editingPortfolio.name}
                                    onChange={(e) =>
                                        setEditingPortfolio({ ...editingPortfolio, name: e.target.value })
                                    }
                                    required
                                    maxLength="25"
                                />
                                <label>Portfolio Description:</label>
                                <textarea
                                    value={editingPortfolio.description}
                                    onChange={(e) =>
                                        setEditingPortfolio({ ...editingPortfolio, description: e.target.value })
                                    }
                                    required
                                    maxLength="200"
                                />
                                <div className="modal-buttons">
                                    <button className="btn1" type="submit">Save Changes</button>
                                    <button className="btn2" type="button" onClick={() => setShowEditModal(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Are you sure you want to delete this portfolio?</h2>
                        <div className="modal-buttons">
                            <button className="btn2" onClick={handleConfirmDelete}>Confirm</button>
                            <button className="btn1" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioList;
