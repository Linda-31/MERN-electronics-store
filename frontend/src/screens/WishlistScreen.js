import React, { useContext } from 'react';
import { Store } from '../context/StoreContext';
import { Container, Row, Col, Table, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';


import { showSuccessToast } from '../utils/toastUtils';
import { toast } from 'react-toastify';
import axios from 'axios';

const WishlistScreen = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        wishlist: { wishlistItems },
        cart: { cartItems },
    } = state;


    const removeItemHandler = async (item) => {
        if (state.userInfo) {
            try {
                await axios.delete(`/api/wishlist/remove/${item._id}`, {
                    headers: { Authorization: `Bearer ${state.userInfo.token}` },
                });
                ctxDispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: item });
                showSuccessToast('Removed Successfully', 'Product removed from wishlist!');
            } catch (err) {
                toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
            }
        } else {
            ctxDispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: item });
            showSuccessToast('Removed Successfully', 'Product removed from wishlist!');
        }
    };

    const addToCartHandler = async (item) => {
        const existItem = cartItems.find((x) => x._id === item._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            toast.error('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity },
        });
        showSuccessToast('Saved Successfully', 'Product added to cart successfully!');
        // Optional: Remove from wishlist after adding to cart
        // ctxDispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: item });
    };

    return (
        <div className="wishlist-page">
            <style>{`
                .breadcrumb-area {
                    background-color: #f8f9fa;
                    padding: 30px 0;
                    margin-bottom: 50px;
                }
                .radios-breadcrumb ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    display: flex;
                    margin-left: 70px;
                    align-items: center;
                }
                .radiosbcrumb-item a {
                    color: #111;
                    text-decoration: none;
                    font-weight: 500;
                }
                .radiosbcrumb-item.active {
                    color: #FF8717;
                }
                .wishlist-page .shop_table {
                    width: 100%;
                    border: 1px solid #ebebeb;
                    border-radius: 5px;
                    overflow: hidden;
                    border-collapse: collapse;
                }
                .wishlist-page .shop_table thead th {
                    text-transform: capitalize;
                    font-size: 16px;
                    font-weight: 700;
                    color: #555;
                    padding: 20px;
                    border-bottom: 1px solid #ebebeb;
                    background-color: #fff;
                    text-align: center;
                }
                .wishlist-page .shop_table thead th.product-name {
                    text-align: left;
                    width: 40%;
                }
                .wishlist-page .shop_table tbody td {
                    padding: 25px 20px;
                    vertical-align: middle;
                    border-bottom: 1px solid #ebebeb;
                    text-align: center;
                    color: #666;
                    font-size: 15px;
                }
                .wishlist-page .shop_table tbody td.product-name-col {
                    text-align: left;
                    display: flex;
                    align-items: center;
                }
                .wishlist-page .product-thumbnail {
                    margin-right: 20px;
                }
                .wishlist-page .product-thumbnail img {
                    width: 70px;
                    height: 70px;
                    object-fit: cover;
                    border: 1px solid #eee;
                }
                .wishlist-page .product-name-text a {
                    color: #111;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 16px;
                    transition: color 0.3s;
                }
                .wishlist-page .product-name-text a:hover {
                    color: #FF8717;
                }
                .wishlist-page .product-remove-icon {
                    margin-right: 15px;
                    color: #999;
                    font-size: 16px;
                    cursor: pointer;
                    transition: color 0.3s;
                }
                .wishlist-page .product-remove-icon:hover {
                    color: #ff0000;
                }
                .wishlist-page .thm-btn {
                    background-color: #FF8717;
                    color: #fff;
                    padding: 12px 25px;
                    border-radius: 5px;
                    font-weight: 700;
                    text-transform: uppercase;
                    border: none;
                    transition: all 0.3s;
                    display: inline-block;
                    text-decoration: none;
                    font-size: 13px;
                }
                .wishlist-page .thm-btn:hover {
                    background-color: #111;
                    transform: translateY(-2px);
                }
                .wishlist-page .stock-status {
                    font-weight: 600;
                    font-size: 14px;
                }
                .wishlist-page .in-stock {
                    color: #50AD06;
                }
                .wishlist-page .out-of-stock {
                    color: #ff0000;
                }
                .wishlist-page .wishlist-title h2 {
                    font-size: 30px;
                    font-weight: 700;
                    margin-bottom: 30px;
                    color: #111;
                }

                /* ── Mobile Wishlist Cards ── */
                .wishlist-mobile-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .wishlist-mobile-card {
                    border: 1px solid #ebebeb;
                    border-radius: 8px;
                    overflow: hidden;
                    background: #fff;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                .wishlist-mobile-card-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 16px;
                    border-bottom: 1px solid #f0f0f0;
                    gap: 10px;
                }
                .wishlist-mobile-img {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border: 1px solid #eee;
                    border-radius: 4px;
                    flex-shrink: 0;
                }
                .wishlist-mobile-card-body {
                    padding: 12px 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .wishlist-mobile-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .wishlist-mobile-label {
                    font-size: 13px;
                    color: #888;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .wishlist-mobile-value {
                    font-size: 15px;
                    color: #333;
                    font-weight: 500;
                }
            `}</style>

            {/* Breadcrumb Section */}
            <section className="breadcrumb-area">
                <Container fluid className="px-md-5 px-3">
                    <div className="radios-breadcrumb">
                        <ul>
                            <li className="radiosbcrumb-item"><Link to="/">Home</Link></li>
                            <li className="radiosbcrumb-item active">Wishlist</li>
                        </ul>
                    </div>
                </Container>
            </section>

            <Container fluid className="px-md-5 px-3 pb-80">
                <div className="wishlist-title">
                    <h2>My wishlist</h2>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-5" style={{ border: '1px solid #ebebeb' }}>
                        <div className="py-4">
                            <span style={{ fontSize: '18px', color: '#666' }}>No products added to the wishlist</span>
                        </div>
                    </div>
                ) : (
                    <Row>
                        <Col xs={12}>
                            {/* ── Desktop Table (hidden on xs/sm) ── */}
                            <div className="table-responsive d-none d-md-block">
                                <Table className="shop_table wishlist_table">
                                    <thead>
                                        <tr>
                                            <th className="product-name">Product name</th>
                                            <th className="product-price">Unit price</th>
                                            <th className="product-stock-status">Stock status</th>
                                            <th className="product-add-to-cart">&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {wishlistItems.map((item) => (
                                            <tr key={item._id}>
                                                <td className="product-name-col">
                                                    <span className="product-remove-icon" onClick={() => removeItemHandler(item)}>
                                                        <FaTrash />
                                                    </span>
                                                    <div className="product-thumbnail">
                                                        <Link to={`/product/${item._id}`}>
                                                            <Image src={item.image} alt={item.name} />
                                                        </Link>
                                                    </div>
                                                    <div className="product-name-text">
                                                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                                                    </div>
                                                </td>
                                                <td className="product-price">
                                                    <span className="fw-bold">${item.price}</span>
                                                </td>
                                                <td className="product-stock-status">
                                                    <span className={`stock-status ${item.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                                        {item.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                                    </span>
                                                </td>
                                                <td className="product-add-to-cart">
                                                    <button
                                                        className="thm-btn"
                                                        disabled={item.countInStock === 0}
                                                        onClick={() => addToCartHandler(item)}
                                                    >
                                                        Add to cart
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>

                            {/* ── Mobile Cards (visible only on xs/sm) ── */}
                            <div className="d-md-none wishlist-mobile-list">
                                {wishlistItems.map((item) => (
                                    <div key={item._id} className="wishlist-mobile-card">
                                        <div className="wishlist-mobile-card-header">
                                            <div className="d-flex align-items-center gap-2 flex-grow-1 overflow-hidden">
                                                <Link to={`/product/${item._id}`}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="wishlist-mobile-img"
                                                    />
                                                </Link>
                                                <div className="product-name-text overflow-hidden">
                                                    <Link
                                                        to={`/product/${item._id}`}
                                                        style={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </div>
                                            </div>
                                            <span
                                                className="product-remove-icon ms-2 flex-shrink-0"
                                                onClick={() => removeItemHandler(item)}
                                            >
                                                <FaTrash />
                                            </span>
                                        </div>
                                        <div className="wishlist-mobile-card-body">
                                            <div className="wishlist-mobile-row">
                                                <span className="wishlist-mobile-label">Price</span>
                                                <span className="wishlist-mobile-value fw-bold">${item.price}</span>
                                            </div>
                                            <div className="wishlist-mobile-row">
                                                <span className="wishlist-mobile-label">Stock</span>
                                                <span className={`stock-status ${item.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                                    {item.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </div>
                                            <div className="wishlist-mobile-row">
                                                <button
                                                    className="thm-btn w-100"
                                                    disabled={item.countInStock === 0}
                                                    onClick={() => addToCartHandler(item)}
                                                >
                                                    Add to cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default WishlistScreen;
