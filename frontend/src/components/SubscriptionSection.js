import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import axios from 'axios';

const SubscriptionSection = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            await axios.post('/api/subscribers', { email });
            toast.success('Successfully subscribed to our newsletter!');
            setEmail('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <section style={{
            backgroundColor: '#FF6B35',
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8717 100%)',
            padding: '50px 0',
            marginTop: '0'
        }}>
            <Container>
                <Row className='align-items-center'>
                    <Col lg={6} md={12} className='mb-3 mb-lg-0'>
                        <h2 style={{
                            color: '#fff',
                            fontSize: '32px',
                            fontWeight: 'bold',
                            marginBottom: '10px',
                            fontFamily: 'Inter, sans-serif'
                        }}>
                            We Are Ready To Help
                        </h2>
                        <p style={{
                            color: '#fff',
                            fontSize: '16px',
                            marginBottom: '0',
                            opacity: '0.95'
                        }}>
                            For information Consult with our expert members
                        </p>
                    </Col>

                    <Col lg={6} md={12}>
                        <Form onSubmit={handleSubscribe} className='d-flex'>
                            <Form.Control
                                type='email'
                                placeholder='Enter your Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    padding: '15px 20px',
                                    fontSize: '15px',
                                    border: 'none',
                                    borderRadius: '4px 0 0 4px',
                                    outline: 'none',
                                    flex: 1
                                }}
                            />
                            <Button
                                type='submit'
                                style={{
                                    backgroundColor: '#1a1e21',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '15px 40px',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    borderRadius: '0 4px 4px 0',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#000'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#1a1e21'}
                            >
                                SUBSCRIBE
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default SubscriptionSection;
