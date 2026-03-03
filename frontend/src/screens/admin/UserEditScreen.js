import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Store } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUserEdit, FaShieldAlt, FaEnvelope, FaUser } from 'react-icons/fa';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };
        default:
            return state;
    }
};

const UserEditScreen = () => {
    const navigate = useNavigate();
    const { id: userId } = useParams();

    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
            return;
        }
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                setName(data.name);
                setEmail(data.email);
                setIsAdmin(data.isAdmin);
                dispatch({ type: 'FETCH_SUCCESS' });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: err.message,
                });
            }
        };
        fetchData();
    }, [userId, userInfo, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(
                `/api/users/${userId}`,
                { _id: userId, name, email, isAdmin },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({ type: 'UPDATE_SUCCESS' });
            toast.success('User updated successfully');
            navigate('/admin/userlist');
        } catch (err) {
            dispatch({
                type: 'UPDATE_FAIL',
            });
            toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
        }
    };

    return (
        <Container fluid className="px-md-4 py-4 mt-2">
            <div className="bg-white rounded shadow-sm border p-3 p-md-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Row className="align-items-center mb-4 gy-3">
                    <Col xs={12} sm={8}>
                        <h2 className="fw-bold mb-0" style={{ color: '#333', fontSize: '1.5rem' }}>
                            <FaUserEdit className="me-2" style={{ color: '#FF8717' }} /> Edit User
                        </h2>
                        <small className="text-muted">Manage account details and permissions</small>
                    </Col>
                    <Col xs={12} sm={4} className="text-sm-end">
                        <Link to='/admin/userlist' className='btn btn-outline-secondary w-100 w-sm-auto' style={{ borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
                            Go Back
                        </Link>
                    </Col>
                </Row>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="warning" />
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Card className="border-0 shadow-none bg-light p-4 mb-4" style={{ borderRadius: '12px' }}>
                            <h5 className="fw-bold mb-4">Account Information</h5>

                            <Form.Group className="mb-4" controlId='name'>
                                <Form.Label className="fw-semibold text-muted small"><FaUser className="me-1" /> FULL NAME</Form.Label>
                                <Form.Control
                                    type='name'
                                    placeholder='Enter name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border-0 shadow-sm py-2 px-3"
                                    style={{ borderRadius: '8px' }}
                                    required
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-4" controlId='email'>
                                <Form.Label className="fw-semibold text-muted small"><FaEnvelope className="me-1" /> EMAIL ADDRESS</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='Enter email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border-0 shadow-sm py-2 px-3"
                                    style={{ borderRadius: '8px' }}
                                    required
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-2" controlId='isadmin'>
                                <div className="d-flex align-items-center p-3 bg-white rounded shadow-sm">
                                    <FaShieldAlt className="me-3 text-warning" size={20} />
                                    <Form.Check
                                        type='checkbox'
                                        label={<span className="fw-bold">Administrator Access</span>}
                                        checked={isAdmin}
                                        onChange={(e) => setIsAdmin(e.target.checked)}
                                        className="mb-0"
                                    ></Form.Check>
                                </div>
                                <small className="text-muted d-block mt-2 px-2">
                                    Giving admin access allows this user to manage products, orders, and other users.
                                </small>
                            </Form.Group>
                        </Card>

                        <div className="text-center">
                            <Button
                                type='submit'
                                disabled={loadingUpdate}
                                className='px-5 py-3 fw-bold shadow-sm'
                                style={{ backgroundColor: '#FF8717', borderColor: '#FF8717', borderRadius: '12px', minWidth: '250px' }}
                            >
                                {loadingUpdate ? <Spinner animation="border" size="sm" /> : 'SAVE CHANGES'}
                            </Button>
                        </div>
                    </Form>
                )}
            </div>
        </Container>
    );
};

export default UserEditScreen;
