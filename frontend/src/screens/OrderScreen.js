import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Container, Badge, Button } from 'react-bootstrap';
import axios from 'axios';
import { Store } from '../context/StoreContext';
import { FaBox, FaCreditCard, FaMapMarkerAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { state } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                setOrder(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (!order._id || (order._id && order._id !== orderId)) {
            fetchOrder();
        }
    }, [order, orderId, userInfo]);

    if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
    if (error) return <Container className="py-5"><div className="alert alert-danger">{error}</div></Container>;

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Order Details</h2>
                    <p className="text-muted small mb-0">ORDER ID: <span className="fw-bold text-dark">{order._id}</span></p>
                </div>
                <div>
                    <Link to={userInfo?.isAdmin ? "/admin/orderlist" : "/orderhistory"} className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                        Back to List
                    </Link>
                </div>
            </div>

            <Row>
                <Col lg={8}>
                    {/* Shipping Info Card */}
                    <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-light p-3 rounded-circle text-primary me-3">
                                    <FaMapMarkerAlt size={20} />
                                </div>
                                <h5 className="fw-bold mb-0">Shipping Information</h5>
                            </div>
                            <Row>
                                <Col md={6}>
                                    <p className="mb-1 text-muted small fw-bold">RECIPIENT</p>
                                    <p className="mb-3 fw-bold">{order.user.name}</p>
                                    <p className="mb-1 text-muted small fw-bold">CONTACT</p>
                                    <p className="mb-0">{order.user.email}</p>
                                </Col>
                                <Col md={6}>
                                    <p className="mb-1 text-muted small fw-bold">ADDRESS</p>
                                    <p className="mb-0">
                                        {order.shippingAddress.address}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                        {order.shippingAddress.country}
                                    </p>
                                </Col>
                            </Row>
                            <div className="mt-4 pt-3 border-top">
                                {order.isDelivered ? (
                                    <div className="d-flex align-items-center text-success fw-bold">
                                        <FaCheckCircle className="me-2" /> Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-center text-warning fw-bold">
                                        <FaExclamationCircle className="me-2" /> Pending Delivery
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Payment Info Card */}
                    <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-light p-3 rounded-circle text-primary me-3">
                                    <FaCreditCard size={20} />
                                </div>
                                <h5 className="fw-bold mb-0">Payment Details</h5>
                            </div>
                            <p className="mb-2"><span className="text-muted fw-bold small">METHOD:</span> <span className="ms-2 fw-bold">{order.paymentMethod}</span></p>
                            <div className="mt-3 pt-3 border-top">
                                {order.isPaid ? (
                                    <div className="d-flex align-items-center text-success fw-bold">
                                        <FaCheckCircle className="me-2" /> Paid on {new Date(order.paidAt).toLocaleDateString()}
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-center text-danger fw-bold">
                                        <FaExclamationCircle className="me-2" /> Payment Pending
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Order Items Card */}
                    <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-light p-3 rounded-circle text-primary me-3">
                                    <FaBox size={20} />
                                </div>
                                <h5 className="fw-bold mb-0">Order Items</h5>
                            </div>
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index} className="px-0 py-3 border-bottom-0">
                                        <Row className="align-items-center">
                                            <Col xs={2} md={1}>
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fluid
                                                    rounded
                                                    style={{ maxHeight: '50px', objectFit: 'contain' }}
                                                />
                                            </Col>
                                            <Col xs={6} md={7}>
                                                <Link to={`/product/${item.product}`} className="text-decoration-none fw-bold text-dark">
                                                    {item.name}
                                                </Link>
                                                <div className="text-muted small">{item.qty} Unit(s)</div>
                                            </Col>
                                            <Col xs={4} md={4} className="text-end fw-bold">
                                                ${(item.qty * item.price).toFixed(2)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '15px', position: 'sticky', top: '100px' }}>
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-4">Summary</h5>
                            <div className="d-flex justify-content-between mb-3 text-muted">
                                <span>Items Subtotal</span>
                                <span>${(order.itemsPrice || order.orderItems.reduce((a, c) => a + c.price * c.qty, 0)).toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 text-muted">
                                <span>Shipping Fees</span>
                                <span>${order.shippingPrice.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 text-muted">
                                <span>Estimated Tax</span>
                                <span>${order.taxPrice.toFixed(2)}</span>
                            </div>
                            <hr className="my-4" />
                            <div className="d-flex justify-content-between mb-4 align-items-center">
                                <span className="h5 fw-bold mb-0">Total Amount</span>
                                <span className="h4 fw-bold mb-0 text-primary">${order.totalPrice.toFixed(2)}</span>
                            </div>

                            <Badge className="w-100 py-3 rounded-pill" bg={order.isPaid ? 'success' : 'danger'} style={{ fontSize: '14px' }}>
                                {order.isPaid ? 'ORDER COMPLETED' : 'AWAITING PAYMENT'}
                            </Badge>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderScreen;
