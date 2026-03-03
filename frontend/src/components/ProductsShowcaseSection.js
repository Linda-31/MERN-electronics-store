import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import Rating from './Rating';
import goggles from '../assets/goggles.jpg';
import kettle from '../assets/kettle.jpg';

const ProductsShowcaseSection = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [handPickedProducts, setHandPickedProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/api/products');

                // Get first 3 products for featured
                setFeaturedProducts(data.slice(0, 3));

                // Get next 3 products for hand picked
                setHandPickedProducts(data.slice(3, 6));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);


    const ProductCard = ({ product }) => (
        <div style={{
            display: 'flex',
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '15px',
            position: 'relative',
            transition: 'transform 0.3s'
        }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                flexShrink: 0
            }}>
                <img src={product.image} alt={product.name} style={{ maxWidth: '80%', maxHeight: '80%' }} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '8px' }}>
                    <Rating value={product.rating} text={`(${product.numReviews || 0})`} />
                </div>
                <h6 style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '10px',
                    color: '#333',
                    lineHeight: '1.3'
                }}>
                    {product.name}
                </h6>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {product.originalPrice && (
                        <span style={{
                            textDecoration: 'line-through',
                            color: '#999',
                            fontSize: '0.85rem'
                        }}>
                            ${Number(product.originalPrice).toFixed(2)}
                        </span>
                    )}
                    <span style={{
                        fontWeight: 'bold',
                        color: '#333',
                        fontSize: '1rem'
                    }}>
                        ${Number(product.price).toFixed(2)}
                    </span>
                </div>
            </div>
            <button style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
            }}>
                <FaRegHeart style={{ color: '#999', fontSize: '14px' }} />
            </button>
        </div>
    );

    return (
        <div style={{ padding: '60px 0', backgroundColor: '#fff' }}>
            <Container>
                <Row>
                    {/* Left Column - Featured Products */}
                    <Col lg={3} md={6} className="mb-4">
                        <h4 style={{ fontWeight: 'bold', marginBottom: '20px', fontSize: '1.3rem' }}>
                            Featured Products
                        </h4>
                        {featuredProducts.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                    </Col>

                    {/* Middle Column - Hand Picked */}
                    <Col lg={3} md={6} className="mb-4">
                        <h4 style={{ fontWeight: 'bold', marginBottom: '20px', fontSize: '1.3rem' }}>
                            Hand Picked
                        </h4>
                        {handPickedProducts.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                    </Col>

                    {/* Right Column - Promotional Banners */}
                    <Col lg={6} md={12}>
                        {/* VR Goggles Banner */}
                        <div style={{
                            backgroundImage: `url(${goggles})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'bottom right',
                            borderRadius: '15px',
                            padding: '40px',
                            marginBottom: '20px',
                            position: 'relative',
                            overflow: 'hidden',
                            minHeight: '280px'
                        }}>
                            <div style={{ position: 'relative', zIndex: 2, maxWidth: '50%' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    color: '#333',
                                    marginBottom: '10px',
                                    letterSpacing: '1px'
                                }}>
                                    BEST SELLER 2022
                                </div>
                                <h3 style={{
                                    fontSize: '1.8rem',
                                    fontWeight: 'bold',
                                    marginBottom: '10px',
                                    color: '#333'
                                }}>
                                    Best VR
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px' }}>
                                    Perfect to enjoy VR games
                                </p>
                                <Link to="/shop">
                                    <Button style={{
                                        backgroundColor: '#4169E1',
                                        border: 'none',
                                        borderRadius: '25px',
                                        padding: '10px 20px',
                                        fontWeight: 'bold',
                                        fontSize: '0.85rem'
                                    }}>
                                        Shop Now
                                    </Button>
                                </Link>
                            </div>

                        </div>

                        {/* Electric Kettle Banner */}
                        <div style={{
                            backgroundImage: `url(${kettle})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'bottom right',
                            borderRadius: '15px',
                            padding: '40px',
                            position: 'relative',
                            overflow: 'hidden',
                            minHeight: '280px'
                        }}>
                            <div style={{ position: 'relative', zIndex: 2, maxWidth: '50%' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    color: '#333',
                                    marginBottom: '10px',
                                    letterSpacing: '1px'
                                }}>
                                    NEW ARRIVALS
                                </div>
                                <h3 style={{
                                    fontSize: '1.8rem',
                                    fontWeight: 'bold',
                                    marginBottom: '10px',
                                    color: '#333'
                                }}>
                                    Electric Kettle
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px' }}>
                                    Get 15% off when buying online
                                </p>
                                <Link to="/shop">
                                    <Button style={{
                                        backgroundColor: '#4169E1',
                                        border: 'none',
                                        borderRadius: '25px',
                                        padding: '10px 25px',
                                        fontWeight: 'bold',
                                        fontSize: '0.85rem'
                                    }}>
                                        Shop Now
                                    </Button>
                                </Link>
                            </div>

                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProductsShowcaseSection;
