import React, { useContext, useEffect, useReducer } from 'react';
import { Table, Button, Container, Row, Col, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import { Store } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, orders: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const OrderListScreen = () => {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
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
                const { data } = await axios.get('/api/orders', {
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
        fetchData();
    }, [userInfo, navigate]);

    return (
        <Container fluid className="px-md-4 py-4 mt-2">
            <div className="bg-white rounded shadow-sm border p-3 p-md-4">
                <Row className="align-items-center mb-4 gy-3">
                    <Col xs={12} sm={6}>
                        <h2 className="fw-bold mb-0" style={{ color: '#333', fontSize: '1.5rem' }}>Orders</h2>
                    </Col>
                </Row>

                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className='alert alert-danger'>{error}</div>
                ) : (
                    <div className="overflow-hidden">
                        <Table responsive hover className="mb-0 align-middle border-0">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eee' }}>
                                    <th className="py-3 text-muted fw-semibold d-none d-md-table-cell" style={{ fontSize: '12px' }}>ID</th>
                                    <th className="py-3 text-muted fw-semibold" style={{ fontSize: '12px' }}>USER</th>
                                    <th className="py-3 text-muted fw-semibold" style={{ fontSize: '12px' }}>DATE</th>
                                    <th className="py-3 text-muted fw-semibold" style={{ fontSize: '12px' }}>TOTAL</th>
                                    <th className="py-3 text-muted fw-semibold" style={{ fontSize: '12px' }}>PAID</th>
                                    <th className="py-3 text-muted fw-semibold" style={{ fontSize: '12px' }}>DELIVERED</th>
                                    <th className="py-3 text-muted fw-semibold text-end pe-4" style={{ fontSize: '12px' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                        <td className="py-3 text-muted d-none d-md-table-cell" style={{ fontSize: '14px' }}>
                                            {order._id.substring(0, 8)}...
                                        </td>
                                        <td className="py-3 fw-bold" style={{ fontSize: '14px', color: '#444' }}>
                                            {order.user ? order.user.name : 'DELETED USER'}
                                        </td>
                                        <td className="py-3 text-muted" style={{ fontSize: '14px' }}>
                                            {order.createdAt.substring(0, 10)}
                                        </td>
                                        <td className="py-3 fw-bold" style={{ fontSize: '14px', color: '#444' }}>
                                            ${order.totalPrice.toFixed(2)}
                                        </td>
                                        <td className="py-3">
                                            {order.isPaid ? (
                                                <Badge pill className="px-3 py-2 bg-success-light" style={{ color: '#2e7d32', backgroundColor: '#e8f5e9', fontSize: '11px' }}>
                                                    {order.paidAt.substring(0, 10)}
                                                </Badge>
                                            ) : (
                                                <Badge pill className="px-3 py-2 bg-danger-light" style={{ color: '#d32f2f', backgroundColor: '#ffe6e6', fontSize: '11px' }}>
                                                    NO
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="py-3">
                                            {order.isDelivered ? (
                                                <Badge pill className="px-3 py-2 bg-success-light" style={{ color: '#2e7d32', backgroundColor: '#e8f5e9', fontSize: '11px' }}>
                                                    {order.deliveredAt.substring(0, 10)}
                                                </Badge>
                                            ) : (
                                                <Badge pill className="px-3 py-2 bg-danger-light" style={{ color: '#d32f2f', backgroundColor: '#ffe6e6', fontSize: '11px' }}>
                                                    NO
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="py-3 text-end pe-4">
                                            <LinkContainer to={`/order/${order._id}`}>
                                                <Button
                                                    variant="link"
                                                    className="text-decoration-none px-3 py-1 rounded"
                                                    style={{ color: '#FF8717', backgroundColor: '#FFF3E0', fontSize: '13px', fontWeight: '600' }}
                                                >
                                                    Details
                                                </Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>
            <style>{`
                .table > :not(caption) > * > * {
                    border-bottom-width: 0;
                }
                .table tr:hover {
                    background-color: #fcfdfd;
                }
                .bg-success-light {
                    background-color: #e8f5e9 !important;
                }
                .bg-danger-light {
                    background-color: #ffe6e6 !important;
                }
            `}</style>
        </Container>
    );
};

export default OrderListScreen;
