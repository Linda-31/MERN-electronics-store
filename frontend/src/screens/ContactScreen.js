import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ContactScreen = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        website: '',
        message: '',
        saveInfo: false
    });
    const [loading, setLoading] = useState(false);

    const { name, email, phone, website, message, saveInfo } = formData;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!name || !email || !phone || !message) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        // Phone validation (basic)
        if (phone.length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }

        setLoading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const { data } = await axios.post('/api/contacts', {
                name,
                email,
                phone,
                website,
                message
            }, config);

            toast.success('Message sent successfully! We will get back to you soon.');

            // Save to localStorage if checkbox is checked
            if (saveInfo) {
                localStorage.setItem('contactInfo', JSON.stringify({
                    name,
                    email,
                    website
                }));
            }

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                website: '',
                message: '',
                saveInfo: false
            });

        } catch (error) {
            toast.error(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : 'Failed to send message. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Load saved info from localStorage on component mount
    React.useEffect(() => {
        const savedInfo = localStorage.getItem('contactInfo');
        if (savedInfo) {
            const { name: savedName, email: savedEmail, website: savedWebsite } = JSON.parse(savedInfo);
            setFormData(prev => ({
                ...prev,
                name: savedName || '',
                email: savedEmail || '',
                website: savedWebsite || ''
            }));
        }
    }, []);

    return (
        <div className="contact-screen">
            <style>{`
                .breadcrumb-area {
                    background-color: #f8f9fa;
                    padding: 30px 0;
                    margin-bottom: 0px;
                }
                .radios-breadcrumb ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    display: flex;
                    margin-left: 70px;
                    align-items: center;
                }
                .radiosbcrumb-item {
                    font-size: 14px;
                  
                }
                .radiosbcrumb-item a {
                    color: #111;
                    text-decoration: none;
                    font-weight: 500;
                   
                }
                .radiosbcrumb-item:not(:last-child)::after {
                    content: "/";
                    margin: 0 15px;
                    color: #666;
                }
                .radiosbcrumb-item.active {
                    color: #FF8717;
                    font-weight: 500;
                }
            `}</style>

            {/* Breadcrumb Section */}
            <section className="breadcrumb-area">
                <Container fluid className="px-md-5 px-3">
                    <div className="radios-breadcrumb">
                        <ul>
                            <li className="radiosbcrumb-item"><Link to="/">Home</Link></li>
                            <li className="radiosbcrumb-item active">Contact</li>
                        </ul>
                    </div>
                </Container>
            </section>

            {/* Contact Info Boxes */}
            <section className="contact-info py-5">
                <Container fluid className="px-md-5 px-3">
                    <Row>
                        <Col md={3} className="mb-4">
                            <div className="contact-info-item text-center p-4 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                                <div className="icon mb-3">
                                    <img src="https://themexriver.com/wp/radios/wp-content/uploads/2022/09/mail.svg" alt="Mail" width="40" />
                                </div>
                                <h3>Mail address</h3>
                                <p className="mb-0">viando.info@gmail.com</p>
                                <p>+998757478492</p>
                            </div>
                        </Col>
                        <Col md={3} className="mb-4">
                            <div className="contact-info-item text-center p-4 shadow-sm h-100 active" style={{ borderRadius: '15px', backgroundColor: '#FF8717', color: '#fff' }}>
                                <div className="icon mb-3">
                                    <img src="https://themexriver.com/wp/radios/wp-content/uploads/2022/09/location.svg" alt="Location" width="40" style={{ filter: 'brightness(0) invert(1)' }} />
                                </div>
                                <h3 className="text-white">Office Location</h3>
                                <p className="mb-0 text-white">4517 Washington Ave. Manchester, Kentucky 39495</p>
                            </div>
                        </Col>
                        <Col md={3} className="mb-4">
                            <div className="contact-info-item text-center p-4 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                                <div className="icon mb-3">
                                    <img src="https://themexriver.com/wp/radios/wp-content/uploads/2022/09/call-2.svg" alt="Phone" width="40" />
                                </div>
                                <h3>Phone Number</h3>
                                <p className="mb-0">+405 - 555 - 0128 - 34</p>
                                <p>+405 - 555 - 0128 - 63</p>
                            </div>
                        </Col>
                        <Col md={3} className="mb-4">
                            <div className="contact-info-item text-center p-4 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                                <div className="icon mb-3">
                                    <img src="https://themexriver.com/wp/radios/wp-content/uploads/2022/09/c_us.svg" alt="Contact" width="40" />
                                </div>
                                <h3>Contact Us</h3>
                                <p className="mb-0">radios.info@gmail.com</p>
                                <p>radios.support@gmail.com</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Contact Form & Image Section */}
            <section className="contact-form-section py-5">
                <Container fluid className="px-md-5 px-3">
                    <Row className="align-items-center">
                        <Col lg={5} className="mb-5 mb-lg-0">
                            <img
                                src="https://themexriver.com/wp/radios/wp-content/uploads/2022/09/img_01.jpg"
                                alt="Contact"
                                className="img-fluid"
                                style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            />
                        </Col>
                        <Col lg={7}>
                            <div className="contact-form-wrap ps-lg-5">
                                <h2 className="mb-4 fw-bold">Send us a message</h2>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={name}
                                                onChange={handleChange}
                                                placeholder="Enter your name*"
                                                style={{ borderRadius: '10px', padding: '15px' }}
                                                required
                                            />
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={email}
                                                onChange={handleChange}
                                                placeholder="Enter your mail*"
                                                style={{ borderRadius: '10px', padding: '15px' }}
                                                required
                                            />
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={phone}
                                                onChange={handleChange}
                                                placeholder="Enter your number*"
                                                style={{ borderRadius: '10px', padding: '15px' }}
                                                required
                                            />
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <Form.Control
                                                type="text"
                                                name="website"
                                                value={website}
                                                onChange={handleChange}
                                                placeholder="Website Link"
                                                style={{ borderRadius: '10px', padding: '15px' }}
                                            />
                                        </Col>
                                        <Col md={12} className="mb-4">
                                            <Form.Control
                                                as="textarea"
                                                rows={6}
                                                name="message"
                                                value={message}
                                                onChange={handleChange}
                                                placeholder="Enter your Message*"
                                                style={{ borderRadius: '10px', padding: '15px' }}
                                                required
                                            />
                                        </Col>
                                        <Col md={12} className="mb-4">
                                            <Form.Check
                                                type="checkbox"
                                                name="saveInfo"
                                                checked={saveInfo}
                                                onChange={handleChange}
                                                label="Save my name, email, and website in this browser for the next time I comment."
                                                style={{ color: '#666' }}
                                            />
                                        </Col>
                                        <Col md={12}>
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                size="lg"
                                                disabled={loading}
                                                style={{
                                                    backgroundColor: '#FF8717',
                                                    borderColor: '#FF8717',
                                                    borderRadius: '30px',
                                                    padding: '12px 40px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {loading ? 'Sending...' : 'Send Message'} <i className="fas fa-long-arrow-right ms-2"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Video & FAQ Section */}
            <section className="faq-video-section py-5" style={{ backgroundColor: '#f9f9f9' }}>
                <Container fluid className="px-md-5 px-3">
                    <Row>
                        <Col lg={4} className="mb-5 mb-lg-0">
                            <div className="position-relative">
                                <img
                                    src="https://themexriver.com/wp/radios/wp-content/uploads/2022/09/img_16.jpg"
                                    alt="Video Thumbnail"
                                    className="img-fluid"
                                    style={{ borderRadius: '20px' }}
                                />

                            </div>
                            <div className="mt-4">
                                <img
                                    src="https://themexriver.com/wp/radios/wp-content/uploads/2022/09/img_18.jpg"
                                    alt="Additional"
                                    className="img-fluid"
                                    style={{ borderRadius: '20px' }}
                                />
                            </div>
                        </Col>
                        <Col lg={8} className="ps-lg-5">
                            <h3 className="mb-4 fw-bold">Let our investment management team</h3>
                            <p className="text-muted mb-4">
                                We have covered many special events such as fireworks, fairs, parades, races, walks, awards ceremonies, experience the healing warmth of the ever-present sunshine,” says Ian Kerr, managing director. The white- beaches and tropical foliage in the heart of Negril is designed to provide a truly serene, intimate, and fashion shows, sport events, and even a memorial service.
                            </p>
                            <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0" className="mb-3 border-0 shadow-sm" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                    <Accordion.Header>01. What made you look up this word?</Accordion.Header>
                                    <Accordion.Body>
                                        events such as fireworks, fairs, parades, races, walks awards ceremonies, tsto experience s, parades races, walks, awards ceremonies, tsto ex
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1" className="mb-3 border-0 shadow-sm" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                    <Accordion.Header>02. What made you look up this word?</Accordion.Header>
                                    <Accordion.Body>
                                        events such as fireworks, fairs, parades, races, walks awards ceremonies, tsto experience s, parades races, walks, awards ceremonies, tsto ex
                                    </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="2" className="mb-3 border-0 shadow-sm" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                    <Accordion.Header>03. What made you look up this word?</Accordion.Header>
                                    <Accordion.Body>
                                        events such as fireworks, fairs, parades, races, walks awards ceremonies, tsto experience s, parades races, walks, awards ceremonies, tsto ex
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default ContactScreen;
