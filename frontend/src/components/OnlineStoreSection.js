import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import laptopImg from '../assets/laptop.png';
import helmetImg from '../assets/helmet.png';
import headsetImg from '../assets/headset.png';

const OnlineStoreSection = () => {
    const [countdown, setCountdown] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        // Set countdown timer (example: 24 hours from now)
        const targetTime = new Date().getTime() + (24 * 60 * 60 * 1000);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetTime - now;

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setCountdown({ hours, minutes, seconds });

            if (distance < 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const categories = [
        {
            title: 'Laptops & Computers',
            image: laptopImg,
            links: [
                { name: 'Ending Offers', url: '/search?category=offers' },
                { name: 'Laptops', url: '/search?category=laptops' },
                { name: 'Refurbished Laptops', url: '/search?category=refurbished' },
                { name: 'Accessories', url: '/search?category=accessories' },
                { name: 'Printers & Ink', url: '/search?category=printers' },
            ]
        },
        {
            title: 'Week Deals Limited',
            image: helmetImg,
            links: [
                { name: 'Ending Offers', url: '/search?category=offers' },
                { name: 'Laptops', url: '/search?category=laptops' },
                { name: 'Refurbished Laptops', url: '/search?category=refurbished' },
                { name: 'Accessories', url: '/search?category=accessories' },
                { name: 'Printers & Ink', url: '/search?category=printers' },
            ]
        },
        {
            title: 'Featured Products',
            image: headsetImg,
            links: [
                { name: 'Ending Offers', url: '/search?category=offers' },
                { name: 'Laptops', url: '/search?category=laptops' },
                { name: 'Refurbished Laptops', url: '/search?category=refurbished' },
                { name: 'Accessories', url: '/search?category=accessories' },
                { name: 'Printers & Ink', url: '/search?category=printers' },
            ]
        }
    ];

    const formatTime = (time) => String(time).padStart(2, '0');

    return (
        <div style={{ padding: '60px 0', backgroundColor: '#fff' }}>
            <Container>
                <div className="text-center mb-4">
                    <div style={{ color: '#FF8717', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '10px' }}>
                      Go to Daily Deals
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '40px' }}>
                        Your Online Store
                    </h2>
                </div>
                <Row>
                    {categories.map((category, index) => (
                        <Col key={index} lg={4} md={6} className="mb-4">
                            <Card style={{
                                border: 'none',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                                height: '100%'
                            }}>
                                <div style={{ backgroundColor: '#f9f9f9', padding: '20px', textAlign: 'center' }}>
                                    <h5 style={{ fontWeight: 'bold', marginBottom: '20px' }}>{category.title}</h5>
                                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                                        <img
                                            src={category.image}
                                            alt={category.title}
                                            style={{ maxWidth: '100%', height: '200px', objectFit: 'contain' }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            backgroundColor: '#FF8717',
                                            color: 'white',
                                            padding: '8px 20px',
                                            borderRadius: '5px',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem'
                                        }}>
                                            End in: {formatTime(countdown.hours)} : {formatTime(countdown.minutes)} : {formatTime(countdown.seconds)}
                                        </div>
                                    </div>
                                </div>
                                <Card.Body style={{ padding: '25px' }}>
                                    {category.links.map((link, linkIndex) => (
                                        <Link
                                            key={linkIndex}
                                            to={link.url}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                textDecoration: 'none',
                                                color: '#333',
                                                padding: '10px 0',
                                                borderBottom: linkIndex < category.links.length - 1 ? '1px solid #f0f0f0' : 'none',
                                                transition: 'color 0.3s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#FF8717'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
                                        >
                                            <span style={{ fontWeight: '500' }}>{link.name}</span>
                                            <FaArrowRight style={{ fontSize: '0.8rem' }} />
                                        </Link>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default OnlineStoreSection;
