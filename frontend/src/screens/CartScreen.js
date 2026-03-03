import React, { useContext } from 'react';
import { Store } from '../context/StoreContext';
import { Container, Row, Col, Table, Form, Button, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaLongArrowAltRight, FaPlus, FaMinus, FaTimes } from 'react-icons/fa';
import '../Style/CartScreen.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartScreen = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItems },
        userInfo,
    } = state;
    const navigate = useNavigate();

    const updateCartHandler = async (item, quantity) => {
        if (quantity < 1 || quantity > item.countInStock) return;

        const newCartItems = cartItems.map((x) =>
            x._id === item._id ? { ...item, quantity } : x
        );

        if (userInfo) {
            try {
                await axios.post('/api/cart', { cartItems: newCartItems }, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
            } catch (err) {
                toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
                return;
            }
        }

        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity },
        });
    };

    const removeItemHandler = async (item) => {
        const newCartItems = cartItems.filter((x) => x._id !== item._id);

        if (userInfo) {
            try {
                await axios.post('/api/cart', { cartItems: newCartItems }, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
            } catch (err) {
                toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
                return;
            }
        }

        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    return (
        <div className="cart-page">
            {/* Breadcrumb Section */}
            <section className="breadcrumb-area">
                <Container fluid className="px-md-5 px-3">
                    <div className="radios-breadcrumb">
                        <ul>
                            <li className="radiosbcrumb-item"><Link to="/">Home</Link></li>
                            <li className="radiosbcrumb-item active">Cart</li>
                        </ul>
                    </div>
                </Container>
            </section>

            <Container fluid className="px-md-5 px-3 pb-80">
                {cartItems.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <Image src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png" style={{ width: '250px', maxWidth: '80vw' }} />
                        </div>
                        <h2 className="fw-bold mb-3">Your Cart is Empty</h2>
                        <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/shop" className="btn-orange">
                            Return To Shop <FaLongArrowAltRight className="ms-2" />
                        </Link>
                    </div>
                ) : (
                    <Row>
                        <Col xs={12}>
                            {/* ── Desktop Table (hidden on xs/sm) ── */}
                            <div className="table-responsive d-none d-md-block">
                                <Table className="shop_table">
                                    <thead>
                                        <tr>
                                            <th className="product-name">PRODUCT</th>
                                            <th className="product-price">PRICE</th>
                                            <th className="product-quantity">QUANTITY</th>
                                            <th className="product-subtotal">SUBTOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={item._id}>
                                                <td className="product-col">
                                                    <div className="product-remove">
                                                        <span className="remove" onClick={() => removeItemHandler(item)}>
                                                            <FaTimes />
                                                        </span>
                                                    </div>
                                                    <div className="product-thumbnail">
                                                        <Link to={`/product/${item._id}`}>
                                                            <Image src={item.image} alt={item.name} />
                                                        </Link>
                                                    </div>
                                                    <Link to={`/product/${item._id}`} className="product-name-text">
                                                        {item.name}
                                                    </Link>
                                                </td>
                                                <td className="product-price">
                                                    <span>${item.price.toFixed(2)}</span>
                                                </td>
                                                <td className="product-quantity">
                                                    <div className="quantity">
                                                        <button
                                                            className="qty-btn"
                                                            onClick={() => updateCartHandler(item, item.quantity - 1)}
                                                        >
                                                            <FaMinus />
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={item.quantity}
                                                            readOnly
                                                        />
                                                        <button
                                                            className="qty-btn"
                                                            onClick={() => updateCartHandler(item, item.quantity + 1)}
                                                        >
                                                            <FaPlus />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="product-subtotal">
                                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>

                            {/* ── Mobile Cards (visible only on xs/sm) ── */}
                            <div className="d-md-none cart-mobile-list">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="cart-mobile-card">
                                        <div className="cart-mobile-card-header">
                                            <div className="d-flex align-items-center gap-3">
                                                <Link to={`/product/${item._id}`}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="cart-mobile-img"
                                                    />
                                                </Link>
                                                <Link to={`/product/${item._id}`} className="product-name-text flex-grow-1">
                                                    {item.name}
                                                </Link>
                                            </div>
                                            <span className="remove" onClick={() => removeItemHandler(item)}>
                                                <FaTimes />
                                            </span>
                                        </div>
                                        <div className="cart-mobile-card-body">
                                            <div className="cart-mobile-row">
                                                <span className="cart-mobile-label">Price</span>
                                                <span className="cart-mobile-value">${item.price.toFixed(2)}</span>
                                            </div>
                                            <div className="cart-mobile-row">
                                                <span className="cart-mobile-label">Quantity</span>
                                                <div className="quantity">
                                                    <button className="qty-btn" onClick={() => updateCartHandler(item, item.quantity - 1)}>
                                                        <FaMinus />
                                                    </button>
                                                    <input type="text" value={item.quantity} readOnly />
                                                    <button className="qty-btn" onClick={() => updateCartHandler(item, item.quantity + 1)}>
                                                        <FaPlus />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="cart-mobile-row">
                                                <span className="cart-mobile-label">Subtotal</span>
                                                <span className="cart-mobile-value fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Form */}
                            <div className="actions-wrap">
                                <div className="coupon-form">
                                    <input type="text" placeholder="Coupon code" />
                                    <button className="btn-orange">APPLY COUPON</button>
                                </div>
                            </div>
                        </Col>

                        {/* Cart Totals */}
                        <Col xs={12} className="cart-totals-section">
                            <Row>
                                <Col xs={12} md={8} lg={6} className="ms-md-auto">
                                    <h2>Cart totals</h2>
                                    <table className="totals-table">
                                        <tbody>
                                            <tr>
                                                <th>SUBTOTAL</th>
                                                <td>
                                                    ${cartItems.reduce((a, c) => a + c.price * c.quantity, 0).toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>TOTAL</th>
                                                <td>
                                                    <strong>${cartItems.reduce((a, c) => a + c.price * c.quantity, 0).toFixed(2)}</strong>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="checkout-btn-wrap">
                                        <button
                                            className="btn-checkout"
                                            onClick={checkoutHandler}
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default CartScreen;
