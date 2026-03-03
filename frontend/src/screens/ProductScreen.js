import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Image, Container, Button, Nav, Form } from 'react-bootstrap';
import { FaPlus, FaMinus, FaStar, FaRegStar } from 'react-icons/fa';
import Rating from '../components/Rating';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';
import { Store } from '../context/StoreContext';
import '../Style/ProductScreen.css';

import { toast } from 'react-toastify';
import { showSuccessToast } from '../utils/toastUtils';

const ProductScreen = () => {
    const [product, setProduct] = useState({});
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const { id } = useParams();


    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;

    const fetchProduct = useCallback(async () => {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
    }, [id]);

    const decreaseQty = () => {
        if (qty > 1) {
            setQty(qty - 1);
        }
    };

    const increaseQty = () => {
        if (qty < product.countInStock) {
            setQty(qty + 1);
        }
    };

    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + qty : qty;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            toast.error('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...product, quantity },
        });
        showSuccessToast('Saved Successfully', 'Product added to cart successfully!');
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        if (!reviewRating || !reviewComment) {
            toast.warn('Please enter rating and comment');
            return;
        }
        try {
            await axios.post(
                `/api/products/${product._id}/reviews`,
                { rating: reviewRating, comment: reviewComment },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            showSuccessToast('Review Submitted', 'Your review has been submitted successfully');
            setReviewRating(0);
            setReviewComment('');
            fetchProduct();
        } catch (err) {
            toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
        }
    };

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
    }, [fetchProduct]);

    return (
        <div className="product-screen-wrapper">
            {/* Breadcrumb section */}
            <section className="breadcrumb-area">
                <Container fluid className="px-md-5 px-3">
                    <div className="radios-breadcrumb">
                        <ul style={{ marginLeft: '80px'}}>
                            <li><Link to="/">Home</Link></li>
                            <li className="active">{product.name}</li>
                        </ul>
                    </div>
                </Container>
            </section>

            <section className="product-single-section">
                <Container fluid className="px-md-5 px-3">
                    <Row>
                        <Col md={6}>
                            <div className="product-image-wrap text-center">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fluid
                                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="product-details">
                                <h2 className="product_title">{product.name}</h2>
                                <div className="rating-wrap mb-3 d-flex align-items-center">
                                    <div className="product-rating-stars">
                                        <Rating value={product.rating} text={`(${product.numReviews} customer reviews)`} />
                                    </div>
                                </div>
                                <div className="price">
                                    {product.oldPrice && <del>${product.oldPrice.toFixed(2)}</del>}
                                    <span>${product.price ? product.price.toFixed(2) : '0.00'}</span>
                                </div>
                                <div className="woocommerce-product-details__short-description">
                                    <p>{product.description}</p>
                                </div>

                                <div className="product_meta">
                                    <span className="sku_wrapper">SKU: <span>{product.sku || 'N/A'}</span></span>
                                    <span className="posted_in">Category: <span>{product.category}</span></span>
                                    {product.brand && <span className="brand_wrapper">Brand: <span>{product.brand}</span></span>}
                                    <span className="availability">Status: <span style={{ color: product.countInStock > 0 ? '#50AD06' : '#FF0000', fontWeight: 'bold' }}>
                                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span></span>
                                </div>

                                {product.countInStock > 0 && (
                                    <div className="product-option">
                                        <div className="quantity">
                                            <button
                                                className="qty-btn"
                                                onClick={decreaseQty}
                                                disabled={qty <= 1}
                                            >
                                                <FaMinus />
                                            </button>
                                            <input
                                                type="number"
                                                className="product-count"
                                                readOnly
                                                value={qty}
                                            />
                                            <button
                                                className="qty-btn"
                                                onClick={increaseQty}
                                                disabled={qty >= product.countInStock}
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                        <Button
                                            onClick={addToCartHandler}
                                            className='thm-btn thm-btn__2'
                                            type='button'
                                            disabled={product.countInStock === 0}
                                        >
                                            Add To Cart
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>

                    {/* Tabs section */}
                    <div className="tablist-wrapper">
                        <Nav variant="tabs" className="justify-content-center" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                            <Nav.Item>
                                <Nav.Link eventKey="description">Description</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="additional">Additional information</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="reviews">Reviews ({product.numReviews})</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <div className="tab-content py-4">
                            {activeTab === 'description' && (
                                <div className="tab-pane-content">
                                    <p>{product.description}</p>
                                    <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
                                </div>
                            )}
                            {activeTab === 'additional' && (
                                <div className="tab-pane-content">
                                    <table className="table table-bordered w-50 mx-auto">
                                        <tbody>
                                            <tr>
                                                <th className="bg-light">Color</th>
                                                <td>{product.colors ? product.colors.join(', ') : 'Default'}</td>
                                            </tr>
                                            <tr>
                                                <th className="bg-light">Brand</th>
                                                <td>{product.brand}</td>
                                            </tr>
                                            <tr>
                                                <th className="bg-light">SKU</th>
                                                <td>{product.sku}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {activeTab === 'reviews' && (
                                <div className="tab-pane-content text-start">
                                    <div className="reviews-list mb-5">
                                        <h4 className="mb-4">Customer Reviews</h4>
                                        {(!product.reviews || product.reviews.length === 0) ? (
                                            <p className="no-reviews text-muted">No reviews yet for this product. Be the first to share your thoughts!</p>
                                        ) : (
                                            <ul className="list-unstyled">
                                                {product.reviews.map((review) => (
                                                    <li key={review._id} className="review-item border-bottom pb-4 mb-4">
                                                        <div className="review-header d-flex justify-content-between align-items-start">
                                                            <div className="review-meta text-start">
                                                                <h4 className="reviewer-name text-uppercase mb-1">{review.name}</h4>
                                                                <span className="review-date text-uppercase text-muted small">
                                                                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                                </span>
                                                            </div>
                                                            <div className="review-rating text-end">
                                                                <Rating value={review.rating} />
                                                            </div>
                                                        </div>
                                                        <div className="review-comment mt-3 text-start">
                                                            <p className="mb-0">{review.comment}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="add-review-section">
                                        {userInfo ? (
                                            <>
                                                <h3 className="add-review-title">Add a review</h3>
                                                <Form className="add-review-form mt-4" onSubmit={submitReviewHandler}>
                                                    <div className="mb-4">
                                                        <Form.Label className="d-block mb-2">Your rating</Form.Label>
                                                        <div className="review-stars-input" style={{ fontSize: '24px', color: '#FFD700' }}>
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <span
                                                                    key={star}
                                                                    onClick={() => setReviewRating(star)}
                                                                    className="star-icon me-2"
                                                                    style={{ cursor: 'pointer', color: '#FFD700' }}
                                                                >
                                                                    {reviewRating >= star ? <FaStar style={{ color: '#FFD700' }} /> : <FaRegStar style={{ color: '#FFD700' }} />}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Form.Group className="mb-4">
                                                        <Form.Label className="mb-2">Your review</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={4}
                                                            value={reviewComment}
                                                            onChange={(e) => setReviewComment(e.target.value)}
                                                            placeholder="Write your review here..."
                                                            required
                                                            style={{ borderRadius: '0', borderColor: '#ebebeb' }}
                                                        />
                                                    </Form.Group>

                                                    <Button type="submit" className="thm-btn review-submit-btn">
                                                        SUBMIT
                                                    </Button>
                                                </Form>
                                            </>
                                        ) : (
                                            <div className="alert alert-info py-3 px-4" style={{ borderRadius: '30px' }}>
                                                <i className="fas fa-info-circle me-2"></i>
                                                Please <Link to={`/signin?redirect=/product/${product._id}`} className="fw-bold" style={{ color: '#ff8717' }}>sign in</Link> to write a review.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Related Products ── */}
                    <RelatedProducts
                        currentProductId={id}
                        category={product.category}
                    />
                    {/* Recently Viewed Section */}
                </Container>
            </section>
        </div>
    );
};

export default ProductScreen;
