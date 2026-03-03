import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import helmetImg from '../assets/headset.png';
import headsetImg from '../assets/gamepad.png';

const PromoBannerSection = () => {
    const promos = [
        {
            title: 'BEST GAME',
            heading: 'DEVCIES',
            description: 'Travel up to 22km in a single ',
            bgColor: 'linear-gradient(135deg, #1a1a2e 0%, #4a1942 100%)',
            image: helmetImg,
            buttonText: 'BUY NOW',
            buttonBg: '#fff',
            buttonColor: '#333',
        },
        {
            title: 'BEST GAME',
            heading: 'DEVCIES',
            description: 'Travel up to 22km in a single charge',
            bgColor: 'linear-gradient(135deg, #d4d4d4 0%, #e8e8e8 100%)',
            image: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/product-2.png',
            buttonText: 'BUY NOW',
            buttonBg: '#fff',
            buttonColor: '#333',
        },
        {
            title: 'BEST GAME',
            heading: 'DEVCIES',
            description: 'Travel up to 22km in a single ',
            bgColor: 'linear-gradient(135deg, #FF8717 0%, #FFB347 100%)',
            image: headsetImg,
            buttonText: 'BUY NOW',
            buttonBg: '#fff',
            buttonColor: '#333',
        }
    ];

    return (
        <div style={{ padding: '40px 0', backgroundColor: '#fff' }}>
            <Container>
                <Row className="g-3">
                    {promos.map((promo, index) => (
                        <Col key={index} lg={4} md={6} sm={12}>
                            <div
                                style={{
                                    background: promo.bgColor,
                                    borderRadius: '15px',
                                    padding: '40px 30px',
                                    minHeight: '250px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    color: index === 1 ? '#333' : '#fff',
                                }}
                            >
                                <div style={{ position: 'relative', zIndex: 2 }}>
                                    <div
                                        style={{
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            letterSpacing: '1px',
                                            marginBottom: '10px',
                                            opacity: 0.9,
                                        }}
                                    >
                                        {promo.title}
                                    </div>
                                    <h2
                                        style={{
                                            fontSize: '2.5rem',
                                            fontWeight: 'bold',
                                            marginBottom: '10px',
                                            lineHeight: '1',
                                        }}
                                    >
                                        {promo.heading}
                                    </h2>
                                    <p
                                        style={{
                                            fontSize: '0.9rem',
                                            marginBottom: '20px',
                                            opacity: 0.9,
                                        }}
                                    >
                                        {promo.description}
                                    </p>
                                    <Link to="/shop">
                                        <Button
                                            style={{
                                                backgroundColor: promo.buttonBg,
                                                color: promo.buttonColor,
                                                border: 'none',
                                                padding: '10px 30px',
                                                borderRadius: '25px',
                                                fontWeight: 'bold',
                                                fontSize: '0.85rem',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            {promo.buttonText}
                                        </Button>
                                    </Link>
                                </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: '-20px',
                                        bottom: '-20px',
                                        width: '60%',
                                        height: '80%',
                                        backgroundImage: `url(${promo.image})`,
                                        backgroundSize: 'contain',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'bottom right',
                                        opacity: 0.9,
                                        zIndex: 1,
                                    }}
                                />
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default PromoBannerSection;
