import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Product from './Product';

const DealsSection = ({ products }) => {
    // In a real app, we might filter by 'deal' tag or similar.
    // For now, just take the first 4 products.
    const dealProducts = products ? products.slice(0, 4) : [];

    return (
        <div className="deals-section" style={{ padding: '40px 0', backgroundColor: '#f4f4f4' }}>
            <Container>
                
                 <div className="text-center mb-4">
                    <div style={{ color: '#FF8717', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '10px' }}>
                      Go to Daily Deals
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '40px' }}>
                       Trending Products
                    </h2>
                </div>

                <Row>
                    {dealProducts.map((product) => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default DealsSection;
