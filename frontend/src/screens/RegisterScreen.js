import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Store } from '../context/StoreContext';
import axios from 'axios';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [message, setMessage] = useState(null);
    const [success, setSuccess] = useState(false);

    const { search } = useLocation();
    const navigate = useNavigate();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            try {
                await axios.post('/api/users', {
                    name,
                    email,
                    password,
                    isAdmin,
                });
                setSuccess(true);
                setMessage(null);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (err) {
                setMessage(err.response && err.response.data.message ? err.response.data.message : err.message);
            }
        }
    };

    return (
        <Row className='justify-content-md-center py-5'>
            <Col xs={12} md={6}>
                <h1>Sign Up</h1>
                {message && <div className='alert alert-danger'>{message}</div>}
                {success && <div className='alert alert-success'>Registration successful! Redirecting to login...</div>}
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='name'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId='role'>
                        <Form.Label>Select Role</Form.Label>
                        <Form.Select
                            value={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.value === 'true')}
                        >
                            <option value="false">Customer</option>
                            <option value="true" disabled style={{ color: '#aaa' }}>Admin (Disabled)</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId='confirmPassword'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Confirm password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        ></Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary' className='w-100' style={{ backgroundColor: '#FF8717', borderColor: '#FF8717' }}>
                        Register
                    </Button>
                </Form>

                <Row className='py-3'>
                    <Col>
                        Have an Account?{' '}
                        <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                            Login
                        </Link>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default RegisterScreen;
