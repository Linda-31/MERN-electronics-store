import React, { useEffect, useReducer } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaCalendar, FaClock, FaTag, FaChevronLeft } from 'react-icons/fa';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, blog: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const BlogDetailScreen = () => {
    const params = useParams();
    const { id } = params;

    const [{ loading, error, blog }, dispatch] = useReducer(reducer, {
        blog: null,
        loading: true,
        error: '',
    });

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/blogs/${id}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        };
        fetchBlog();
    }, [id]);

    if (loading) return (
        <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" variant="primary" />
        </div>
    );
    if (error) return <Alert variant="danger" className="m-5">{error}</Alert>;
    if (!blog) return <Alert variant="info" className="m-5">Blog not found</Alert>;

    return (
        <div className="blog-detail-page py-5">
            <Container>
                <Link to="/blog" className="btn btn-outline-warning mb-4 fw-bold">
                    <FaChevronLeft className="me-2" /> BACK TO BLOGS
                </Link>

                <Row className="justify-content-center">
                    <Col lg={10}>
                        <Card className="border-0 shadow-sm overflow-hidden">
                            <Link to={`/blog/${blog._id}`}>
                                <Card.Img
                                    variant="top"
                                    src={blog.image}
                                    style={{ height: '500px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x600?text=Blog+Image'; }}
                                />
                            </Link>
                            <Card.Body className="p-5">
                                <div className="mb-4">
                                    <Badge bg="warning" className="mb-2 px-3 py-2 fs-6">{blog.category}</Badge>
                                    <h1 className="fw-bold mb-3" style={{ fontSize: '3rem' }}>{blog.title}</h1>

                                    <div className="d-flex flex-wrap gap-4 text-muted border-bottom pb-4 mb-4">
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={blog.authorImage}
                                                alt={blog.author}
                                                className="rounded-circle me-2"
                                                style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/30?text=A'; }}
                                            />
                                            <span>By {blog.author}</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <FaCalendar className="me-2 text-warning" />
                                            <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <FaClock className="me-2 text-warning" />
                                            <span>{blog.readingTime}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="blog-content mb-5" style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#4b5563' }}>
                                    {blog.content.split('\n').map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                    ))}
                                </div>

                                <div className="tags-section border-top pt-4">
                                    <h5 className="fw-bold mb-3"><FaTag className="me-2 text-warning" /> Tags:</h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        {blog.tags.map((tag, idx) => (
                                            <Badge key={idx} bg="light" text="dark" className="border px-3 py-2 fw-normal">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default BlogDetailScreen;
