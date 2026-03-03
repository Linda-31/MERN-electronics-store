import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import themeforest from '../assets/themeforest.png';
import envato from '../assets/envato.png';


const BrandSection = () => {
    const brands = [
        { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png' },
        { name: 'Themeforest', logo: themeforest },
        { name: 'Slack', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png' },
        { name: 'Envato', logo: envato },
        { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png' },
    ];

    return (
        <section style={{ padding: '40px 0' }}>
            <Container>
                <div style={{
                    border: '1px solid #eee',
                    borderRadius: '5px',
                    padding: '30px 20px',
                    backgroundColor: '#fff'
                }}>
                    <Row className="align-items-center justify-content-center text-center">
                        {brands.map((brand, index) => (
                            <Col key={index} xs={6} md={4} lg={2} className="mb-3 mb-lg-0">
                                <div style={{
                                    padding: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '60px'
                                }}>
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '40px',
                                           
                                            cursor: 'pointer'
                                        }}
                                        
                                    />
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>
        </section>
    );
};

export default BrandSection;
