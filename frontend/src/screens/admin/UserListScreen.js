import React, { useContext, useEffect, useReducer } from 'react';
import { Table, Container, Dropdown, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import { Store } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, users: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loadingDelete: false,
                successDelete: true,
            };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false, successDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state;
    }
};

const UserListScreen = () => {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
        useReducer(reducer, {
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
                const { data } = await axios.get('/api/users', {
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

    const deleteHandler = async (user) => {
        if (window.confirm('Are you sure?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' });
                await axios.delete(`/api/users/${user._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'DELETE_SUCCESS' });
                toast.success('User deleted successfully');
            } catch (err) {
                dispatch({
                    type: 'DELETE_FAIL',
                });
                toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
            }
        }
    };

    return (
        <Container fluid className="px-md-4 py-2">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
                <h2 className="fw-bold mb-0" style={{ color: '#333' }}>Users</h2>
            </div>
            {loadingDelete && <div>Loading...</div>}
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className='alert alert-danger'>{error}</div>
            ) : (
                <div className="bg-white rounded shadow-sm border overflow-hidden">
                    <Table responsive hover className="mb-0 align-middle border-0">
                        <thead className="bg-light border-0">
                            <tr>
                                <th className="ps-4 py-3 text-muted fw-semibold" style={{ fontSize: '12px' }}>NAME</th>
                                <th className="py-3 text-muted fw-semibold" style={{ fontSize: '12px' }}>EMAIL</th>
                                <th className="py-3 text-muted fw-semibold d-none d-md-table-cell" style={{ fontSize: '12px' }}>REGISTER DATE</th>
                                <th className="py-3 text-muted fw-semibold d-none d-lg-table-cell" style={{ fontSize: '12px' }}>ACCOUNT TYPE</th>
                                <th className="py-3 text-muted fw-semibold d-none d-xl-table-cell" style={{ fontSize: '12px' }}>LAST ACTIVE</th>
                                <th className="py-3 text-muted fw-semibold" style={{ fontSize: '12px' }}>STATUS</th>
                                <th className="pe-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-bottom">
                                    <td className="ps-4 py-3">
                                        <div className="d-flex align-items-center">
                                            <div className="me-3">
                                                <FaUserCircle size={40} style={{ color: '#FF8717' }} />
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark mb-0" style={{ fontSize: '14px' }}>{user.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3" style={{ fontSize: '14px', color: '#555' }}>
                                        {user.email}
                                    </td>
                                    <td className="py-3 d-none d-md-table-cell" style={{ fontSize: '14px', color: '#555' }}>
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : '29/1/2026'}
                                    </td>
                                    <td className="py-3 d-none d-lg-table-cell" style={{ fontSize: '14px', color: '#555' }}>
                                        {user.isAdmin ? 'admin' : 'user'}
                                    </td>
                                    <td className="py-3 d-none d-xl-table-cell" style={{ fontSize: '14px', color: '#555' }}>
                                        {Math.floor(Math.random() * 50) + 1} min ago
                                    </td>
                                    <td className="py-3">
                                        <Badge
                                            pill
                                            className="px-3 py-2 active-badge"
                                            style={{
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                border: 'none'
                                            }}
                                        >
                                            Active
                                        </Badge>
                                    </td>
                                    <td className="pe-4 py-3 text-end">
                                        <Dropdown align="end">
                                            <Dropdown.Toggle as="div" style={{ cursor: 'pointer' }} className="p-2 border-0 bg-transparent text-muted no-chevron">
                                                <FaEllipsisV />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="shadow-sm border-0">
                                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                                    <Dropdown.Item className="py-2">
                                                        <FaEdit className="me-2" style={{ color: '#FF8717' }} /> Edit User
                                                    </Dropdown.Item>
                                                </LinkContainer>
                                                <Dropdown.Item className="py-2 text-danger" onClick={() => deleteHandler(user)}>
                                                    <FaTrash className="me-2" /> Delete User
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
            <style>{`
                .no-chevron::after {
                    display: none !important;
                }
                .table tr:hover {
                    background-color: #f9f9f9;
                }
                .dropdown-item:hover {
                    background-color: #f8f9fa !important;
                }
                .dropdown-item:active {
                    background-color: #FF8717 !important;
                }
                .active-badge {
                    background-color: #FFF3E0 !important;
                    color: #FF8717 !important;
                }
            `}</style>
        </Container>
    );
};

export default UserListScreen;
