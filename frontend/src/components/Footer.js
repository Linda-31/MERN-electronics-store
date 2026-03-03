import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaArrowRight, FaArrowUp, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaCcPaypal } from 'react-icons/fa';
import { IoLocationSharp } from 'react-icons/io5';
import { MdPhoneInTalk } from 'react-icons/md';
import { Store } from '../context/StoreContext';
import Chatbot from './Chatbot';
import appStore from '../assets/app_store.png';
import googlePlay from '../assets/google_play.png';
import logoImg from '../assets/logo.png';

const Footer = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const footerLinkStyle = {
        color: '#ccc',
        textDecoration: 'none',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '8px',
        borderBottom: '1px solid #333',
        marginBottom: '15px',
        transition: 'color 0.3s'
    };

    const sectionTitleStyle = {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '18px',
        marginBottom: '30px',
        position: 'relative'
    };

    const orangeUnderlineStyle = {
        content: '""',
        display: 'block',
        width: '40px',
        height: '2px',
        backgroundColor: '#FF8717',
        marginTop: '10px'
    };

    return (
        <footer style={{ backgroundColor: '#1a1e21', color: '#fff', padding: '80px 0 0 0', fontFamily: 'Inter, sans-serif' }}>
            <Container>
                <Row className='mb-5'>
                    {/* Column 1: Logo & Info */}
                    <Col lg={3} md={6} className='mb-4 mb-lg-0'>
                        <div className='footer-logo d-flex align-items-center mb-4'>
                            <div className='logo-icon me-2' style={{ position: 'relative' }}>
                                <img
                                    src={logoImg}
                                    alt="Radios Admin Logo"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        objectFit: 'contain',
                                        marginRight: '10px'
                                    }}
                                />
                               
                            </div>
                            <div>
                                <h2 className='m-0 fw-bold' style={{ fontSize: '24px', letterSpacing: '-1px' }}>Radios</h2>
                                <p className='m-0 fw-bold' style={{ fontSize: '12px', marginTop: '-4px' }}>Electronics Store</p>
                            </div>
                        </div>
                        <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.8' }}>
                            4517 Washington Ave. Manchester, Kentucky <br />
                            39495 ashington Ave. Manchester,
                        </p>
                        <div className='d-flex align-items-center mb-3 mt-4'>
                            <div className='icon-circle me-3 d-flex align-items-center justify-content-center shadow-sm' style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FF8717' }}>
                                <IoLocationSharp size={20} />
                            </div>
                            <span style={{ fontSize: '14px', color: '#ccc' }}>254 Lillian Blvd, Holbrook</span>
                        </div>
                        <div className='d-flex align-items-center mb-4'>
                            <div className='icon-circle me-3 d-flex align-items-center justify-content-center shadow-sm' style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FF8717' }}>
                                <MdPhoneInTalk size={20} />
                            </div>
                            <span style={{ fontSize: '14px', color: '#ccc' }}>1-800-654-3210</span>
                        </div>
                        <div className='app-buttons d-flex gap-2 align-items-center mt-4'>
                            <img src={appStore} alt='App Store' style={{ height: '35px', cursor: 'pointer' }} />
                            <img src={googlePlay} alt='Google Play' style={{ height: '35px', cursor: 'pointer' }} />
                        </div>
                    </Col>

                    {/* Column 2: Find It Fast */}
                    <Col lg={3} md={6} className='mb-4 mb-lg-0'>
                        <h5 style={sectionTitleStyle}>Find It Fast <div style={orangeUnderlineStyle}></div></h5>
                        <div className='footer-links'>
                            <Link to='/shop?category=speakers' style={footerLinkStyle}>Bluetooth speaker <FaArrowRight size={12} /></Link>
                            <Link to='/shop?category=cameras' style={footerLinkStyle}>Digital camera <FaArrowRight size={12} /></Link>
                            <Link to='/shop?category=hard-drives' style={footerLinkStyle}>external hard drive <FaArrowRight size={12} /></Link>
                            <Link to='/shop?category=robotics' style={footerLinkStyle}>Robotics vacuum <FaArrowRight size={12} /></Link>
                            <Link to='/shop?category=television' style={footerLinkStyle}>Telivsion & Monitor <FaArrowRight size={12} /></Link>
                            <Link to='/shop?category=pans' style={footerLinkStyle}>Frying pan <FaArrowRight size={12} /></Link>
                        </div>
                    </Col>

                    {/* Column 3: Quick Links */}
                    <Col lg={3} md={6} className='mb-4 mb-lg-0'>
                        <h5 style={sectionTitleStyle}>Quick Links <div style={orangeUnderlineStyle}></div></h5>
                        <div className='footer-links'>
                            <Link to='/about' style={footerLinkStyle}>About Us <FaArrowRight size={12} /></Link>
                            <Link to='/orders' style={footerLinkStyle}>Order Tracking <FaArrowRight size={12} /></Link>
                            <Link to='/contact' style={footerLinkStyle}>Contact Us <FaArrowRight size={12} /></Link>
                            <Link to='/blog' style={footerLinkStyle}>Blog & News <FaArrowRight size={12} /></Link>
                            <Link to='/shop' style={footerLinkStyle}>Our Products <FaArrowRight size={12} /></Link>
                            {userInfo && userInfo.isAdmin && (
                                <Link to='/admin/dashboard' style={footerLinkStyle}>Admin Dashboard <FaArrowRight size={12} /></Link>
                            )}
                        </div>
                    </Col>

                    {/* Column 4: Service Us */}
                    <Col lg={3} md={6} className='mb-4 mb-lg-0'>
                        <h5 style={sectionTitleStyle}>Service Us <div style={orangeUnderlineStyle}></div></h5>
                        <div className='footer-links'>
                            <Link to='/terms' style={footerLinkStyle}>Term & Conditions <FaArrowRight size={12} /></Link>
                            <Link to='/shipping' style={footerLinkStyle}>Shipping <FaArrowRight size={12} /></Link>
                            <Link to='/privacy' style={footerLinkStyle}>Privacy Policy <FaArrowRight size={12} /></Link>
                            <Link to='/help' style={footerLinkStyle}>Help <FaArrowRight size={12} /></Link>
                            <Link to='/returns' style={footerLinkStyle}>Products Return <FaArrowRight size={12} /></Link>
                            <Link to='/faqs' style={footerLinkStyle}>FAQS <FaArrowRight size={12} /></Link>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Bottom Bar */}
            <div className='bottom-bar py-4 mt-5' style={{ backgroundColor: '#111', fontSize: '14px', borderTop: '1px solid #333' }}>
                <Container className='d-flex flex-wrap justify-content-between align-items-center gap-3'>
                    <div className='copyright text-muted'>
                        &copy; 2022 radios - Ecommerce Technology. All Rights Reserved.
                    </div>

                    <div className='social-icons d-flex gap-3'>
                        <div style={{ backgroundColor: '#fff', borderRadius: '50%', padding: '8px', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FaFacebookF color='#000' /></div>
                        <div style={{ backgroundColor: '#fff', borderRadius: '50%', padding: '8px', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FaTwitter color='#000' /></div>
                        <div style={{ backgroundColor: '#fff', borderRadius: '50%', padding: '8px', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FaInstagram color='#000' /></div>
                        <div style={{ backgroundColor: '#fff', borderRadius: '50%', padding: '8px', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FaLinkedinIn color='#000' /></div>
                        <div style={{ backgroundColor: '#fff', borderRadius: '50%', padding: '8px', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><FaYoutube color='#000' /></div>
                    </div>

                    <div className='payment-icons d-flex gap-2'>
                        <FaCcMastercard size={32} color='#ccc' style={{ cursor: 'pointer' }} />
                        <FaCcAmex size={32} color='#ccc' style={{ cursor: 'pointer' }} />
                        <FaCcVisa size={32} color='#ccc' style={{ cursor: 'pointer' }} />
                        <FaCcDiscover size={32} color='#ccc' style={{ cursor: 'pointer' }} />
                        <FaCcPaypal size={32} color='#ccc' style={{ cursor: 'pointer' }} />
                    </div>

                    {showScrollButton && (
                        <div
                            className='back-to-top shadow-sm d-flex align-items-center justify-content-center'
                            onClick={scrollToTop}
                            style={{ position: 'fixed', bottom: '110px', right: '40px', width: '45px', height: '45px', backgroundColor: '#333', color: '#FF8717', border: '1px solid #444', borderRadius: '50%', cursor: 'pointer', zIndex: '1000', transition: 'opacity 0.3s ease-in-out' }}
                        >
                            <FaArrowUp />
                        </div>
                    )}
                </Container>
            </div>

            <style>{`
                .footer-links a:hover {
                    color: #FF8717 !important;
                }
            `}</style>
            <Chatbot />
        </footer>
    );
};

export default Footer;

