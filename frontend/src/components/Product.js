import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { FiHeart, FiShoppingBag, FiMaximize2 } from 'react-icons/fi';
import { Store } from '../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { showSuccessToast } from '../utils/toastUtils';
import '../Style/Product.css';

const Product = ({ product, showDetails }) => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart } = state;

    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            toast.error('Sorry. Product is out of stock');
            return;
        }

        const newCartItems = existItem
            ? cart.cartItems.map((item) =>
                item._id === existItem._id ? { ...product, quantity } : item
            )
            : [...cart.cartItems, { ...product, quantity }];

        if (state.userInfo) {
            try {
                await axios.post('/api/cart', { cartItems: newCartItems }, {
                    headers: { Authorization: `Bearer ${state.userInfo.token}` },
                });
            } catch (err) {
                console.error('Error syncing cart:', err);
            }
        }

        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...product, quantity },
        });
        showSuccessToast('Saved Successfully', 'Product added to cart successfully!');
    };

    const addToWishlistHandler = async () => {
        const existItem = state.wishlist.wishlistItems.find((x) => x._id === product._id);

        if (state.userInfo) {
            try {
                if (existItem) {
                    const { data } = await axios.delete(`/api/wishlist/remove/${product._id}`, {
                        headers: { Authorization: `Bearer ${state.userInfo.token}` },
                    });
                    ctxDispatch({ type: 'WISHLIST_ADD_ITEM', payload: data });
                    // Actually, let's fix the reducer to handle SET_WISHLIST as well, or just use REMOVE logic.
                    // For now, let's stick to the simplest:
                    ctxDispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: product });
                    showSuccessToast('Removed Successfully', 'Product removed from wishlist!');
                } else {
                    await axios.post('/api/wishlist/add', { productId: product._id }, {
                        headers: { Authorization: `Bearer ${state.userInfo.token}` },
                    });
                    ctxDispatch({ type: 'WISHLIST_ADD_ITEM', payload: product });
                    showSuccessToast('Saved Successfully', 'Product added to wishlist successfully!');
                }
            } catch (err) {
                toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
            }
        } else {
            // Unauthenticated wishlist (local only)
            if (existItem) {
                ctxDispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: product });
                showSuccessToast('Removed Successfully', 'Product removed from wishlist!');
            } else {
                ctxDispatch({ type: 'WISHLIST_ADD_ITEM', payload: product });
                showSuccessToast('Saved Successfully', 'Product added to wishlist successfully!');
            }
        }
    };
   const BACKEND_URL = 'https://your-backend-service-name.onrender.com';
  
//    const getImagePath = (img) => {
//     if (!img) return 'https://via.placeholder.com/300x300?text=No+Image';

//     if (img.startsWith('http')) return img;

//     // 1. Replace all backslashes (\) with forward slashes (/)
//     // 2. Ensure it starts with a single slash
//     let cleanPath = img.replace(/\\/g, '/');
//     if (!cleanPath.startsWith('/')) {
//         cleanPath = '/' + cleanPath;
//     }

//     return `${BACKEND_URL}${cleanPath}`;
// };
const getImagePath = (img) => {
    if (!img) return 'https://via.placeholder.com/300x300?text=No+Image';

    // 1. Cloudinary or external URLs (Starts with http)
    if (img.startsWith('http')) return img;

    // 2. Legacy Local Paths (Starts with /uploads or similar)
    // Normalize slashes (mostly for Windows legacy data)
    let cleanPath = img.replace(/\\/g, '/');
    
    // Ensure it starts with exactly one slash
    if (!cleanPath.startsWith('/')) {
        cleanPath = '/' + cleanPath;
    }

    // 3. Remove trailing slash from BACKEND_URL to avoid "com//uploads"
    const base = BACKEND_URL.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;

    return `${base}${cleanPath}`;
};
    // const handleImageError = (e) => {
    //     const currentSrc = e.target.src;
    //     // If image in /images fails, try /uploads as a fallback if the seeder/data mismatch
    //     if (currentSrc.includes('/images/')) {
    //         e.target.src = currentSrc.replace('/images/', '/uploads/');
    //     } else if (!currentSrc.includes('placeholder.com')) {
    //         e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
    //     }
    // };
const handleImageError = (e) => {
    // Avoid infinite loops if the placeholder itself fails
    if (e.target.src.includes('placeholder.com')) return;
    
    // If a specific folder path fails, try a generic fallback
    console.warn("Image failed to load, falling back to placeholder.");
    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
};
    return (
        <div className={`product-card ${showDetails ? 'list-view' : ''}`}>
            <div className='product-image-container'>
                <Link to={`/product/${product._id}`}>
                    <img
                        src={getImagePath(product.image || (product.images && product.images[0]))}
                        alt={product.name}
                        className='product-image img-fluid'
                        onError={handleImageError}
                    />
                </Link>
                <div className='product-actions'>
                    <button className='action-btn' title='Quick View'><FiMaximize2 /></button>
                    <button className='action-btn' title='Add to Cart' onClick={addToCartHandler}><FiShoppingBag /></button>
                    <button className='action-btn' title='Add to Wishlist' onClick={addToWishlistHandler}><FiHeart /></button>
                </div>
            </div>

            <div className='product-body'>
                <div className='product-rating'>
                    <Rating value={product.rating} />
                </div>
                <h3 className='product-name'>
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                </h3>
                <div className='product-price-wrapper'>
                    <span className='product-price'>${product.price ? product.price.toFixed(2) : '0.00'}</span>
                    {product.oldPrice && (
                        <span className='product-old-price'>${product.oldPrice.toFixed(2)}</span>
                    )}
                </div>
                {showDetails && (
                    <div className="product-details-extra mt-3" style={{ fontSize: '13px', color: '#666' }}>
                        <p className="mb-1"><strong>SKU:</strong> {product.sku}</p>
                        <p className="mb-1"><strong>Category:</strong> {product.category}</p>
                        {product.colors && product.colors.length > 0 && (
                            <p className="mb-1"><strong>Colors:</strong> {product.colors.join(', ')}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Product;
