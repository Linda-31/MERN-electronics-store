import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { FiMaximize2, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { Store } from '../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { showSuccessToast } from '../utils/toastUtils';
import '../Style/ProductScreen.css';

/* ─────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────── */
const getImagePath = (img) => {
    if (!img) return 'https://via.placeholder.com/300x300?text=No+Image';
    if (img.startsWith('http') || img.startsWith('https')) return img;
    return img.startsWith('/') ? img : `/${img}`;
};

const handleImageError = (e) => {
    const src = e.target.src;
    if (src.includes('/images/')) {
        e.target.src = src.replace('/images/', '/uploads/');
    } else if (!src.includes('placeholder.com')) {
        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
    }
};

/* ─────────────────────────────────────────────────────────
   Star rating row
───────────────────────────────────────────────────────── */
const StarRow = ({ rating = 0 }) => (
    <div className="rp-stars">
        {[1, 2, 3, 4, 5].map((s) => (
            <span key={s}>
                {rating >= s
                    ? <FaStar />
                    : rating >= s - 0.5
                        ? <FaStarHalfAlt />
                        : <FaRegStar />}
            </span>
        ))}
    </div>
);

/* ─────────────────────────────────────────────────────────
   Single product card
───────────────────────────────────────────────────────── */
const RelatedCard = ({ product }) => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart } = state;

    const addToCartHandler = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        try {
            const { data } = await axios.get(`/api/products/${product._id}`);
            if (data.countInStock < quantity) {
                toast.error('Sorry. Product is out of stock');
                return;
            }
            ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
            showSuccessToast('Saved Successfully', 'Product added to cart successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    const addToWishlistHandler = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const existItem = state.wishlist.wishlistItems.find((x) => x._id === product._id);
        if (state.userInfo) {
            try {
                if (existItem) {
                    await axios.delete(`/api/wishlist/remove/${product._id}`, {
                        headers: { Authorization: `Bearer ${state.userInfo.token}` },
                    });
                    ctxDispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: product });
                    showSuccessToast('Removed Successfully', 'Removed from wishlist!');
                } else {
                    await axios.post('/api/wishlist/add', { productId: product._id }, {
                        headers: { Authorization: `Bearer ${state.userInfo.token}` },
                    });
                    ctxDispatch({ type: 'WISHLIST_ADD_ITEM', payload: product });
                    showSuccessToast('Saved Successfully', 'Added to wishlist!');
                }
            } catch (err) {
                toast.error(err.response?.data?.message || err.message);
            }
        } else {
            if (existItem) {
                ctxDispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: product });
                showSuccessToast('Removed Successfully', 'Removed from wishlist!');
            } else {
                ctxDispatch({ type: 'WISHLIST_ADD_ITEM', payload: product });
                showSuccessToast('Saved Successfully', 'Added to wishlist!');
            }
        }
    };

    return (
        <div className="rp-card">
            {/* Image */}
            <div className="rp-img-wrap">
                <Link to={`/product/${product._id}`}>
                    <img
                        src={getImagePath(product.image || (product.images && product.images[0]))}
                        alt={product.name}
                        className="rp-img"
                        onError={handleImageError}
                    />
                </Link>

                {/* Slide-in action icons */}
                <div className="rp-actions">
                    <Link to={`/product/${product._id}`} className="rp-action-btn" title="View Product">
                        <FiMaximize2 />
                    </Link>
                    <button className="rp-action-btn" title="Add to Cart" onClick={addToCartHandler}>
                        <FiShoppingBag />
                    </button>
                    <button className="rp-action-btn" title="Add to Wishlist" onClick={addToWishlistHandler}>
                        <FiHeart />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="rp-info">
                <StarRow rating={product.rating} />
                <Link to={`/product/${product._id}`} className="rp-name">
                    {product.name}
                </Link>
                <div className="rp-price-row">
                    {product.oldPrice && (
                        <span className="rp-old-price">${product.oldPrice.toFixed(2)}</span>
                    )}
                    <span className="rp-price">
                        ${product.price ? product.price.toFixed(2) : '0.00'}
                    </span>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   Shimmer skeleton card
───────────────────────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="rp-card rp-skeleton">
        <div className="rp-skeleton-img" />
        <div className="rp-info" style={{ padding: '14px 16px 20px' }}>
            <div className="rp-skeleton-line" style={{ width: '55%', height: 10, marginBottom: 12 }} />
            <div className="rp-skeleton-line" style={{ width: '95%', height: 13, marginBottom: 6 }} />
            <div className="rp-skeleton-line" style={{ width: '75%', height: 13, marginBottom: 14 }} />
            <div className="rp-skeleton-line" style={{ width: '40%', height: 15 }} />
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────
   Main exported component
   Props:
     currentProductId – string  (current product's _id)
     category         – string  (current product's category)
   Falls back gracefully: if category is missing it shows
   4 random products from any category.
───────────────────────────────────────────────────────── */
const RelatedProducts = ({ currentProductId, category }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Reset whenever the viewed product changes
        setItems([]);
        setError(false);
        setLoading(true);

        const fetchRelated = async () => {
            try {
                // Fetch ALL products from the reliable /api/products endpoint
                const { data } = await axios.get('/api/products');
                const allProducts = Array.isArray(data) ? data : (data.products || []);

                if (allProducts.length === 0) {
                    console.warn('RelatedProducts: No products found in API response');
                }

                // 1) Same category, exclude current
                // Use a safe check for category and toLowerCase()
                const safeCategory = (category || '').toLowerCase();

                let same = allProducts.filter(
                    (p) =>
                        String(p._id) !== String(currentProductId) &&
                        p.category &&
                        p.category.toLowerCase() === safeCategory
                );

                // 2) If fewer than 4 same-category results, pad with other products
                if (same.length < 4) {
                    const others = allProducts.filter(
                        (p) =>
                            String(p._id) !== String(currentProductId) &&
                            !same.find((s) => String(s._id) === String(p._id))
                    );
                    // shuffle others for variety
                    const shuffled = others.sort(() => Math.random() - 0.5);
                    same = [...same, ...shuffled].slice(0, 4);
                } else {
                    same = same.slice(0, 4);
                }

                setItems(same);
            } catch (err) {
                console.error('RelatedProducts fetch error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        // If we have a currentProductId, we can fetch
        // If category is missing, we still fetch (we just won't have many same-category matches)
        if (currentProductId) {
            fetchRelated();
        } else {
            setLoading(false);
        }
    }, [currentProductId, category]);

    // Initialize AOS if not already
    useEffect(() => {
        if (window.AOS) {
            window.AOS.refresh();
        }
    }, [items]);

    // Don't render section at all if there's an error or no items after loading
    if (!loading && (error || items.length === 0)) {
        return null;
    }

    return (
        <div className="rp-section" data-aos="fade-up" data-aos-duration="800">
            {/* Left-aligned heading (matches reference image) */}
            <div className="rp-heading">
                <h3 className="rp-title">Related Products</h3>
            </div>

            <Row className="g-3">
                {loading
                    ? [1, 2, 3, 4].map((n) => (
                        <Col key={n} xs={6} md={3}>
                            <SkeletonCard />
                        </Col>
                    ))
                    : items.map((p, idx) => (
                        <Col key={p._id} xs={6} md={3} data-aos="fade-up" data-aos-delay={String(idx * 100)}>
                            <RelatedCard product={p} />
                        </Col>
                    ))
                }
            </Row>
        </div>
    );
};

export default RelatedProducts;
