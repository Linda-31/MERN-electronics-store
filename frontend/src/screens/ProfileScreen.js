import React, { useContext, useEffect, useReducer, useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../context/StoreContext';
import '../Style/ProfileScreen.css';

// ── icons (react-icons) ──────────────────────────────────────────────────────
import {
    FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt,
    FaCity, FaGlobe, FaCamera, FaCheckCircle, FaExclamationCircle,
    FaEye, FaEyeSlash, FaShieldAlt, FaIdCard, FaHome, FaSave,
    FaSpinner, FaSignOutAlt, FaCrown,
} from 'react-icons/fa';

// ── local reducer ─────────────────────────────────────────────────────────────
const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_REQUEST': return { ...state, loadingUpdate: true, successMsg: '', errorMsg: '' };
        case 'UPDATE_SUCCESS': return { ...state, loadingUpdate: false, successMsg: action.payload };
        case 'UPDATE_FAIL': return { ...state, loadingUpdate: false, errorMsg: action.payload };
        case 'CLEAR_MSG': return { ...state, successMsg: '', errorMsg: '' };
        default: return state;
    }
};

// ── helpers ───────────────────────────────────────────────────────────────────
const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

// ── Component ─────────────────────────────────────────────────────────────────
const ProfileScreen = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    /* ── local state ── */
    const [activeTab, setActiveTab] = useState('info');
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Personal info
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Address (maps to shippingAddress fields)
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    // Security
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);

    const [{ loadingUpdate, successMsg, errorMsg }, dispatch] = useReducer(reducer, {
        loadingUpdate: false,
        successMsg: '',
        errorMsg: '',
    });

    /* ── init from context ── */
    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }
        setName(userInfo.name || '');
        setEmail(userInfo.email || '');
        // populate address from shippingAddress if available
        const sa = userInfo.shippingAddress || {};
        setPhone(sa.phone || '');
        setAddress(sa.address || '');
        setCity(sa.city || '');
        setPostalCode(sa.postalCode || '');
        setCountry(sa.country || '');
    }, [navigate, userInfo]);

    /* ── auto-clear messages after 5 s ── */
    useEffect(() => {
        if (!successMsg && !errorMsg) return;
        const t = setTimeout(() => dispatch({ type: 'CLEAR_MSG' }), 5000);
        return () => clearTimeout(t);
    }, [successMsg, errorMsg]);

    /* ── avatar change ── */
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setAvatarPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    /* ── Save personal info + address in one call ── */
    const submitInfoHandler = async (e) => {
        e.preventDefault();
        dispatch({ type: 'UPDATE_REQUEST' });
        try {
            // 1. Update name / email on profile endpoint
            const { data } = await axios.put(
                '/api/users/profile',
                { name, email },
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            // 2. Update shipping address with phone
            await axios.post(
                '/api/users/shipping',
                {
                    ...(userInfo.shippingAddress || {}),
                    phone,
                    address,
                    city,
                    postalCode,
                    country,
                },
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            // 3. Update context & localStorage
            const updated = {
                ...data,
                shippingAddress: {
                    ...(data.shippingAddress || {}),
                    phone,
                    address,
                    city,
                    postalCode,
                    country,
                },
            };
            ctxDispatch({ type: 'USER_LOGIN', payload: updated });
            localStorage.setItem('userInfo', JSON.stringify(updated));
            dispatch({ type: 'UPDATE_SUCCESS', payload: 'Profile updated successfully!' });
        } catch (err) {
            dispatch({
                type: 'UPDATE_FAIL',
                payload: err.response?.data?.message || err.message,
            });
        }
    };

    /* ── Save password ── */
    const submitPasswordHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            dispatch({ type: 'UPDATE_FAIL', payload: 'Passwords do not match.' });
            return;
        }
        if (password.length < 6) {
            dispatch({ type: 'UPDATE_FAIL', payload: 'Password must be at least 6 characters.' });
            return;
        }
        dispatch({ type: 'UPDATE_REQUEST' });
        try {
            const { data } = await axios.put(
                '/api/users/profile',
                { name, email, password },
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            ctxDispatch({ type: 'USER_LOGIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setPassword('');
            setConfirmPassword('');
            dispatch({ type: 'UPDATE_SUCCESS', payload: 'Password changed successfully!' });
        } catch (err) {
            dispatch({
                type: 'UPDATE_FAIL',
                payload: err.response?.data?.message || err.message,
            });
        }
    };

    /* ── cart / wishlist counts from context ── */
    const cartCount = state.cart?.cartItems?.length || 0;
    const wishlistCount = state.wishlist?.wishlistItems?.length || 0;

    /* ── render ── */
    return (
        <div className="profile-page">
            {/* ── Hero Banner ── */}
            <div className="profile-hero">
                <Container>
                    <p className="profile-hero-title">Account</p>
                    <h1 className="profile-hero-name">My Profile</h1>
                </Container>
            </div>

            <Container>
                {/* ── Alert Messages ── */}
                {successMsg && (
                    <div className="profile-alert success mt-4">
                        <FaCheckCircle size={16} />
                        {successMsg}
                    </div>
                )}
                {errorMsg && (
                    <div className="profile-alert error mt-4">
                        <FaExclamationCircle size={16} />
                        {errorMsg}
                    </div>
                )}

                <Row className="g-4 align-items-start mt-0">
                    {/* ── LEFT: Avatar Card ── */}
                    <Col lg={3} md={4} xs={12}>
                        <div className="profile-avatar-card">
                            {/* Avatar */}
                            <div className="avatar-wrapper">
                                <div className="avatar-circle">
                                    {avatarPreview
                                        ? <img src={avatarPreview} alt="avatar" />
                                        : getInitials(name || userInfo?.name)
                                    }
                                </div>
                                <label
                                    className="avatar-upload-btn"
                                    htmlFor="avatarInput"
                                    title="Change photo"
                                >
                                    <FaCamera />
                                </label>
                                <input
                                    id="avatarInput"
                                    type="file"
                                    accept="image/*"
                                    className="avatar-upload-input"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                />
                            </div>

                            <p className="profile-display-name">
                                {name || userInfo?.name}
                            </p>
                            <p className="profile-display-email">
                                {email || userInfo?.email}
                            </p>

                            {/* Admin / User badge */}
                            <span className={`profile-badge ${userInfo?.isAdmin ? 'admin' : 'user'}`}>
                                {userInfo?.isAdmin
                                    ? <><FaCrown size={10} /> Administrator</>
                                    : <><FaUser size={10} /> Customer</>
                                }
                            </span>

                            {/* Stats */}
                            <div className="profile-stats">
                                <div className="profile-stat-item">
                                    <div className="profile-stat-num">{cartCount}</div>
                                    <div className="profile-stat-label">In Cart</div>
                                </div>
                                <div className="profile-stat-item">
                                    <div className="profile-stat-num">{wishlistCount}</div>
                                    <div className="profile-stat-label">Wished</div>
                                </div>
                            </div>

                            {/* Quick info rows */}
                            <div style={{ marginTop: 20 }}>
                                {phone && (
                                    <div className="profile-info-row">
                                        <div className="profile-info-icon"><FaPhone /></div>
                                        <div className="profile-info-content">
                                            <div className="profile-info-label">Phone</div>
                                            <div className="profile-info-value">{phone}</div>
                                        </div>
                                    </div>
                                )}
                                {address && (
                                    <div className="profile-info-row">
                                        <div className="profile-info-icon"><FaMapMarkerAlt /></div>
                                        <div className="profile-info-content">
                                            <div className="profile-info-label">Address</div>
                                            <div className="profile-info-value">{address}</div>
                                        </div>
                                    </div>
                                )}
                                {city && (
                                    <div className="profile-info-row">
                                        <div className="profile-info-icon"><FaCity /></div>
                                        <div className="profile-info-content">
                                            <div className="profile-info-label">City</div>
                                            <div className="profile-info-value">{city}, {postalCode}</div>
                                        </div>
                                    </div>
                                )}
                                {country && (
                                    <div className="profile-info-row">
                                        <div className="profile-info-icon"><FaGlobe /></div>
                                        <div className="profile-info-content">
                                            <div className="profile-info-label">Country</div>
                                            <div className="profile-info-value">{country}</div>
                                        </div>
                                    </div>
                                )}
                                {!phone && !address && !city && !country && (
                                    <div style={{ textAlign: 'center', color: '#bbb', fontSize: 13, padding: '12px 0' }}>
                                        No address info yet
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>

                    {/* ── RIGHT: Tabbed Card ── */}
                    <Col lg={9} md={8} xs={12}>
                        <div className="profile-main-card">
                            {/* Tab Nav */}
                            <div className="profile-tabs">
                                <button
                                    className={`profile-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('info')}
                                >
                                    <FaIdCard /> Personal Info
                                </button>
                                <button
                                    className={`profile-tab-btn ${activeTab === 'address' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('address')}
                                >
                                    <FaHome /> Address
                                </button>
                                <button
                                    className={`profile-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('security')}
                                >
                                    <FaShieldAlt /> Security
                                </button>
                            </div>

                            {/* ── TAB: Personal Info ── */}
                            {activeTab === 'info' && (
                                <div className="profile-tab-panel">
                                    <p className="profile-section-label">Personal Details</p>
                                    <form onSubmit={submitInfoHandler}>
                                        <Row className="g-3">
                                            <Col md={6}>
                                                <div className="profile-form-group">
                                                    <label htmlFor="pf-name">Full Name</label>
                                                    <div className="profile-input-icon-wrap">
                                                        <input
                                                            id="pf-name"
                                                            className="profile-input"
                                                            type="text"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            placeholder="Your full name"
                                                            required
                                                        />
                                                        <FaUser className="profile-input-icon" />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="profile-form-group">
                                                    <label htmlFor="pf-email">Email Address</label>
                                                    <div className="profile-input-icon-wrap">
                                                        <input
                                                            id="pf-email"
                                                            className="profile-input"
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            placeholder="your@email.com"
                                                            required
                                                        />
                                                        <FaEnvelope className="profile-input-icon" />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="profile-form-group">
                                                    <label htmlFor="pf-phone">Phone Number</label>
                                                    <div className="profile-input-icon-wrap">
                                                        <input
                                                            id="pf-phone"
                                                            className="profile-input"
                                                            type="tel"
                                                            value={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                            placeholder="+1 234 567 8900"
                                                        />
                                                        <FaPhone className="profile-input-icon" />
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <hr className="profile-divider" />

                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <button
                                                type="submit"
                                                className="profile-save-btn"
                                                disabled={loadingUpdate}
                                            >
                                                {loadingUpdate
                                                    ? <><span className="profile-spinner" /> Saving…</>
                                                    : <><FaSave /> Save Changes</>
                                                }
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* ── TAB: Address ── */}
                            {activeTab === 'address' && (
                                <div className="profile-tab-panel">
                                    <p className="profile-section-label">Shipping / Billing Address</p>
                                    <form onSubmit={submitInfoHandler}>
                                        <Row className="g-3">
                                            <Col xs={12}>
                                                <div className="profile-form-group">
                                                    <label htmlFor="pf-address">Street Address</label>
                                                    <div className="profile-input-icon-wrap">
                                                        <input
                                                            id="pf-address"
                                                            className="profile-input"
                                                            type="text"
                                                            value={address}
                                                            onChange={(e) => setAddress(e.target.value)}
                                                            placeholder="123 Main Street"
                                                        />
                                                        <FaMapMarkerAlt className="profile-input-icon" />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="profile-form-group">
                                                    <label htmlFor="pf-city">City</label>
                                                    <div className="profile-input-icon-wrap">
                                                        <input
                                                            id="pf-city"
                                                            className="profile-input"
                                                            type="text"
                                                            value={city}
                                                            onChange={(e) => setCity(e.target.value)}
                                                            placeholder="New York"
                                                        />
                                                        <FaCity className="profile-input-icon" />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="profile-form-group">
                                                    <label htmlFor="pf-postal">Postal / ZIP Code</label>
                                                    <div className="profile-input-icon-wrap">
                                                        <input
                                                            id="pf-postal"
                                                            className="profile-input"
                                                            type="text"
                                                            value={postalCode}
                                                            onChange={(e) => setPostalCode(e.target.value)}
                                                            placeholder="10001"
                                                        />
                                                        <FaHome className="profile-input-icon" />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="profile-form-group">
                                                    <label htmlFor="pf-country">Country</label>
                                                    <div className="profile-input-icon-wrap">
                                                        <input
                                                            id="pf-country"
                                                            className="profile-input"
                                                            type="text"
                                                            value={country}
                                                            onChange={(e) => setCountry(e.target.value)}
                                                            placeholder="United States"
                                                        />
                                                        <FaGlobe className="profile-input-icon" />
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <hr className="profile-divider" />

                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <button
                                                type="submit"
                                                className="profile-save-btn"
                                                disabled={loadingUpdate}
                                            >
                                                {loadingUpdate
                                                    ? <><span className="profile-spinner" /> Saving…</>
                                                    : <><FaSave /> Save Address</>
                                                }
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* ── TAB: Security ── */}
                            {activeTab === 'security' && (
                                <div className="profile-tab-panel">
                                    <p className="profile-section-label">Change Password</p>
                                    <form onSubmit={submitPasswordHandler}>
                                        <Row className="g-3">
                                            <Col md={6}>
                                                <div className="profile-form-group">
                                                    <label htmlFor="pf-pw">New Password</label>
                                                    <div className="profile-pw-wrap">
                                                        <input
                                                            id="pf-pw"
                                                            className="profile-input"
                                                            type={showPw ? 'text' : 'password'}
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            placeholder="Min. 6 characters"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            className="profile-pw-toggle"
                                                            onClick={() => setShowPw((v) => !v)}
                                                            tabIndex={-1}
                                                        >
                                                            {showPw ? <FaEyeSlash /> : <FaEye />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="profile-form-group">
                                                    <label htmlFor="pf-cpw">Confirm Password</label>
                                                    <div className="profile-pw-wrap">
                                                        <input
                                                            id="pf-cpw"
                                                            className="profile-input"
                                                            type={showConfirmPw ? 'text' : 'password'}
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            placeholder="Repeat new password"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            className="profile-pw-toggle"
                                                            onClick={() => setShowConfirmPw((v) => !v)}
                                                            tabIndex={-1}
                                                        >
                                                            {showConfirmPw ? <FaEyeSlash /> : <FaEye />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        {/* Password strength hints */}
                                        <div style={{
                                            background: '#f9f9f9',
                                            borderRadius: 10,
                                            padding: '14px 18px',
                                            marginBottom: 24,
                                            fontSize: 13,
                                            color: '#777',
                                            lineHeight: 1.8,
                                        }}>
                                            <strong style={{ color: '#444' }}>Password requirements:</strong>
                                            <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                                                <li style={{ color: password.length >= 6 ? '#50AD06' : '#ccc' }}>
                                                    At least 6 characters
                                                </li>
                                                <li style={{ color: /[A-Z]/.test(password) ? '#50AD06' : '#ccc' }}>
                                                    At least one uppercase letter
                                                </li>
                                                <li style={{ color: /[0-9]/.test(password) ? '#50AD06' : '#ccc' }}>
                                                    At least one number
                                                </li>
                                            </ul>
                                        </div>

                                        <hr className="profile-divider" />

                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <button
                                                type="submit"
                                                className="profile-save-btn"
                                                disabled={loadingUpdate}
                                            >
                                                {loadingUpdate
                                                    ? <><span className="profile-spinner" /> Updating…</>
                                                    : <><FaLock /> Update Password</>
                                                }
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProfileScreen;
