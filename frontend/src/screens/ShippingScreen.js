import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { Store } from '../context/StoreContext';
import CheckoutSteps from '../components/CheckoutSteps';
import '../Style/ShippingScreen.css';
import axios from 'axios';

const ShippingScreen = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        userInfo,
        cart: { cartItems, shippingAddress },
    } = state;
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState(shippingAddress.firstName || '');
    const [lastName, setLastName] = useState(shippingAddress.lastName || '');
    const [company, setCompany] = useState(shippingAddress.company || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [address2, setAddress2] = useState(shippingAddress.address2 || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || 'United States (US)');
    const [phone, setPhone] = useState(shippingAddress.phone || '');
    const [email, setEmail] = useState(shippingAddress.email || '');
    const [shippingState, setShippingState] = useState(shippingAddress.state || 'California');
    const [isSaved, setIsSaved] = useState(shippingAddress.address ? true : false);

    const handleEdit = () => {
        setIsSaved(false);
    };

    const handleAddNew = () => {
        setFirstName('');
        setLastName('');
        setCompany('');
        setAddress('');
        setAddress2('');
        setCity('');
        setPostalCode('');
        setCountry('United States (US)');
        setPhone('');
        setEmail('');
        setShippingState('California');
        setIsSaved(false);
    };

    const proceedToPayment = () => {
        navigate('/payment');
    };

    useEffect(() => {
        if (!userInfo) {
            navigate('/login?redirect=/shipping');
        }
    }, [userInfo, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const addressData = {
            firstName, lastName, company, address, address2,
            city, postalCode, country, phone, email, state: shippingState
        };

        // Calculate totals for persistent order details
        const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
        const shippingPrice = itemsPrice > 100 ? 0 : 10;
        const taxPrice = 0.15 * itemsPrice;
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        if (userInfo) {
            try {
                // Save/Update draft order in database for persistence
                await axios.post('/api/orders/draft', {
                    orderItems: cartItems,
                    shippingAddress: addressData,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice
                }, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
            } catch (err) {
                console.error('Error saving draft order:', err);
            }
        }

        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: addressData,
        });
        localStorage.setItem(
            'shippingAddress',
            JSON.stringify(addressData)
        );
        setIsSaved(true);
    };

    const subtotal = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);

    return (
        <div className="shipping-page">
            {/* Breadcrumb Section */}
            <section className="breadcrumb-area">
                <Container>
                    <div className="radios-breadcrumb">
                        <ul>
                            <li className="radiosbcrumb-item"><Link to="/">Home</Link></li>
                            <li className="radiosbcrumb-item active">Checkout</li>
                        </ul>
                    </div>
                </Container>
            </section>

            <Container className="pb-80">
                <div className="checkout-steps-wrap">
                    <CheckoutSteps step1 step2 />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                    <h3 className="m-0" style={{ fontSize: '20px', fontWeight: '600', color: '#4a4a4a' }}>Select Delivery Address</h3>
                    <button
                        type="button"
                        onClick={handleAddNew}
                        style={{ background: 'none', border: 'none', color: '#FF8717', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase' }}
                    >
                        + ADD NEW ADDRESS
                    </button>
                </div>

                <Row>
                    <Col lg={8}>
                        {isSaved ? (
                            <div className="address-card" style={{
                                backgroundColor: '#f0f5ff',
                                border: '1px solid #e0e7ff',
                                borderRadius: '12px',
                                padding: '25px',
                                position: 'relative',
                                marginBottom: '30px'
                            }}>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex align-items-center">
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            border: '2px solid #FF8717',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '15px'
                                        }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FF8717' }}></div>
                                        </div>
                                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#333' }}>{firstName} {lastName}</h4>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleEdit}
                                        style={{ background: 'none', border: 'none', color: '#FF8717', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase' }}
                                    >
                                        EDIT
                                    </button>
                                </div>
                                <div style={{ paddingLeft: '35px' }}>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#555', lineHeight: '1.6' }}>
                                        {address}{address2 ? `, ${address2}` : ''}, {city}, {shippingState}, {postalCode}, {country}
                                    </p>
                                    <p style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#555', fontWeight: '500' }}>
                                        {phone}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={proceedToPayment}
                                        className="deliver-btn"
                                        style={{
                                            backgroundColor: '#fc5614ff',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '12px 30px',
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            width: '100%',
                                            maxWidth: '400px',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Deliver to this Address
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="billing-details">
                                <Form onSubmit={submitHandler}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="form-group" controlId="firstName">
                                                <Form.Label>First name *</Form.Label>
                                                <Form.Control
                                                    className="form-control"
                                                    type="text"
                                                    value={firstName}
                                                    required
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="form-group" controlId="lastName">
                                                <Form.Label>Last name *</Form.Label>
                                                <Form.Control
                                                    className="form-control"
                                                    type="text"
                                                    value={lastName}
                                                    required
                                                    onChange={(e) => setLastName(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="form-group" controlId="company">
                                                <Form.Label>Company name (optional)</Form.Label>
                                                <Form.Control
                                                    className="form-control"
                                                    type="text"
                                                    value={company}
                                                    onChange={(e) => setCompany(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="form-group" controlId="country">
                                                <Form.Label>Country / Region *</Form.Label>
                                                <Form.Select
                                                    className="form-control"
                                                    value={country}
                                                    required
                                                    onChange={(e) => setCountry(e.target.value)}
                                                >
                                                    <option value="United States (US)">United States (US)</option>
                                                    <option value="UK">United Kingdom (UK)</option>
                                                    <option value="Canada">Canada</option>
                                                    <option value="India">India</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="form-group" controlId="address">
                                                <Form.Label>Street address *</Form.Label>
                                                <Form.Control
                                                    className="form-control mb-3"
                                                    type="text"
                                                    placeholder="House number and street name"
                                                    value={address}
                                                    required
                                                    onChange={(e) => setAddress(e.target.value)}
                                                />
                                                <Form.Control
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Apartment, suite, unit, etc. (optional)"
                                                    value={address2}
                                                    onChange={(e) => setAddress2(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="form-group" controlId="city">
                                                <Form.Label>Town / City *</Form.Label>
                                                <Form.Control
                                                    className="form-control"
                                                    type="text"
                                                    value={city}
                                                    required
                                                    onChange={(e) => setCity(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="form-group" controlId="state">
                                                <Form.Label>State *</Form.Label>
                                                <Form.Select
                                                    className="form-control"
                                                    value={shippingState}
                                                    required
                                                    onChange={(e) => setShippingState(e.target.value)}
                                                >
                                                    <option value="California">California</option>
                                                    <option value="Texas">Texas</option>
                                                    <option value="Kerala">Kerala</option>
                                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="form-group" controlId="postalCode">
                                                <Form.Label>ZIP Code *</Form.Label>
                                                <Form.Control
                                                    className="form-control"
                                                    type="text"
                                                    value={postalCode}
                                                    required
                                                    onChange={(e) => setPostalCode(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="form-group" controlId="phone">
                                                <Form.Label>Phone *</Form.Label>
                                                <Form.Control
                                                    className="form-control"
                                                    type="tel"
                                                    value={phone}
                                                    required
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="form-group" controlId="email">
                                                <Form.Label>Email address *</Form.Label>
                                                <Form.Control
                                                    className="form-control"
                                                    type="email"
                                                    value={email}
                                                    required
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <button type="submit" className="thm-btn w-100 mt-3">
                                            Save address and continue
                                        </button>
                                    </Row>
                                </Form>
                            </div>
                        )}
                    </Col>

                    <Col lg={4}>
                        <div className="order-summary-box">
                            <h3>Your order</h3>
                            <table className="order-summary-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item._id}>
                                            <td>{item.name} <strong>× {item.quantity}</strong></td>
                                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}

                                    <tr className="summary-final">
                                        <td>Order Total</td>
                                        <td>${subtotal.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ShippingScreen;
