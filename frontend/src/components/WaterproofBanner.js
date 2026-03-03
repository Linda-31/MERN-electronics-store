import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import banner from '../assets/watch.jpg';

const WaterproofBanner = () => {
    return (
        <div style={{ padding: '40px 0', backgroundColor: '#fff' }}>
            <Container>
                <div
                    style={{
                        backgroundImage: `url(${banner})`,
                        borderRadius: '20px',
                        padding: '60px',
                        position: 'relative',
                        overflow: 'hidden',
                        minHeight: '300px',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {/* Left Content */}
                    <div style={{ position: 'relative', zIndex: 2, maxWidth: '50%' }}>
                        <div
                            style={{
                                backgroundColor: '#FF8717',
                                color: '#fff',
                                padding: '8px 20px',
                                borderRadius: '25px',
                                display: 'inline-block',
                                fontWeight: 'bold',
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                marginBottom: '20px',
                            }}
                        >
                            HOT SALE
                        </div>
                        <h2
                            style={{
                                color: '#fff',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                lineHeight: '1.2',
                                marginBottom: '30px',
                            }}
                        >
                            Waterproof Rating<br />
                            Enhanced Resistance
                        </h2>
                        <Link to="/shop">
                            <Button
                                style={{
                                    backgroundColor: '#FF8717',
                                    border: 'none',
                                    padding: '12px 35px',
                                    borderRadius: '25px',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                    textTransform: 'capitalize',
                                }}
                            >
                                Shop Now
                            </Button>
                        </Link>
                    </div>
                  
                    {/* Decorative Elements (optional floating icons) */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20%',
                            width: '60px',
                            height: '60px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '50%',
                            transform: 'rotate(45deg)',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '30px',
                            right: '15%',
                            width: '40px',
                            height: '40px',
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            borderRadius: '50%',
                        }}
                    />
                </div>
            </Container>
        </div>
    );
};

export default WaterproofBanner;
