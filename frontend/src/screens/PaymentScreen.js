import React, { useState, useContext, useEffect } from 'react';
import { Form, Col, Container, Row } from 'react-bootstrap';
import { Store } from '../context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import '../Style/PaymentScreen.css';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ totalPrice, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [savedCards, setSavedCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [showForm, setShowForm] = useState(true);

    // Step 1: Verify — creates a PaymentMethod, saves card info locally
    const handleVerify = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        try {
            const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardNumberElement),
            });

            if (pmError) {
                setError(pmError.message);
                setProcessing(false);
                return;
            }

            if (!paymentMethod || !paymentMethod.card) {
                setError('Could not validate card. Please try again.');
                setProcessing(false);
                return;
            }

            const card = paymentMethod.card;
            const newCard = {
                id: paymentMethod.id,
                brand: card.brand || 'unknown',
                last4: card.last4 || '0000',
                expMonth: card.exp_month,
                expYear: card.exp_year,
            };

            setSavedCards((prev) => [...prev, newCard]);
            setSelectedCard(newCard.id);
            setShowForm(false);
            setProcessing(false);
        } catch (err) {
            console.error('Card verification error:', err);
            setError('Card verification failed. Please check your details and try again.');
            setProcessing(false);
        }
    };

    // Step 2: Pay Now — uses selected PaymentMethod to confirm payment
    const handlePayNow = async () => {
        if (!stripe || !selectedCard) return;

        setProcessing(true);
        setError(null);

        try {
            // Step 1: Create a fresh PaymentIntent on the backend
            const { data } = await axios.post('/api/orders/payment-intent', {
                amount: totalPrice,
            }, {
                headers: { Authorization: `Bearer ${state.userInfo.token}` }
            });

            const { clientSecret, orderId } = data;

            // Step 2: Confirm the payment
            const payload = await stripe.confirmCardPayment(clientSecret, {
                payment_method: selectedCard,
                return_url: `${window.location.origin}/payment/success/${orderId}`,
            });

            if (payload.error) {
                console.error('Stripe Confirmation Error:', payload.error);

                // CRITICAL: If confirmation fails, the PaymentMethod is now 'spent/locked' 
                // for this session. We must remove it from the list so the user doesn't 
                // try to reuse it (which causes the 400 reuse error).
                setSavedCards((prev) => prev.filter(c => c.id !== selectedCard));
                setSelectedCard(null);
                setShowForm(true);

                setError(`Payment failed: ${payload.error.message}. Please re-enter your card details to try again.`);
                setProcessing(false);
            } else {
                // Step 3: Successfully paid! Update the order in our DB
                try {
                    await axios.put(`/api/orders/${orderId}/pay`, {
                        id: payload.paymentIntent.id,
                        status: payload.paymentIntent.status,
                        update_time: new Date().toISOString(),
                        email_address: state.userInfo.email,
                    }, {
                        headers: { Authorization: `Bearer ${state.userInfo.token}` }
                    });
                } catch (updateErr) {
                    console.error('Order status update failed:', updateErr);
                }

                ctxDispatch({ type: 'CART_CLEAR' });
                localStorage.removeItem('cartItems');
                navigate(`/payment/success/${orderId}`);
            }
        } catch (err) {
            console.error('Backend Checkout Error:', err);
            setError('Could not initiate payment. Please check your connection and try again.');
            setProcessing(false);
        }
    };

    return (
        <div className="stripe-card-form-wrapper" onClick={(e) => e.stopPropagation()}>
            {/* Debug Check */}
            {!process.env.REACT_APP_STRIPE_PUB_KEY && (
                <div className="payment-error-msg">
                    Warning: Stripe Publishable Key is missing! Please check your .env file.
                </div>
            )}

            {/* Saved Cards List */}
            {savedCards.length > 0 && (
                <div className="saved-cards-list">
                    {savedCards.map((card) => (
                        <div
                            key={card.id}
                            className={`saved-card-item ${selectedCard === card.id ? 'selected' : ''}`}
                            onClick={() => { setSelectedCard(card.id); setShowForm(false); }}
                        >
                            <div className="saved-card-info">
                                <span className="card-brand-icon">💳</span>
                                <div className="card-details">
                                    <span className="card-name">
                                        STRIPE {card.brand.charAt(0).toUpperCase() + card.brand.slice(1)} Card
                                        <span className={`card-badge badge-${card.brand}`}>{card.brand.toUpperCase()}</span>
                                    </span>
                                    <span className="card-number-masked">
                                        {card.last4.charAt(0)}{'•••-' + card.last4.charAt(0) + '•XX-XXXX-' + card.last4}
                                    </span>
                                </div>
                            </div>
                            <Form.Check
                                type="radio"
                                readOnly
                                checked={selectedCard === card.id}
                                className="saved-card-radio"
                                onChange={() => { }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Card Entry Form */}
            {showForm ? (
                <div className="card-entry-form">
                    <h4 className="form-title">{savedCards.length > 0 ? 'Add a new card' : 'Enter your card details'}</h4>
                    <div className="stripe-input-group">
                        <label className="input-label">Enter Card Number</label>
                        <div className="stripe-element-container">
                            <CardNumberElement options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#333',
                                        '::placeholder': { color: '#aab7c4' },
                                    },
                                    invalid: { color: '#9e2146' }
                                }
                            }} />
                        </div>
                    </div>
                    <Row>
                        <Col md={12}>
                            <div className="stripe-input-group">
                                <label className="input-label">MM / YY</label>
                                <div className="stripe-element-container">
                                    <CardExpiryElement options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#333',
                                                '::placeholder': { color: '#aab7c4' }
                                            },
                                            invalid: { color: '#9e2146' }
                                        }
                                    }} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <div className="stripe-input-group">
                        <label className="input-label">CVV</label>
                        <div className="stripe-element-container">
                            <CardCvcElement options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#333',
                                        '::placeholder': { color: '#aab7c4' }
                                    },
                                    invalid: { color: '#9e2146' }
                                }
                            }} />
                        </div>
                        <small className="help-text">3-digit code behind your card</small>
                    </div>

                    {error && <div className="payment-error-msg">{error}</div>}

                    <div className="stripe-form-actions">
                        <button type="button" className="stripe-btn-cancel" onClick={savedCards.length > 0 ? () => setShowForm(false) : onCancel}>Cancel</button>
                        <button
                            type="button"
                            className="stripe-btn-verify"
                            disabled={processing || !stripe}
                            onClick={handleVerify}
                        >
                            {processing ? 'Verifying...' : 'Verify'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="payment-ready-section">
                    {/* Add New Card Link */}
                    <span className="add-new-card-link" onClick={() => setShowForm(true)}>
                        ADD NEW CARD &nbsp;<span className="add-card-plus">+</span>
                    </span>

                    {error && <div className="payment-error-msg">{error}</div>}

                    {/* Pay Now Button */}
                    <div className="stripe-form-actions">
                        <button type="button" className="stripe-btn-cancel" onClick={onCancel}>Cancel</button>
                        <button
                            type="button"
                            className="stripe-btn-verify"
                            disabled={processing || !selectedCard}
                            onClick={handlePayNow}
                        >
                            {processing ? 'Processing...' : `Pay ₹${totalPrice.toLocaleString('en-IN')}`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const PaymentScreen = () => {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems, shippingAddress, paymentMethod },
    } = state;

    const [paymentMethodName, setPaymentMethod] = useState(
        paymentMethod || 'COD'
    );
    const [upiId, setUpiId] = useState('');
    const [isReselling, setIsReselling] = useState(false);
    const [expandedOnline, setExpandedOnline] = useState(paymentMethod === 'Stripe' || paymentMethod === 'GoogleUPI' || paymentMethod === 'NetBanking');

    const [bankSearchTerm, setBankSearchTerm] = useState('');
    const [selectedBank, setSelectedBank] = useState('');

    const banks = [
        { id: 'sbi', name: 'State Bank of India', icon: '🏦', color: '#1c75bc' },
        { id: 'hdfc', name: 'HDFC Bank', icon: '🏛️', color: '#004a8f' },
        { id: 'icici', name: 'ICICI Netbanking', icon: '💳', color: '#f5821f' },
        { id: 'axis', name: 'Axis Bank', icon: '📐', color: '#971237' },
        { id: 'airtel', name: 'Airtel Payments Bank', icon: '📶', color: '#e40000' },
        { id: 'allahabad', name: 'Allahabad Bank', icon: '🛶', color: '#0054a6' },
    ];

    const filteredBanks = banks.filter(bank =>
        bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase())
    );

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);



    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
        localStorage.setItem('paymentMethod', paymentMethodName);
        navigate('/placeorder');
    };

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    const productPrice = round2(cartItems.reduce((a, c) => a + c.price * c.quantity, 0));
    const shippingPrice = productPrice > 100 ? round2(0) : round2(10);
    const taxPrice = round2(0.15 * productPrice);
    const totalPrice = productPrice + shippingPrice + taxPrice;
    const myPersonalUpiId = "lindaxavierdhas3@oksbi";
    const merchantName = "Radios Store";
    return (
        <div className="payment-page">
            <section className="breadcrumb-area">
                <Container>
                    <div className="radios-breadcrumb">
                        <ul>
                            <li className="radiosbcrumb-item"><Link to="/">Home</Link></li>
                            <li className="radiosbcrumb-item active">Payment</li>
                        </ul>
                    </div>
                </Container>
            </section>

            <Container className="pb-80">
                <div className="checkout-steps-wrap">
                    <CheckoutSteps step1 step2 step3 />
                </div>

                <Form onSubmit={submitHandler}>
                    <Row>
                        <Col lg={8}>
                            <h2 className="payment-main-heading">Select Payment Method</h2>

                            {/* COD Option */}
                            <div
                                className={`payment-option-card ${paymentMethodName === 'COD' ? 'active' : ''}`}
                                onClick={() => {
                                    setPaymentMethod('COD');
                                    setExpandedOnline(false);
                                }}
                            >
                                <div className="payment-option-header">
                                    <span className="price-tag">₹{totalPrice.toFixed(2)}</span>
                                    <div className="method-name">
                                        Cash on Delivery 🚚
                                    </div>
                                    <div className="radio-custom"></div>
                                </div>
                            </div>

                            {/* Online Option */}
                            <div className={`payment-option-card ${paymentMethodName !== 'COD' ? 'active' : ''}`}>
                                <div
                                    className="payment-option-header"
                                    onClick={() => {
                                        setExpandedOnline(true);
                                        if (paymentMethodName === 'COD') setPaymentMethod('Stripe');
                                    }}
                                >
                                    <div className="price-content">
                                        <span className="price-tag">₹{totalPrice.toFixed(2)}</span>

                                    </div>
                                    <div className="method-name">
                                        Pay Online 💳
                                    </div>
                                    <div className="radio-custom"></div>
                                </div>

                                {expandedOnline && (
                                    <div className="payment-sub-options">
                                        <div
                                            className={`sub-option-item ${paymentMethodName === 'GoogleUPI' ? 'expanded' : ''}`}
                                            onClick={() => setPaymentMethod('GoogleUPI')}
                                            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center w-100">
                                                <div className="d-flex align-items-center gap-2">
                                                    <Form.Check
                                                        type="radio"
                                                        readOnly
                                                        checked={paymentMethodName === 'GoogleUPI'}
                                                    />
                                                    <span style={{ fontWeight: '600' }}>Pay by any UPI App</span>
                                                    <span className="offers-dot" style={{ color: '#ccc', margin: '0 5px' }}>•</span>
                                                    <span className="offers" style={{ color: '#008c76', fontSize: '13px', fontWeight: '500' }}>Offers Available</span>
                                                </div>
                                                <i className={`fas fa-chevron-${paymentMethodName === 'GoogleUPI' ? 'up' : 'down'}`} style={{ fontSize: '12px', color: '#666' }}></i>
                                            </div>

                                            {paymentMethodName === 'GoogleUPI' && (
                                                <div className="upi-details-expansion w-100" onClick={(e) => e.stopPropagation()}>
                                                    <div className="scan-pay-section">
                                                        <div className="section-header" style={{ borderTop: '1px solid #eee', marginTop: '15px', paddingTop: '15px' }}>
                                                            <div style={{ backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px', marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                                                                <i className="fas fa-qrcode" style={{ fontSize: '16px' }}></i>
                                                            </div>
                                                            <span style={{ fontWeight: '600', fontSize: '15px' }}>Scan and Pay</span>
                                                        </div>
                                                        <div className="upi-app-icons">
                                                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" />
                                                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" />
                                                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/PhonePe_Logo.svg" alt="PhonePe" />
                                                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" />
                                                        </div>
                                                        <div className="qr-code-wrapper">
                                                            <img
                                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${myPersonalUpiId}&pn=${encodeURIComponent(merchantName)}&am=${totalPrice}&cu=INR`
                                                                )}`}
                                                                alt="QR Code"
                                                                style={{ width: '200px', height: '200px' }}
                                                            />

                                                        </div>
                                                    </div>

                                                    <div className="upi-id-section">
                                                        <h5>Or Enter UPI ID</h5>
                                                        <div className="upi-input-group">
                                                            <input
                                                                type="text"
                                                                className="upi-input"
                                                                placeholder="e.g. mobileNumber@upi"
                                                                value={upiId}
                                                                onChange={(e) => setUpiId(e.target.value)}
                                                            />
                                                        </div>
                                                        <small className="upi-notice">
                                                            UPI ID is usually your mobile number followed by @upi, @okicici, or @ybl
                                                        </small>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="sub-option-item">
                                            <div className="d-flex align-items-center gap-2">
                                                <Form.Check type="radio" disabled />
                                                <span>Wallet</span>
                                            </div>
                                            <span className="offers">Offers Available</span>
                                        </div>
                                        <div
                                            className={`sub-option-item ${paymentMethodName === 'Stripe' ? 'expanded' : ''}`}
                                            onClick={() => setPaymentMethod('Stripe')}
                                            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center w-100">
                                                <div className="d-flex align-items-center gap-2">
                                                    <Form.Check
                                                        type="radio"
                                                        readOnly
                                                        checked={paymentMethodName === 'Stripe'}
                                                    />
                                                    <span>Debit/Credit Cards</span>
                                                    <span className="offers-dot" style={{ color: '#ccc', margin: '0 5px' }}>•</span>
                                                    <span className="offers" style={{ color: '#008c76', fontSize: '13px', fontWeight: '500' }}>Offers Available</span>
                                                </div>
                                                <i className={`fas fa-chevron-${paymentMethodName === 'Stripe' ? 'up' : 'down'}`} style={{ fontSize: '12px', color: '#666' }}></i>
                                            </div>

                                            {paymentMethodName === 'Stripe' && (
                                                <Elements stripe={stripePromise}>
                                                    <CheckoutForm
                                                        totalPrice={totalPrice}
                                                        onCancel={() => setPaymentMethod('COD')}
                                                    />
                                                </Elements>
                                            )}
                                        </div>
                                        <div
                                            className={`sub-option-item ${paymentMethodName === 'NetBanking' ? 'expanded' : ''}`}
                                            onClick={() => setPaymentMethod('NetBanking')}
                                            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center w-100">
                                                <div className="d-flex align-items-center gap-2">
                                                    <Form.Check
                                                        type="radio"
                                                        readOnly
                                                        checked={paymentMethodName === 'NetBanking'}
                                                    />
                                                    <span>Net Banking</span>
                                                </div>
                                                <i className={`fas fa-chevron-${paymentMethodName === 'NetBanking' ? 'up' : 'down'}`} style={{ fontSize: '12px', color: '#666' }}></i>
                                            </div>

                                            {paymentMethodName === 'NetBanking' && (
                                                <div className="netbanking-details-expansion w-100" onClick={(e) => e.stopPropagation()}>
                                                    <div className="bank-search-wrapper">
                                                        <div className="search-input-container">
                                                            <i className="fas fa-search search-icon"></i>
                                                            <input
                                                                type="text"
                                                                placeholder="Search by your bank name"
                                                                value={bankSearchTerm}
                                                                onChange={(e) => setBankSearchTerm(e.target.value)}
                                                                className="bank-search-input"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="banks-list">
                                                        {filteredBanks.map((bank) => (
                                                            <div
                                                                key={bank.id}
                                                                className={`bank-item ${selectedBank === bank.id ? 'selected' : ''}`}
                                                                onClick={() => setSelectedBank(bank.id)}
                                                            >
                                                                <div className="bank-info">
                                                                    <div className="bank-icon-circle" style={{ backgroundColor: bank.color + '15', color: bank.color }}>
                                                                        {bank.icon}
                                                                    </div>
                                                                    <span className="bank-name">{bank.name}</span>
                                                                </div>
                                                                <div className="bank-radio-indicator">
                                                                    <div className={`radio-dot ${selectedBank === bank.id ? 'active' : ''}`}></div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {filteredBanks.length === 0 && (
                                                            <div className="no-banks-found">No banks found matching "{bankSearchTerm}"</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Reselling Section */}
                            <div className="reselling-card">
                                <div>
                                    <h4>Reselling the order?</h4>
                                    <p>Click on 'Yes' to add Final Price</p>
                                </div>
                                <div className="toggle-buttons">
                                    <button
                                        type="button"
                                        className={`toggle-btn ${!isReselling ? 'active' : ''}`}
                                        onClick={() => setIsReselling(false)}
                                    >No</button>
                                    <button
                                        type="button"
                                        className={`toggle-btn ${isReselling ? 'active' : ''}`}
                                        onClick={() => setIsReselling(true)}
                                    >Yes</button>
                                </div>
                            </div>
                        </Col>

                        <Col lg={4}>
                            <div className="price-details-sidebar">
                                <div className="sidebar-title">Price Details ({cartItems.length} Items)</div>
                                <div className="sidebar-body">
                                    <div className="price-row">
                                        <span>Product Price</span>
                                        <span>₹{productPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="price-row">
                                        <span>Tax Price</span>
                                        <span>+ ₹{taxPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="price-row">
                                        <span>Shipping Price</span>
                                        <span>+ ₹{shippingPrice}</span>
                                    </div>
                                    <div className="price-row total-row">
                                        <span>Total Price</span>
                                        <span>₹{totalPrice.toFixed(2)}</span>
                                    </div>

                                    <div className="notice-text">
                                        Clicking on 'Continue' will not deduct any money
                                    </div>

                                    <button type='submit' className='thm-btn'>
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
    );
};

export default PaymentScreen;
