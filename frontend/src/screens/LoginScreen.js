import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { Store } from '../context/StoreContext';
import axios from 'axios';
import { FaLongArrowAltRight } from 'react-icons/fa';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        try {
            const { data } = await axios.post('/api/users/login', {
                email,
                password,
            });
            ctxDispatch({ type: 'USER_LOGIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));

            if (data.isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate(redirect);
            }
        } catch (err) {
            alert('Invalid email or password');
        }
    };

    return (
        <div className="login-page">
            <style>{`
                .breadcrumb-area {
                    background-color: #f8f9fa;
                    padding: 30px 0;
                    margin-bottom: 50px;
                }
                .radios-breadcrumb ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    display: flex;
                    align-items: center;
                }
                .radiosbcrumb-item a {
                    color: #111;
                    text-decoration: none;
                    font-weight: 500;
                }
                .radiosbcrumb-item.active {
                    color: #FF8717;
                }
                .account__title {
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 30px;
                    color: #111;
                }
                .login-form-wrapper {
                    max-width: 570px;
                    margin: 0 auto;
                    padding: 40px;
                    background: #fff;
                    border: 1px solid #eee;
                    border-radius: 10px;
                }
                .form-group label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 10px;
                    color: #111;
                }
                .form-control {
                    height: 55px;
                    padding: 0 20px;
                    border: 1px solid #eee;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }
                .form-control:focus {
                    border-color: #FF8717;
                    box-shadow: none;
                }
                .thm-btn {
                    background-color: #FF8717;
                    color: #fff;
                    padding: 15px 40px;
                    border-radius: 5px;
                    font-weight: 700;
                    text-transform: uppercase;
                    border: none;
                    transition: all 0.3s;
                    display: inline-block;
                    text-decoration: none;
                    width: auto;
                }
                .thm-btn:hover {
                    background-color: #111;
                    color: #fff;
                    transform: translateY(-2px);
                }
                .form-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 10px;
                }
                .remember-me {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #666;
                }
                .lost-password {
                    font-size: 14px;
                    color: #FF8717;
                    text-decoration: none;
                }
                .lost-password:hover {
                    color: #111;
                }
                .register-link {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 15px;
                    color: #666;
                }
                .register-link a {
                    color: #FF8717;
                    font-weight: 600;
                    text-decoration: none;
                }
            `}</style>

            {/* Breadcrumb Section */}
            <section className="breadcrumb-area">
                <Container>
                    <div className="radios-breadcrumb">
                        <ul>
                            <li className="radiosbcrumb-item"><Link to="/">Home</Link></li>
                            <li className="radiosbcrumb-item active"> My account</li>
                        </ul>
                    </div>
                </Container>
            </section>

            <Container className="pb-80">
                <div className="login-form-wrapper">
                    <h2 className="account__title text-center">Login</h2>
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='email'>
                            <Form.Label>Username or email address *</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId='password'>
                            <Form.Label>Password *</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <div className="form-footer mb-4">
                            <div className="remember-me">
                                <input type="checkbox" id="rememberme" />
                                <label htmlFor="rememberme" className="m-0">Remember me</label>
                            </div>
                            <Link to="/" className="lost-password">Lost your password?</Link>
                        </div>

                        <button type='submit' className='thm-btn w-100'>
                            Log in
                        </button>
                    </Form>

                    <div className="register-link">
                        New Customer?{' '}
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                            Register here <FaLongArrowAltRight className="ms-1" />
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default LoginScreen;
