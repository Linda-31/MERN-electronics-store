import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';

const RecentlyViewedSection = () => {
    const [recentProducts, setRecentProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const fetchRecentProducts = async () => {
            try {
                const { data } = await axios.get('/api/products');
                // Get random 4 products to simulate recently viewed
                const shuffled = data.sort(() => 0.5 - Math.random());
                setRecentProducts(shuffled.slice(0, 4));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchRecentProducts();

        // Load wishlist from localStorage
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlist(savedWishlist);
    }, []);

    const toggleWishlist = (productId) => {
        let updatedWishlist;
        if (wishlist.includes(productId)) {
            updatedWishlist = wishlist.filter(id => id !== productId);
        } else {
            updatedWishlist = [...wishlist, productId];
        }
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    };


    return (
        <section style={{ backgroundColor: '#F5F5F5', padding: '60px 0' }}>
            <Container>
                <h2 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    marginBottom: '40px',
                    color: '#333'
                }}>
                    Recently Viewed Products
                </h2>

                <Row>
                    {recentProducts.map((product) => (
                        <Col key={product._id} lg={3} md={6} sm={12} className='mb-4'>
                            <Card style={{
                                border: 'none',
                                borderRadius: '8px',
                                backgroundColor: '#fff',
                                position: 'relative',
                                height: '100%',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}>
                                {/* Wishlist Icon */}
                                <div
                                    onClick={() => toggleWishlist(product._id)}
                                    style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        zIndex: 10,
                                        cursor: 'pointer',
                                        backgroundColor: '#fff',
                                        borderRadius: '50%',
                                        width: '35px',
                                        height: '35px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {wishlist.includes(product._id) ? (
                                        <FaHeart color='#FF8717' size={18} />
                                    ) : (
                                        <FaRegHeart color='#666' size={18} />
                                    )}
                                </div>

                                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                                    <Card.Img
                                        variant='top'
                                        src={product.image}
                                        style={{
                                            padding: '20px',
                                            height: '200px',
                                            objectFit: 'contain',
                                            backgroundColor: '#fff'
                                        }}
                                    />

                                    <Card.Body style={{ padding: '15px' }}>
                                        {/* Rating and Reviews */}
                                        <div style={{ marginBottom: '10px' }}>
                                            <Rating value={product.rating} text={`(${product.numReviews || 0})`} />
                                        </div>

                                        {/* Product Name */}
                                        <Card.Title style={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#333',
                                            marginBottom: '12px',
                                            height: '40px',
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical'
                                        }}>
                                            {product.name}
                                        </Card.Title>

                                        {/* Price */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{
                                                fontSize: '14px',
                                                color: '#999',
                                                textDecoration: 'line-through'
                                            }}>
                                                ${(product.price * 1.2).toFixed(2)}
                                            </span>
                                            <span style={{
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                color: '#FF8717'
                                            }}>
                                                ${product.price}
                                            </span>
                                        </div>
                                    </Card.Body>
                                </Link>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

export default RecentlyViewedSection;
