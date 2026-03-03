import React from 'react';
import { Container, Row, Col, Tab, Nav, ListGroup } from 'react-bootstrap';
import { FaPlay, FaCheck } from 'react-icons/fa';

const AboutScreen = () => {
    return (
        <div className="about-page">
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
                    align-items: center;
                }
                .radiosbcrumb-item {
                    font-size: 14px;
                }
                .radiosbcrumb-item a {
                    color: #111 !important;
                    text-decoration: none !important;
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
                <Container>
                    <div className="radios-breadcrumb">
                        <ul>
                            <li className="radiosbcrumb-item"><a href="/">Home</a></li>
                            <li className="radiosbcrumb-item active">About</li>
                        </ul>
                    </div>
                </Container>
            </section>

            {/* Section 1: More Than 25+ Years */}
            <section className="py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-4 mb-lg-0">
                            <img
                                src="https://themexriver.com/wp/radios/wp-content/uploads/2022/09/img_01-1.jpg"
                                alt="About Radios"
                                className="img-fluid rounded shadow-sm"
                            />
                        </Col>
                        <Col lg={6}>
                            <h2 className="fw-bold mb-3" style={{ fontSize: '36px' }}>
                                More Than 25+ Years We Provide True News
                            </h2>
                            <p className="text-muted mb-4">
                                Meet my startup design agency Shape Rex Currently I am working CodeNext as Product Designer. elit. Placeat qui ducimus
                            </p>
                            <Row className="mb-4">
                                <Col sm={6} className="mb-3">
                                    <div className="d-flex align-items-start">
                                        <div className="me-3 p-2 rounded-circle" style={{ backgroundColor: '#fff4e6' }}>
                                            <img src="https://themexriver.com/wp/radios/wp-content/uploads/2022/09/about_01.svg" alt="" style={{ width: '24px' }} />
                                        </div>
                                        <div>
                                            <h5 className="mb-1">Media Marketing</h5>
                                            <p className="small text-muted mb-0">Lorem ipsum, or lipsum as sometimes known, is</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <div className="d-flex align-items-start">
                                        <div className="me-3 p-2 rounded-circle" style={{ backgroundColor: '#fff4e6' }}>
                                            <img src="https://themexriver.com/wp/radios/wp-content/uploads/2022/09/about_01.svg" alt="" style={{ width: '24px' }} />
                                        </div>
                                        <div>
                                            <h5 className="mb-1">Media Marketing</h5>
                                            <p className="small text-muted mb-0">Lorem ipsum, or lipsum as sometimes known, is</p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <ListGroup variant="flush" className="border-0">
                                <ListGroup.Item className="border-0 px-0 py-1 text-muted d-flex align-items-center">
                                    <FaCheck className="me-2 text-warning" /> Lorem Ipsum generators on the tend to repeat.
                                </ListGroup.Item>
                                <ListGroup.Item className="border-0 px-0 py-1 text-muted d-flex align-items-center">
                                    <FaCheck className="me-2 text-warning" /> If you are going to use a passage.
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Section 2: Digital Marketing */}
            <section className="py-5 bg-light">
                <Container>
                    <Row className="mb-5">
                        <Col lg={8}>
                            <h2 className="fw-bold">Digital Marketing</h2>
                            <p className="text-muted">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat qui ducimus illum perspiciatis accusamus soluta perferendis, ad illum, nesciunt, reiciendis iusto et Repudiandae provident to consectetur, sapiente, libero iure necessitatibus cor voluptate, quisquam aut perspiciatis?
                            </p>
                        </Col>
                        <Col lg={4} className="text-lg-end">
                            <img
                                src="https://themexriver.com/wp/radios/wp-content/uploads/2022/09/img_03-1.jpg"
                                alt=""
                                className="img-fluid rounded shadow-sm"
                                style={{ maxHeight: '200px' }}
                            />
                        </Col>
                    </Row>
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-4 mb-lg-0">
                            <div className="position-relative">
                                <img
                                    src="https://themexriver.com/wp/radios/wp-content/uploads/2022/09/img_02-1.jpg"
                                    alt="Video Thumbnail"
                                    className="img-fluid rounded shadow"
                                />
                                <a
                                    href="https://www.youtube.com/watch?v=E9zaDk25fN0"
                                    className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center bg-white rounded-circle shadow"
                                    style={{ width: '60px', height: '60px', color: '#FF8717' }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaPlay />
                                </a>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <h3 className="fw-bold mb-3">Why Marketing Important?</h3>
                            <p className="text-muted mb-4">
                                Lorem ipsum dolor sit amet, consectetur sed do eiusmod tempor incididunt ut
                            </p>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="bg-transparent border-0 px-0 py-2 text-muted d-flex align-items-center">
                                    <FaCheck className="me-2 text-warning" /> Research beyond the business pla
                                </ListGroup.Item>
                                <ListGroup.Item className="bg-transparent border-0 px-0 py-2 text-muted d-flex align-items-center">
                                    <FaCheck className="me-2 text-warning" /> Marketing options and rates
                                </ListGroup.Item>
                                <ListGroup.Item className="bg-transparent border-0 px-0 py-2 text-muted d-flex align-items-center">
                                    <FaCheck className="me-2 text-warning" /> The ability to turnaround consulting
                                </ListGroup.Item>
                                <ListGroup.Item className="bg-transparent border-0 px-0 py-2 text-muted d-flex align-items-center">
                                    <FaCheck className="me-2 text-warning" /> Customer engagement matters
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Section 3: Analytics Helping Face Challenges */}
            <section className="py-5" style={{ backgroundColor: '#F5F5F5' }}>
                <Container>
                    <Row className="align-items-center">
                        <Col xl={4} lg={5} className="mb-4 mb-lg-0">
                            <div className="about-info-box p-4" style={{ backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                <div className="mb-4 border-bottom pb-3" style={{ borderColor: '#e0e0e0' }}>
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="h4 fw-bold me-3" style={{ color: '#FF8717' }}>01</span>
                                        <h5 className="mb-0" style={{ color: '#333' }}>Highest Success Rates</h5>
                                    </div>
                                    <p className="small text-muted mb-0">Lorem ipsum, or lipsum as it is some known, is dummy text used in</p>
                                </div>
                                <div className="mb-4 border-bottom pb-3" style={{ borderColor: '#e0e0e0' }}>
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="h4 fw-bold me-3" style={{ color: '#FF8717' }}>02</span>
                                        <h5 className="mb-0" style={{ color: '#333' }}>Effective Team Work</h5>
                                    </div>
                                    <p className="small text-muted mb-0">Lorem ipsum, or lipsum as it is some known, is dummy text used in</p>
                                </div>
                                <div>
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="h4 fw-bold me-3" style={{ color: '#FF8717' }}>03</span>
                                        <h5 className="mb-0" style={{ color: '#333' }}>We Grow Business</h5>
                                    </div>
                                    <p className="small text-muted mb-0">Lorem ipsum, or lipsum as it is some known, is dummy text used in</p>
                                </div>
                            </div>
                        </Col>
                        <Col xl={8} lg={7} className="ps-lg-5">
                            <h2 className="fw-bold mb-4" style={{ color: '#333' }}>How Analytics Helping Face Challenges</h2>
                            <p className="mb-4 text-muted">
                                "Analysis of the current business model, assessment of the company's competitiveness and market position, financial condition, as well as all possible"
                            </p>

                            <Tab.Container defaultActiveKey="about">
                                <Nav variant="tabs" className="mb-4" style={{ borderBottom: '1px solid #e0e0e0' }}>
                                    <Nav.Item>
                                        <Nav.Link
                                            eventKey="about"
                                            style={{
                                                backgroundColor: '#FF8717',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px 4px 0 0',
                                                padding: '12px 24px',
                                                marginRight: '5px'
                                            }}
                                        >
                                            About Us
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link
                                            eventKey="objective"
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: '#666',
                                                border: 'none',
                                                padding: '12px 24px',
                                                marginRight: '5px'
                                            }}
                                        >
                                            Objective
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link
                                            eventKey="excellent"
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: '#666',
                                                border: 'none',
                                                padding: '12px 24px'
                                            }}
                                        >
                                            Excellent
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content>
                                    <Tab.Pane eventKey="about">
                                        <ListGroup variant="flush" className="bg-transparent">
                                            <ListGroup.Item className="bg-transparent border-0 py-2 px-0 d-flex align-items-center" style={{ color: '#666' }}>
                                                <FaCheck className="me-3" style={{ color: '#FF8717' }} /> Lorem Ipsum generators on the tend to repeat.
                                            </ListGroup.Item>
                                            <ListGroup.Item className="bg-transparent border-0 py-2 px-0 d-flex align-items-center" style={{ color: '#666' }}>
                                                <FaCheck className="me-3" style={{ color: '#FF8717' }} /> If you are going to use a passage.
                                            </ListGroup.Item>
                                            <ListGroup.Item className="bg-transparent border-0 py-2 px-0 d-flex align-items-center" style={{ color: '#666' }}>
                                                <FaCheck className="me-3" style={{ color: '#FF8717' }} /> Lorem Ipsum generators on the tend to repeat.
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="objective">
                                        <p className="text-muted">Our objective is to deliver high-quality electronics with a focus on customer satisfaction and technological advancement.</p>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="excellent">
                                        <p className="text-muted">We strive for excellence in every product we sell and every service we provide to ourvalued customers.</p>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default AboutScreen;
