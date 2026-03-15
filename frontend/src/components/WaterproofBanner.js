import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import banner from '../assets/watch.jpg';

const WaterproofBanner = () => {
    return (
        <div style={{ padding: '40px 0', backgroundColor: '#fff' }}>
            <style>{`
                .banner-wrapper {
                    background-image: url(${banner});
                    background-size: cover;
                    background-position: center;
                    border-radius: 20px;
                    padding: 60px;
                    position: relative;
                    overflow: hidden;
                    min-height: 300px;
                    display: flex;
                    align-items: center;
                }
                .banner-content {
                    position: relative;
                    z-index: 2;
                    max-width: 50%;
                }
                @media (max-width: 768px) {
                    .banner-wrapper {
                        padding: 40px 20px;
                        justify-content: center;
                        text-align: center;
                    }
                    .banner-content {
                        max-width: 100%;
                    }
                    .banner-content h2 {
                        font-size: 1.8rem !important;
                    }
                }
            `}</style>
            <Container>
                <div className="banner-wrapper">
                    {/* Left Content */}
                    <div className="banner-content">
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
