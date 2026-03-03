import React, { useContext, useEffect, useState } from 'react';
import { Nav, Container, Badge, NavDropdown, Form, InputGroup, Button, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from '../context/StoreContext';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaDribbble, FaRegCalendarAlt, FaChevronDown, FaSearch, FaBars } from 'react-icons/fa';
import { FiPhoneCall, FiUser, FiHeart, FiShoppingBag } from 'react-icons/fi';
import axios from 'axios';
import logoImg from '../assets/logo.png';

const Header = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (userInfo) {
                try {
                    // Fetch Wishlist
                    const { data: wishlistData } = await axios.get('/api/wishlist', {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    });
                    ctxDispatch({ type: 'WISHLIST_SET_ITEMS', payload: wishlistData });

                    // Fetch Cart
                    const { data: cartData } = await axios.get('/api/cart', {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    });
                    ctxDispatch({ type: 'CART_SET_ITEMS', payload: cartData });
                } catch (err) {
                    console.error('Error fetching persistent data:', err);
                }
            }
        };
        fetchData();
    }, [userInfo, ctxDispatch]);

    const logoutHandler = () => {
        ctxDispatch({ type: 'USER_LOGOUT' });
        localStorage.removeItem('userInfo');
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('paymentMethod');
    };

    const date = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/shop/?query=${query}` : '/shop');
    };

    return (
        <header className='header-container shadow-sm'>
            {/* Top Bar — Hidden on Mobile/Tablet < LG */}
            <div className='top-bar d-none d-lg-block' style={{ backgroundColor: '#111', color: '#fff', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                <Container className='d-flex justify-content-between align-items-stretch p-0'>
                    <div className='d-flex align-items-center'>
                        <div className='date-box px-4 py-2 d-flex align-items-center' style={{ backgroundColor: '#000' }}>
                            <FaRegCalendarAlt className='me-2' style={{ color: '#FF8717' }} />
                            {date}
                        </div>
                        <div className='social-box px-4 py-2 d-flex align-items-center gap-3' style={{ backgroundColor: '#FF8717' }}>
                            <FaFacebookF />
                            <FaTwitter />
                            <FaLinkedinIn />
                            <FaInstagram />
                            <FaDribbble />
                        </div>
                    </div>
                    <div className='d-flex align-items-center'>
                        <div className='lang-box px-4 py-2 d-flex align-items-center border-end border-secondary' style={{ cursor: 'pointer' }}>
                            ENG <FaChevronDown className='ms-2' style={{ fontSize: '10px' }} />
                        </div>
                        <div className='track-box px-4 py-2' style={{ cursor: 'pointer' }}>
                            Track Your Order
                        </div>
                    </div>
                </Container>
            </div>

            {/* Middle Bar — Responsive Grid */}
            <div className='middle-bar bg-white py-3 py-lg-4 border-bottom'>
                <Container>
                    <div className='row align-items-center'>
                        {/* Logo */}
                        <div className='col-6 col-lg-3'>
                            <LinkContainer to='/' style={{ cursor: 'pointer' }}>
                                <div className='d-flex align-items-center'>
                                    <div className='logo-icon me-2'>
                                        <img src={logoImg} alt="Radios Logo" className='img-fluid' style={{ maxWidth: '45px', borderRadius: '8px' }} />
                                    </div>
                                    <div className='d-none d-sm-block'>
                                        <h2 className='m-0 fw-bold h4' style={{ color: '#000', letterSpacing: '-1px' }}>Radios</h2>
                                        <p className='m-0 text-muted small' style={{ marginTop: '-3px' }}>Electronics Store</p>
                                    </div>
                                </div>
                            </LinkContainer>
                        </div>

                        {/* Search Bar — Hidden on very small, stacks on mobile */}
                        <div className='col-12 col-lg-6 order-3 order-lg-2 mt-3 mt-lg-0'>
                            <Form onSubmit={submitHandler}>
                                <InputGroup className='rounded-pill overflow-hidden border-2' style={{ backgroundColor: '#f8f8f8' }}>
                                    <Form.Control
                                        type="text"
                                        placeholder='Search For Product'
                                        onChange={(e) => setQuery(e.target.value)}
                                        className='border-0 bg-transparent px-4 py-2 shadow-none'
                                    />
                                    <Button type="submit" variant='dark' className='px-4' style={{ backgroundColor: '#111' }}>
                                        <FaSearch />
                                    </Button>
                                </InputGroup>
                            </Form>
                        </div>

                        {/* Support & Actions — Icons on Mobile */}
                        <div className='col-6 col-lg-3 order-2 order-lg-3 d-flex justify-content-end align-items-center'>
                            <div className='d-none d-xl-flex align-items-center'>
                                <div className='icon-circle me-3 d-flex align-items-center justify-content-center' style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#000', color: '#fff' }}>
                                    <FiPhoneCall size={18} />
                                </div>
                                <div className='text-end'>
                                    <p className='m-0 fw-bold small text-nowrap'>(+800) 856 800</p>
                                    <p className='m-0 text-muted extra-small'>info@Radios.com</p>
                                </div>
                            </div>

                            {/* Mobile Burger & Quick Actions could go here, but for now let's use the bottom bar */}
                        </div>
                    </div>
                </Container>
            </div>

            {/* Bottom Nav Bar — Floating on Desktop, Solid on Mobile */}
            <Navbar expand="lg" className='bottom-bar p-0' sticky="top">
                <Container>
                    <div className='w-100 d-flex justify-content-between align-items-center bg-white shadow-sm px-3 py-2 my-2 my-lg-0' style={{ borderRadius: '15px', borderBottom: '4px solid #FF8717' }}>

                        {/* Hamburger toggle for mobile */}
                        <Navbar.Toggle aria-controls="basic-navbar-nav" className='border-0 p-0 shadow-none'>
                            <div className='icon-btn d-flex align-items-center justify-content-center' style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f0f0f0' }}>
                                <FaBars />
                            </div>
                        </Navbar.Toggle>

                        {/* Nav Links */}
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className='me-auto gap-lg-4 py-3 py-lg-0'>
                                <LinkContainer to='/'><Nav.Link className='fw-bold text-dark'>Home</Nav.Link></LinkContainer>
                                <LinkContainer to='/shop'><Nav.Link className='fw-bold text-dark'>Shop</Nav.Link></LinkContainer>
                                <LinkContainer to='/blog'><Nav.Link className='fw-bold text-dark'>Blog</Nav.Link></LinkContainer>
                                <LinkContainer to='/about'><Nav.Link className='fw-bold text-dark'>About</Nav.Link></LinkContainer>
                                <LinkContainer to='/contact'><Nav.Link className='fw-bold text-dark'>Contact</Nav.Link></LinkContainer>
                            </Nav>
                        </Navbar.Collapse>

                        {/* Utility Icons (Always Visible) */}
                        <div className='d-flex align-items-center gap-2 gap-sm-3 ms-auto'>
                            {/* Account */}
                            {userInfo ? (
                                <NavDropdown
                                    title={<div className='icon-btn d-flex align-items-center justify-content-center shadow-sm' style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#f0f0f0' }}>
                                        <FiUser size={18} className='text-dark' />
                                    </div>}
                                    id='username'
                                    className='no-chevron'
                                    align="end"
                                >
                                    <LinkContainer to='/profile'><NavDropdown.Item>Profile</NavDropdown.Item></LinkContainer>
                                    {userInfo.isAdmin && (<LinkContainer to='/admin/dashboard'><NavDropdown.Item>Admin</NavDropdown.Item></LinkContainer>)}
                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to='/login'>
                                    <div className='icon-btn d-flex align-items-center justify-content-center shadow-sm' style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#f0f0f0', cursor: 'pointer' }}>
                                        <FiUser size={18} className='text-dark' />
                                    </div>
                                </LinkContainer>
                            )}

                            {/* Wishlist */}
                            <LinkContainer to='/wishlist'>
                                <div className='icon-btn position-relative d-flex align-items-center justify-content-center shadow-sm' style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#f0f0f0', cursor: 'pointer' }}>
                                    <FiHeart size={18} className='text-dark' />
                                    <Badge pill className='position-absolute top-0 start-100 translate-middle custom-badge' style={{ fontSize: '10px' }}>
                                        {state.wishlist.wishlistItems.length}
                                    </Badge>
                                </div>
                            </LinkContainer>

                            {/* Cart */}
                            <LinkContainer to='/cart'>
                                <div className='icon-btn position-relative d-flex align-items-center justify-content-center shadow-sm' style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#f0f0f0', cursor: 'pointer' }}>
                                    <FiShoppingBag size={18} className='text-dark' />
                                    {cart.cartItems.length > 0 && (
                                        <Badge pill className='position-absolute top-0 start-100 translate-middle custom-badge' style={{ fontSize: '10px' }}>
                                            {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                                        </Badge>
                                    )}
                                </div>
                            </LinkContainer>
                        </div>
                    </div>
                </Container>
            </Navbar>

            {/* Responsive Styles */}
            <style>{`
                .extra-small { font-size: 11px; }
                .no-chevron .dropdown-toggle::after { display: none !important; }
                .nav-link:hover, .nav-link.active { color: #FF8717 !important; }
                .custom-badge { background-color: #FF8717 !important; color: #fff !important; }
                
                .icon-btn { transition: all 0.3s ease; }
                .icon-btn:hover, .dropdown.show .icon-btn {
                    background-color: #FF8717 !important;
                }
                .icon-btn:hover svg, .dropdown.show .icon-btn svg {
                    color: #fff !important;
                }
                .dropdown-item:hover,
                .dropdown-item:focus,
                .dropdown-item.active {
                    background-color: #FF8717 !important;
                    color: #fff !important;
                }

                /* Force Dropdown Menu to Right Side */
                .dropdown-menu {
                    left: 0 !important;
                    right: auto !important;
                    min-width: 180px;
                    border: none;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                    border-radius: 12px;
                    margin-top: 10px !important;
                }

                @media (max-width: 991.98px) {
                    .bottom-bar { position: relative !important; margin-top: 0 !important; }
                    .navbar-collapse {
                        background: #fff;
                        position: absolute;
                        top: 55px;
                        left: 0;
                        width: 100%;
                        padding: 15px;
                        border-radius: 12px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                        z-index: 9999;
                    }
                }
            `}</style>
        </header>
    );
};

export default Header;
