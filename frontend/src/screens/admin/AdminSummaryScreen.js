import React, { useContext, useEffect, useReducer } from 'react';
import { Row, Col, Table, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../../context/StoreContext';
import axios from 'axios';
import { FaBox, FaUsers, FaChartLine, FaShoppingBag, FaArrowUp, FaChevronRight } from 'react-icons/fa';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                orders: action.payload.orders,
                users: action.payload.users,
                products: action.payload.products,
                subscribers: action.payload.subscribers,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

// Mock data for charts (since backend doesn't provide historical yet)
const salesData = [
    { name: 'Jan', sales: 4000 }, { name: 'Feb', sales: 3000 }, { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 }, { name: 'May', sales: 6000 }, { name: 'Jun', sales: 8500 },
    { name: 'Jul', sales: 7000 }, { name: 'Aug', sales: 7500 }, { name: 'Sept', sales: 6500 },
    { name: 'Oct', sales: 8000 }, { name: 'Nov', sales: 9000 }, { name: 'Dec', sales: 9500 },
];

const marketingData = [
    { name: 'Facebook', value: 40 }, { name: 'Google', value: 60 }, { name: 'Email', value: 30 },
    { name: 'Instagram', value: 70 }, { name: 'Video', value: 85 },
];

const shipmentData = [
    { name: 'Delivered', value: 400, color: '#ff8717' },
    { name: 'On Delivery', value: 300, color: '#0ea5e9' },
    { name: 'Returned', value: 100, color: '#ef4444' },
    { name: 'Canceled', value: 50, color: '#f59e0b' },
];

const AdminSummaryScreen = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();

    const [{ loading, error, orders, users, products, subscribers }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        orders: [],
        users: [],
        products: [],
        subscribers: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const [ordersRes, usersRes, productsRes, subscribersRes] = await Promise.all([
                    axios.get('/api/orders', config),
                    axios.get('/api/users', config),
                    axios.get('/api/products', config),
                    axios.get('/api/subscribers', config)
                ]);
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: { orders: ordersRes.data, users: usersRes.data, products: productsRes.data, subscribers: subscribersRes.data },
                });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        };
        fetchData();
    }, [userInfo]);

    const totalSales = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
    const ordersToday = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;
    const lowStockItems = products.filter(p => p.countInStock <= 5).length;
    const totalCustomers = users.length;

    const inventoryStatus = {
        inStock: products.filter(p => p.countInStock > 5).length,
        lowStock: products.filter(p => p.countInStock <= 5 && p.countInStock > 0).length,
        outOfStock: products.filter(p => p.countInStock === 0).length,
    };

    const styles = {
        title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '25px', color: '#111827' },
        card: { borderRadius: '15px', padding: '20px', border: 'none', height: '100%', position: 'relative', overflow: 'hidden' },
        sectionCard: { backgroundColor: '#fff', borderRadius: '15px', padding: '24px', border: '1px solid #e5e7eb', height: '100%' },
        cardLabel: { fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '10px' },
        cardValue: { fontSize: '24px', fontWeight: 'bold', color: '#111827' },
        badge: { padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
        statusDot: { width: '8px', height: '8px', borderRadius: '50%', marginRight: '10px' }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="admin-dashboard-content">
            <h2 style={styles.title}>Dashboard</h2>

            {/* Top 4 Stats Cards */}
            <Row className="g-3 g-md-4 mb-4">
                <Col xl={3} lg={4} md={6} sm={12}>
                    <div style={{ ...styles.card, backgroundColor: '#f3e8ff' }}>
                        <div style={styles.cardLabel}>Total Sales</div>
                        <div style={styles.cardValue}>${(totalSales / 1000).toFixed(1)}K</div>
                        <FaChartLine style={{ position: 'absolute', right: '20px', bottom: '20px', fontSize: '24px', opacity: 0.5 }} />
                    </div>
                </Col>
                <Col xl={3} lg={4} md={6} sm={12}>
                    <div style={{ ...styles.card, backgroundColor: '#e0f2fe' }}>
                        <div style={styles.cardLabel}>Orders Today</div>
                        <div style={styles.cardValue}>{ordersToday}</div>
                        <FaShoppingBag style={{ position: 'absolute', right: '20px', bottom: '20px', fontSize: '24px', opacity: 0.5 }} />
                    </div>
                </Col>
                <Col xl={3} lg={4} md={6} sm={12}>
                    <div style={{ ...styles.card, backgroundColor: '#ffedd5' }}>
                        <div style={styles.cardLabel}>Low Stock Items</div>
                        <div style={styles.cardValue}>{lowStockItems}</div>
                        <FaBox style={{ position: 'absolute', right: '20px', bottom: '20px', fontSize: '24px', opacity: 0.5 }} />
                    </div>
                </Col>
                <Col xl={3} lg={4} md={6} sm={12}>
                    <div style={{ ...styles.card, backgroundColor: '#f3f4f6' }}>
                        <div style={styles.cardLabel}>Total Customers</div>
                        <div style={styles.cardValue}>{totalCustomers}</div>
                        <FaUsers style={{ position: 'absolute', right: '20px', bottom: '20px', fontSize: '24px', opacity: 0.5 }} />
                    </div>
                </Col>
            </Row>

            <Row className="g-4 mb-4">
                {/* Sales Overview */}
                <Col lg={8}>
                    <div style={styles.sectionCard}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 style={{ fontWeight: 'bold' }}>Sales Overview</h5>
                            <select style={{ fontSize: '12px', border: 'none', color: '#6b7280', outline: 'none' }}>
                                <option>Monthly</option>
                            </select>
                        </div>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesData}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ff8717" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#ff8717" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="sales" stroke="#ff8717" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Col>

                {/* Inventory Status */}
                <Col lg={4}>
                    <div style={styles.sectionCard}>
                        <h5 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Inventory Status</h5>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center">
                                    <div style={{ ...styles.statusDot, backgroundColor: '#ff8717' }}></div>
                                    <span style={{ fontSize: '14px', color: '#374151' }}>In Stock</span>
                                </div>
                                <span style={{ fontWeight: 'bold' }}>{inventoryStatus.inStock}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center">
                                    <div style={{ ...styles.statusDot, backgroundColor: '#ef4444' }}></div>
                                    <span style={{ fontSize: '14px', color: '#374151' }}>Low Stock</span>
                                </div>
                                <span style={{ fontWeight: 'bold' }}>{inventoryStatus.lowStock}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <div style={{ ...styles.statusDot, backgroundColor: '#111' }}></div>
                                    <span style={{ fontSize: '14px', color: '#374151' }}>Out of Stock</span>
                                </div>
                                <span style={{ fontWeight: 'bold' }}>{inventoryStatus.outOfStock}</span>
                            </div>
                        </div>
                        <button className="btn w-100" onClick={() => navigate('/admin/productlist')} style={{ borderRadius: '10px', fontSize: '14px', padding: '10px', backgroundColor: '#ff8717', color: '#fff', border: 'none' }}>
                            Manage Inventory
                        </button>
                    </div>
                </Col>
            </Row>

            <Row className="g-4 mb-4">
                {/* Top Selling Products */}
                <Col lg={6}>
                    <div style={styles.sectionCard}>
                        <h5 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Top Selling Products</h5>
                        <Table responsive borderless className="align-middle">
                            <thead style={{ fontSize: '12px', color: '#9ca3af' }}>
                                <tr>
                                    <th>Product</th>
                                    <th>Sales</th>
                                    <th>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.slice(0, 4).map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="d-flex align-items-center gap-3 py-3">
                                            <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img src={item.image} alt={item.name} style={{ width: '30px', objectFit: 'contain' }} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '600' }}>{item.name}</div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.category}</div>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '14px', fontWeight: 'bold' }}>${item.price}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2" style={{ color: '#ff8717', fontSize: '14px', fontWeight: '600' }}>
                                                <FaArrowUp size={10} /> 15.8%
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Col>

                {/* Recent Orders */}
                <Col lg={6}>
                    <div style={styles.sectionCard}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 style={{ fontWeight: 'bold' }}>Recent Orders</h5>
                            <Link to="/admin/orderlist" style={{ fontSize: '13px', color: '#3b82f6', textDecoration: 'none' }}>View All <FaChevronRight size={10} /></Link>
                        </div>
                        <Table responsive borderless className="align-middle">
                            <thead style={{ fontSize: '12px', color: '#9ca3af' }}>
                                <tr>
                                    <th>Order</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 4).map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="py-3">
                                            <div style={{ fontSize: '14px', fontWeight: '600' }}>#{item._id.substring(0, 6)}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.user?.name || 'Guest'}</div>
                                        </td>
                                        <td>
                                            <span style={{
                                                ...styles.badge,
                                                backgroundColor: item.isDelivered ? '#ffedd5' : item.isPaid ? '#dbeafe' : '#fef3c7',
                                                color: item.isDelivered ? '#ff8717' : item.isPaid ? '#1e40af' : '#92400e'
                                            }}>
                                                {item.isDelivered ? 'Shipped' : item.isPaid ? 'Processing' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Customer Activity */}
                <Col lg={4}>
                    <div style={styles.sectionCard}>
                        <h5 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Customer Activity</h5>
                        <div style={{ height: '200px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={[{ value: subscribers.length }, { value: users.length }, { value: 25 }]} innerRadius={60} outerRadius={80} dataKey="value">
                                        <Cell fill="#ff8717" />
                                        <Cell fill="#3b82f6" />
                                        <Cell fill="#a855f7" />
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4">
                            <div className="mb-2">
                                <span style={{ fontSize: '13px', color: '#6b7280' }}>Newsletter Subscribers: </span>
                                <span style={{ fontWeight: 'bold' }}>{subscribers.length}</span>
                            </div>
                            <div className="mb-2">
                                <span style={{ fontSize: '13px', color: '#6b7280' }}>Registered Users: </span>
                                <span style={{ fontWeight: 'bold' }}>{users.length}</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '13px', color: '#6b7280' }}>New Signups: </span>
                                <span style={{ fontWeight: 'bold' }}>{users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length} Today</span>
                            </div>
                        </div>
                    </div>
                </Col>

                {/* Marketing Performance */}
                <Col lg={8}>
                    <div style={styles.sectionCard}>
                        <h5 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Marketing Performance</h5>
                        <div style={{ height: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={marketingData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#ff8717" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default AdminSummaryScreen;
