import React from 'react';
import { Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaLongArrowAltRight } from 'react-icons/fa';

const NotFoundScreen = () => {
    return (
        <div className="error-page">
            {/* Breadcrumb Section */}
            <section className="breadcrumb-area py-5" style={{ backgroundColor: '#f8f9fa' }}>
                <Container>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-dark">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">404 - Not Found</li>
                        </ol>
                    </nav>
                </Container>
            </section>

            {/* Error Content */}
            <section className="error-content py-5 my-5">
                <Container className="text-center">
                    <h1 style={{ fontSize: '120px', fontWeight: '800', color: '#111', lineHeight: '1' }}>404</h1>
                    <h3 className="fw-bold mb-3" style={{ fontSize: '30px' }}>Oops... It looks like you're lost!</h3>
                    <p className="text-muted mb-5 mx-auto" style={{ maxWidth: '600px' }}>
                        Oops! The page you are looking for does not exist. It might have been moved or deleted.
                    </p>
                    <div className="go-back-btn">
                        <LinkContainer to="/">
                            <button className="thm-btn">
                                Back to Home Page <FaLongArrowAltRight className="ms-2" />
                            </button>
                        </LinkContainer>
                    </div>
                </Container>
            </section>

            <style>{`
                .thm-btn {
                    background-color: #FF8717;
                    border: none;
                    color: #fff;
                    padding: 15px 40px;
                    border-radius: 5px;
                    font-weight: bold;
                    text-transform: uppercase;
                    transition: all 0.3s;
                    cursor: pointer;
                }
                .thm-btn:hover {
                    background-color: #111;
                    transform: translateY(-3px);
                    color: #fff;
                }
            `}</style>
        </div>
    );
};

export default NotFoundScreen;
