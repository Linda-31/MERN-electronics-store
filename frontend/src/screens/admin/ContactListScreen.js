import React, { useContext, useEffect, useReducer } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Store } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaCheck } from 'react-icons/fa';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, contacts: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return { ...state, loadingDelete: false, successDelete: true };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state;
    }
};

const ContactListScreen = () => {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ loading, error, contacts, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
            return;
        }
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get('/api/contacts', {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: err.message,
                });
            }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
    }, [userInfo, successDelete, navigate]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure to delete this message?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' });
                await axios.delete(`/api/contacts/${id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'DELETE_SUCCESS' });
            } catch (err) {
                dispatch({ type: 'DELETE_FAIL' });
                alert('Error deleting message');
            }
        }
    };

    const styles = {
        badge: {
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase'
        }
    };

    return (
        <div className="container-fluid px-md-4 py-4 mt-2">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
                <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>Contact Messages</h2>
            </div>

            {loadingDelete && <Spinner animation="border" size="sm" className="mb-3" />}
            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <Table responsive hover className="mb-0">
                        <thead style={{ backgroundColor: '#f9fafb', fontSize: '12px', color: '#6b7280' }}>
                            <tr>
                                <th className="p-3 d-none d-md-table-cell">DATE</th>
                                <th className="p-3">NAME</th>
                                <th className="p-3 d-none d-sm-table-cell">EMAIL</th>
                                <th className="p-3 d-none d-lg-table-cell">PHONE</th>
                                <th className="p-3">MESSAGE</th>
                                <th className="p-3">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-4">No messages found</td>
                                </tr>
                            ) : (
                                contacts.map((contact) => (
                                    <tr key={contact._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td className="p-3 d-none d-md-table-cell" style={{ fontSize: '13px' }}>{contact.createdAt.substring(0, 10)}</td>
                                        <td className="p-3" style={{ fontSize: '14px', fontWeight: '500' }}>{contact.name}</td>
                                        <td className="p-3 d-none d-sm-table-cell" style={{ fontSize: '13px' }}>{contact.email}</td>
                                        <td className="p-3 d-none d-lg-table-cell" style={{ fontSize: '13px' }}>{contact.phone}</td>
                                        <td className="p-3" style={{ fontSize: '13px', maxWidth: '300px' }}>
                                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {contact.message}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => deleteHandler(contact._id)}
                                                style={{ padding: '4px 8px' }}
                                            >
                                                <FaTrash size={12} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default ContactListScreen;
