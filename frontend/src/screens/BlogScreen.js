import React, { useEffect, useReducer } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaComment, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPinterest, FaLongArrowAltRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, blogs: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const BlogScreen = () => {
    const [{ loading, error, blogs }, dispatch] = useReducer(reducer, {
        blogs: [],
        loading: true,
        error: '',
    });

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get('/api/blogs');
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        };
        fetchBlogs();
    }, []);

    // Extract categories and tags dynamically
    const categories = [...new Set(blogs.map(blog => blog.category))];
    const tags = [...new Set(blogs.flatMap(blog => blog.tags))];
    const hotCategories = blogs.slice(0, 3).map((blog, idx) => ({
        id: blog._id,
        title: blog.title,
        category: blog.category,
        image: blog.image,
        number: `0${idx + 1}`
    }));

    return (
        <div className="blog-page">
            {/* Breadcrumb Section */}
            <section className="breadcrumb-area py-5" style={{ backgroundColor: '#f8f9fa' }}>
                <Container>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-dark">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Blog</li>
                        </ol>
                    </nav>
                </Container>
            </section>

            <section className="py-5">
                <Container>
                    <Row>
                        {/* Main Content */}
                        <Col lg={8} xl={9}>
                            {loading ? (
                                <div className="d-flex justify-content-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : error ? (
                                <Alert variant="danger">{error}</Alert>
                            ) : (
                                <div className="blog-posts">
                                    {blogs.length === 0 ? (
                                        <Alert variant="info">No blog posts found.</Alert>
                                    ) : (
                                        blogs.map(post => (
                                            <Card key={post._id} className="border-0 mb-5 shadow-sm overflow-hidden">
                                                <div className="position-relative">
                                                    <Link to={`/blog/${post._id}`}>
                                                        <Card.Img
                                                            variant="top"
                                                            src={post.image}
                                                            style={{ height: '400px', objectFit: 'cover' }}
                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=Blog+Image'; }}
                                                        />
                                                    </Link>
                                                    <div className="post-date position-absolute top-0 start-0 m-3 bg-warning text-white p-2 text-center rounded" style={{ minWidth: '60px' }}>
                                                        <span className="h4 d-block mb-0 fw-bold">{new Date(post.createdAt).getDate()}</span>
                                                        <span className="small text-uppercase">{new Date(post.createdAt).toLocaleString('default', { month: 'short' })}</span>
                                                    </div>
                                                </div>
                                                <Card.Body className="p-4">
                                                    <div className="d-flex mb-3 align-items-center">
                                                        <span className="text-warning fw-bold me-2"># Tags</span>
                                                        {post.tags.map((tag, idx) => (
                                                            <Badge key={idx} bg="light" text="dark" className="me-2 px-2 py-1 border">{tag}</Badge>
                                                        ))}
                                                    </div>
                                                    <Link to={`/blog/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        <Card.Title className="h2 fw-bold mb-3">{post.title}</Card.Title>
                                                    </Link>
                                                    <div className="d-flex text-muted small mb-3 align-items-center">
                                                        <div className="d-flex align-items-center me-4">
                                                            <img
                                                                src={post.authorImage}
                                                                alt={post.author}
                                                                className="rounded-circle me-2"
                                                                style={{ width: '25px', height: '25px', objectFit: 'cover' }}
                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/25?text=A'; }}
                                                            />
                                                            <span>{post.author} / {new Date(post.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <span className="me-4"><FaComment className="me-1" /> {post.numComments}</span>
                                                        <span><FaClock className="me-1" /> {post.readingTime}</span>
                                                    </div>
                                                    <Card.Text className="text-muted mb-4">{post.excerpt}</Card.Text>
                                                    <Link to={`/blog/${post._id}`} className="p-0 text-warning text-decoration-none fw-bold">
                                                        READ MORE <FaLongArrowAltRight className="ms-1" />
                                                    </Link>
                                                </Card.Body>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            )}
                        </Col>

                        {/* Sidebar */}
                        <Col lg={4} xl={3}>
                            <aside className="sidebar">
                                {/* Search Widget */}
                                <div className="widget mb-5 p-4 bg-light rounded shadow-sm">
                                    <h5 className="widget-title mb-4 pb-2 border-bottom border-warning border-3 d-inline-block">Search</h5>
                                    <Form className="position-relative">
                                        <Form.Control type="text" placeholder="Search.." className="pe-5 py-2" />
                                        <Button className="position-absolute top-50 end-0 translate-middle-y me-2 border-0 bg-transparent text-muted">
                                            <FaSearch />
                                        </Button>
                                    </Form>
                                </div>

                                {/* Social Widget */}
                                <div className="widget mb-5 p-4 bg-light rounded shadow-sm">
                                    <h5 className="widget-title mb-4 pb-2 border-bottom border-warning border-3 d-inline-block">Stay Connected</h5>
                                    <div className="social-links d-flex flex-column">
                                        {[
                                            { icon: <FaFacebookF />, name: "Facebook", action: "Follow", color: "#3b5998" },
                                            { icon: <FaTwitter />, name: "Twitter", action: "Follow", color: "#1da1f2" },
                                            { icon: <FaInstagram />, name: "Instagram", action: "Follow", color: "#e4405f" },
                                            { icon: <FaYoutube />, name: "YouTube", action: "Subscribe", color: "#ff0000" },
                                            { icon: <FaPinterest />, name: "Pinterest", action: "Follow", color: "#bd081c" }
                                        ].map((social, idx) => (
                                            <div key={idx} className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-white">
                                                <div className="d-flex align-items-center">
                                                    <span className="me-3 fs-5" style={{ color: social.color }}>{social.icon}</span>
                                                    <span className="fw-bold small">{social.name}</span>
                                                </div>
                                                <a href="#" className="small text-muted text-decoration-none">{social.action}</a>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Hot Category Widget */}
                                <div className="widget mb-5 p-4 bg-light rounded shadow-sm">
                                    <h5 className="widget-title mb-4 pb-2 border-bottom border-warning border-3 d-inline-block">Hot Category</h5>
                                    {hotCategories.map(hot => (
                                        <div key={hot.id} className="d-flex mb-4">
                                            <div className="position-relative me-3">
                                                <Link to={`/blog/${hot.id}`}>
                                                    <img
                                                        src={hot.image}
                                                        alt=""
                                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                        className="rounded"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=Blog'; }}
                                                    />
                                                </Link>
                                                <Badge bg="warning" className="position-absolute bottom-0 end-0 m-1">{hot.number}</Badge>
                                            </div>
                                            <div>
                                                <span className="small text-warning fw-bold d-block mb-1">{hot.category}</span>
                                                <Link to={`/blog/${hot.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    <h6 className="mb-0 fw-bold small" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{hot.title}</h6>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Categories Widget */}
                                <div className="widget mb-5 p-4 bg-light rounded shadow-sm">
                                    <h5 className="widget-title mb-4 pb-2 border-bottom border-warning border-3 d-inline-block">Category</h5>
                                    <ListGroup variant="flush">
                                        {categories.length > 0 ? categories.map((cat, idx) => (
                                            <ListGroup.Item key={idx} className="bg-transparent px-0 border-0 py-1">
                                                <a href="#" className="text-dark text-decoration-none d-block">{cat}</a>
                                            </ListGroup.Item>
                                        )) : <span className="small text-muted">No categories</span>}
                                    </ListGroup>
                                </div>

                                {/* Tags Widget */}
                                <div className="widget p-4 bg-light rounded shadow-sm">
                                    <h5 className="widget-title mb-4 pb-2 border-bottom border-warning border-3 d-inline-block">Tags</h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        {tags.length > 0 ? tags.map((tag, idx) => (
                                            <Badge key={idx} bg="white" text="dark" className="border px-3 py-2 fw-normal">{tag}</Badge>
                                        )) : <span className="small text-muted">No tags</span>}
                                    </div>
                                </div>
                            </aside>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default BlogScreen;
