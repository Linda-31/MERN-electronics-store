import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Store } from '../context/StoreContext';
import CheckoutSteps from '../components/CheckoutSteps';
import axios from 'axios';
import '../Style/PlaceOrderScreen.css';

// ─── Icons (inline SVG helpers) ───────────────────────────────────────────────
const IconShipping = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
);

const IconPayment = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
    </svg>
);

const IconItems = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
    </svg>
);

const IconLock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
);

// ─── Reducer ──────────────────────────────────────────────────────────────────
const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loading: true };
        case 'CREATE_SUCCESS':
            return { ...state, loading: false };
        case 'CREATE_FAIL':
            return { ...state, loading: false };
        default:
            return state;
    }
};

// ─── Component ────────────────────────────────────────────────────────────────
const PlaceOrderScreen = () => {
    const navigate = useNavigate();

    const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;

    // Price calculations (unchanged logic)
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    cart.itemsPrice = round2(cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
    cart.taxPrice = round2(0.15 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

    // Place order handler (unchanged logic)
    const placeOrderHandler = async () => {
        try {
            dispatch({ type: 'CREATE_REQUEST' });

            // Map cart items to match the Order schema:
            // cart uses `quantity` + `_id`, but schema needs `qty` + `product`
            const mappedOrderItems = cart.cartItems.map((item) => ({
                name: item.name,
                qty: item.quantity,
                image: item.image,
                price: item.price,
                product: item._id,
            }));

            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: mappedOrderItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,   // ← saved correctly to DB
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            ctxDispatch({ type: 'CART_CLEAR' });
            dispatch({ type: 'CREATE_SUCCESS' });
            localStorage.removeItem('cartItems');
            navigate(`/order/${data._id}`);
        } catch (err) {
            dispatch({ type: 'CREATE_FAIL' });
            alert('Error placing order');
        }
    };

    useEffect(() => {
        if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart, navigate]);

    const { shippingAddress } = cart;

    return (
        <div className="placeorder-page">
            {/* Breadcrumb */}
            <section className="breadcrumb-area">
                <Container>
                    <div className="radios-breadcrumb">
                        <ul>
                            <li className="radiosbcrumb-item"><Link to="/">Home</Link></li>
                            <li className="radiosbcrumb-item"><Link to="/cart">Cart</Link></li>
                            <li className="radiosbcrumb-item active">Place Order</li>
                        </ul>
                    </div>
                </Container>
            </section>

            <Container className="pb-80">
                {/* Checkout Steps */}
                <div className="checkout-steps-wrap">
                    <CheckoutSteps step1 step2 step3 step4 />
                </div>

                <Row>
                    {/* ── Left Column ── */}
                    <Col lg={8}>

                        {/* Shipping Card */}
                        <div className="po-card">
                            <div className="po-card-header">
                                <div className="po-card-icon"><IconShipping /></div>
                                <h3>Shipping Address</h3>
                            </div>
                            <div className="po-card-body">
                                <div className="po-info-grid">
                                    <div className="po-info-item">
                                        <span className="po-info-label">Street Address</span>
                                        <span className="po-info-value">{shippingAddress.address}</span>
                                    </div>
                                    <div className="po-info-item">
                                        <span className="po-info-label">City</span>
                                        <span className="po-info-value">{shippingAddress.city}</span>
                                    </div>
                                    <div className="po-info-item">
                                        <span className="po-info-label">Postal Code</span>
                                        <span className="po-info-value">{shippingAddress.postalCode}</span>
                                    </div>
                                    <div className="po-info-item">
                                        <span className="po-info-label">Country</span>
                                        <span className="po-info-value">{shippingAddress.country}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Card */}
                        <div className="po-card">
                            <div className="po-card-header">
                                <div className="po-card-icon"><IconPayment /></div>
                                <h3>Payment Method</h3>
                            </div>
                            <div className="po-card-body">
                                <span className="po-payment-badge">
                                    <IconPayment />
                                    {cart.paymentMethod}
                                </span>
                            </div>
                        </div>

                        {/* Order Items Card */}
                        <div className="po-card">
                            <div className="po-card-header">
                                <div className="po-card-icon"><IconItems /></div>
                                <h3>Order Items</h3>
                            </div>
                            <div className="po-card-body" style={{ padding: '0 24px' }}>
                                {cart.cartItems.length === 0 ? (
                                    <div className="po-empty-cart">
                                        <p>Your cart is empty. <Link to="/shop">Continue shopping →</Link></p>
                                    </div>
                                ) : (
                                    <table className="po-items-table">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Name</th>
                                                <th>Qty</th>
                                                <th>Unit Price</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cart.cartItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td style={{ width: 72, paddingLeft: 0 }}>
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="po-item-img"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Link to={`/product/${item._id}`} className="po-item-name">
                                                            {item.name}
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <span className="po-qty-badge">× {item.quantity}</span>
                                                    </td>
                                                    <td>
                                                        <span className="po-item-price">₹{item.price.toFixed(2)}</span>
                                                    </td>
                                                    <td style={{ paddingRight: 0 }}>
                                                        <span className="po-item-subtotal">
                                                            ₹{(item.quantity * item.price).toFixed(2)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </Col>

                    {/* ── Right Column — Summary ── */}
                    <Col lg={4}>
                        <div className="po-summary-card">
                            <div className="po-summary-header">
                                Price Details
                                <span className="po-item-count-pill">{cart.cartItems.length} Items</span>
                            </div>
                            <div className="po-summary-body">
                                <div className="po-price-row">
                                    <span className="label">Items Price</span>
                                    <span className="value">₹{cart.itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="po-price-row">
                                    <span className="label">Tax (15%)</span>
                                    <span className="value">₹{cart.taxPrice.toFixed(2)}</span>
                                </div>
                                <div className="po-price-row">
                                    <span className="label">Shipping</span>
                                    <span className={`value ${cart.shippingPrice === 0 ? 'free' : ''}`}>
                                        {cart.shippingPrice === 0 ? 'FREE ✓' : `₹${cart.shippingPrice.toFixed(2)}`}
                                    </span>
                                </div>

                                {cart.shippingPrice === 0 && (
                                    <div className="po-savings-banner">
                                        🎉 You saved on shipping for ordering over ₹100!
                                    </div>
                                )}

                                <div className="po-total-row">
                                    <span className="label">Total Amount</span>
                                    <span className="value">₹{cart.totalPrice.toFixed(2)}</span>
                                </div>

                                <button
                                    className="po-place-btn"
                                    disabled={cart.cartItems.length === 0 || loading}
                                    onClick={placeOrderHandler}
                                >
                                    {loading ? (
                                        <>
                                            <span
                                                style={{
                                                    width: 18, height: 18,
                                                    border: '2px solid rgba(255,255,255,0.4)',
                                                    borderTopColor: '#fff',
                                                    borderRadius: '50%',
                                                    display: 'inline-block',
                                                    animation: 'spin 0.7s linear infinite'
                                                }}
                                            />
                                            Placing Order...
                                        </>
                                    ) : (
                                        '🛒 Place Order'
                                    )}
                                </button>

                                <div className="po-secure-note">
                                    <IconLock />
                                    Secure &amp; Encrypted Checkout
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Spinner keyframe */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PlaceOrderScreen;
