import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { Store } from '../../context/StoreContext';
import { FaBox, FaClipboardList, FaUsers, FaChartLine, FaCog, FaEnvelope, FaSearch, FaBell, FaChevronDown, FaPaperPlane, FaFileAlt, FaBars, FaTimes } from 'react-icons/fa';
import { NavDropdown } from 'react-bootstrap';
import logoImg from '../../assets/logo.png';

const AdminDashboardScreen = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const logoutHandler = () => {
        ctxDispatch({ type: 'USER_LOGOUT' });
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const styles = {
        container: {
            display: 'flex',
            minHeight: '100vh',
            fontFamily: "'Inter', sans-serif",
            backgroundColor: '#f8f9fa',
        },
        sidebar: {
            width: '260px',
            backgroundColor: '#0b1a20',
            color: '#fff',
            padding: '20px',
            flexShrink: 0,
            position: 'fixed',
            height: '100vh',
            left: 0,
            top: 0,
            zIndex: 1000,
        },
        main: {
            flex: 1,
            marginLeft: '260px',
            display: 'flex',
            flexDirection: 'column',
            transition: 'margin-left 0.3s ease',
        },
        topBar: {
            height: '70px',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            borderBottom: '1px solid #e5e7eb',
            position: 'sticky',
            top: 0,
            zIndex: 900,
        },
        searchContainer: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f9fafb',
            padding: '8px 15px',
            borderRadius: '10px',
            maxWidth: '300px',
            width: '100%',
            border: '1px solid #f3f4f6',
        },
        searchInput: {
            border: 'none',
            backgroundColor: 'transparent',
            outline: 'none',
            marginLeft: '10px',
            fontSize: '14px',
            width: '100%',
            color: '#374151',
        },
        content: {
            padding: '30px',
            flex: 1,
        },
        logo: {
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        },
        navItem: {
            display: 'flex',
            alignItems: 'center',
            padding: '12px 15px',
            color: '#9ca3af',
            textDecoration: 'none',
            borderRadius: '8px',
            marginBottom: '5px',
            transition: 'all 0.2s',
            fontSize: '14px',
        },
        navItemActive: {
            backgroundColor: '#1f2e35',
            color: '#fff',
        },
        profileSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
        },
        userAvatar: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        },
        userName: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
        },
        sidebarOverlay: {
            display: isSidebarOpen ? 'block' : 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 950,
        }
    };

    const NavLink = ({ to, icon, label }) => {
        const active = location.pathname === to;
        return (
            <Link to={to} style={{ ...styles.navItem, ...(active ? styles.navItemActive : {}) }}>
                <span style={{ marginRight: '12px' }}>{icon}</span>
                {label}
            </Link>
        );
    };

    return (
        <div style={styles.container}>
            {/* Sidebar Overlay for Mobile */}
            <div style={styles.sidebarOverlay} onClick={() => setIsSidebarOpen(false)}></div>

            {/* Sidebar */}
            <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`} style={styles.sidebar}>
                <div style={styles.logo}>
                    <img
                        src={logoImg}
                        alt="Radios Admin Logo"
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '8px',
                            objectFit: 'contain',
                            marginRight: '10px'
                        }}
                    />

                    <span>Radios Admin</span>
                    <FaTimes
                        className="d-lg-none"
                        style={{ marginLeft: 'auto', cursor: 'pointer' }}
                        onClick={() => setIsSidebarOpen(false)}
                    />
                </div>

                <div className="nav-links-container">
                    <NavLink to="/admin/dashboard" icon={<FaChartLine />} label="Dashboard" />
                    <NavLink to="/admin/userlist" icon={<FaUsers />} label="Users" />
                    <NavLink to="/admin/productlist" icon={<FaBox />} label="Products" />
                    <NavLink to="/admin/orderlist" icon={<FaClipboardList />} label="Orders" />
                    <NavLink to="/admin/contactlist" icon={<FaEnvelope />} label="Messages" />
                    <NavLink to="/admin/subscriberlist" icon={<FaPaperPlane />} label="Subscribers" />
                    <NavLink to="/admin/bloglist" icon={<FaFileAlt />} label="Blogs" />
                </div>

                <div className="sidebar-footer">
                    <NavLink to="/profile" icon={<FaCog />} label="Settings" />
                </div>
            </div>

            {/* Main Wrapper */}
            <div className="admin-main-wrapper" style={styles.main}>
                {/* Top Navigation */}
                <div style={styles.topBar}>
                    <div className="d-flex align-items-center gap-3 w-100 mw-300">
                        <div
                            className="d-lg-none"
                            style={{ cursor: 'pointer', fontSize: '20px' }}
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <FaBars />
                        </div>
                        <div style={styles.searchContainer} className="d-none d-sm-flex">
                            <FaSearch color="#9ca3af" size={14} />
                            <input type="text" placeholder="Search Anything..." style={styles.searchInput} />
                        </div>
                    </div>

                    <div style={styles.profileSection}>
                        <div style={{ padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '8px', cursor: 'pointer', color: '#6b7280' }} className="d-none d-sm-block">
                            <FaBell size={18} />
                        </div>

                        <NavDropdown
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={styles.userAvatar}>
                                        <img
                                            src={userInfo?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Farhan"}
                                            alt="avatar"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <span style={styles.userName}>
                                        {userInfo?.name} <FaChevronDown size={10} />
                                    </span>
                                </div>
                            }
                            id="admin-profile-dropdown"
                            className="admin-dropdown"
                        >

                            <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </div>
                </div>

                {/* Page Content */}
                <div style={styles.content} className="admin-content">
                    <Outlet />
                </div>
            </div>

            <style>{`
                .admin-sidebar {
                    transition: left 0.3s ease;
                }
                .admin-dropdown .dropdown-toggle::after {
                    display: none !important;
                }
                .admin-dropdown .dropdown-menu {
                    border: none;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    border-radius: 12px;
                    margin-top: 10px;
                }
                .admin-dropdown .dropdown-item {
                    padding: 10px 20px;
                    font-size: 14px;
                }
                .sidebar-footer {
                    margin-top: auto; 
                    padding-top: 20px; 
                    border-top: 1px solid #1f2e35; 
                    position: absolute; 
                    bottom: 20px; 
                    width: calc(100% - 40px);
                }

                @media (max-width: 991px) {
                    .admin-sidebar {
                        left: -260px !important;
                    }
                    .admin-sidebar.open {
                        left: 0 !important;
                    }
                    .admin-main-wrapper {
                        margin-left: 0 !important;
                    }
                    .admin-content {
                        padding: 15px !important;
                    }
                    .userName span {
                        display: none;
                    }
                }
                @media (max-width: 575px) {
                    .admin-top-bar {
                        padding: 0 15px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboardScreen;
