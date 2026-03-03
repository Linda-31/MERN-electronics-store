import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../../context/StoreContext';
import { toast } from 'react-toastify';

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
        case 'UPLOAD_REQUEST':
            return { ...state, loadingUpload: true, errorUpload: '' };
        case 'UPLOAD_SUCCESS':
            return { ...state, loadingUpload: false, errorUpload: '' };
        case 'UPLOAD_FAIL':
            return { ...state, loadingUpload: false, errorUpload: action.payload };
        default:
            return state;
    }
};

const BlogEditScreen = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { id: blogId } = params;

    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [author, setAuthor] = useState('');
    const [authorImage, setAuthorImage] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [readingTime, setReadingTime] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/blogs/${blogId}`);
                setTitle(data.title);
                setImage(data.image);
                setAuthor(data.author);
                setAuthorImage(data.authorImage);
                setCategory(data.category);
                setTags(data.tags.join(','));
                setExcerpt(data.excerpt);
                setContent(data.content);
                setReadingTime(data.readingTime);
                dispatch({ type: 'FETCH_SUCCESS' });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        };
        fetchData();
    }, [blogId]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            await axios.put(
                `/api/blogs/${blogId}`,
                {
                    _id: blogId,
                    title,
                    image,
                    author,
                    authorImage,
                    category,
                    tags: tags.split(','),
                    excerpt,
                    content,
                    readingTime,
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({ type: 'UPDATE_SUCCESS' });
            toast.success('Blog updated successfully');
            navigate('/admin/bloglist');
        } catch (err) {
            dispatch({ type: 'UPDATE_FAIL' });
            toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
        }
    };

    const uploadFileHandler = async (e, target = 'blog') => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        try {
            dispatch({ type: 'UPLOAD_REQUEST' });
            const { data } = await axios.post('/api/upload', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            dispatch({ type: 'UPLOAD_SUCCESS' });
            if (target === 'blog') {
                setImage(data);
                toast.success('Blog image uploaded');
            } else {
                setAuthorImage(data);
                toast.success('Author image uploaded');
            }
        } catch (err) {
            dispatch({ type: 'UPLOAD_FAIL', payload: err.message });
            toast.error('Upload failed');
        }
    };

    return (
        <Container fluid className="px-md-4 py-4 mt-2">
            <div className="bg-white rounded shadow-sm border p-3 p-md-4">
                <Row className="align-items-center mb-4 gy-3">
                    <Col xs={12} sm={6}>
                        <h2 className="fw-bold mb-0" style={{ color: '#333', fontSize: '1.5rem' }}>Edit Blog Post</h2>
                        <small className="text-muted">Edit your story and content</small>
                    </Col>
                    <Col xs={12} sm={6} className="text-sm-end">
                        <Link to='/admin/bloglist' className='btn btn-outline-secondary w-50 w-sm-auto' style={{ borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
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
                        <Row>
                            <Col lg={8}>
                                <Card className="border-0 shadow-none bg-light p-4 mb-4" style={{ borderRadius: '12px' }}>
                                    <h5 className="fw-bold mb-4">Post Content</h5>
                                    <Form.Group className="mb-3" controlId="title">
                                        <Form.Label className="fw-semibold text-muted small">POST TITLE</Form.Label>
                                        <Form.Control
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            className="border-0 shadow-sm py-2 px-3"
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="excerpt">
                                        <Form.Label className="fw-semibold text-muted small">EXCERPT (SHORT SUMMARY)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={excerpt}
                                            onChange={(e) => setExcerpt(e.target.value)}
                                            required
                                            className="border-0 shadow-sm py-2 px-3"
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="content">
                                        <Form.Label className="fw-semibold text-muted small">FULL CONTENT</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={12}
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            required
                                            className="border-0 shadow-sm py-2 px-3"
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>
                                </Card>

                                <Card className="border-0 shadow-none bg-light p-4 mb-4" style={{ borderRadius: '12px' }}>
                                    <h5 className="fw-bold mb-4">Metadata</h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="category">
                                                <Form.Label className="fw-semibold text-muted small">CATEGORY</Form.Label>
                                                <Form.Control
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    required
                                                    className="border-0 shadow-sm py-2 px-3"
                                                    style={{ borderRadius: '8px' }}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="readingTime">
                                                <Form.Label className="fw-semibold text-muted small">READING TIME</Form.Label>
                                                <Form.Control
                                                    value={readingTime}
                                                    placeholder="e.g. 5 min read"
                                                    onChange={(e) => setReadingTime(e.target.value)}
                                                    className="border-0 shadow-sm py-2 px-3"
                                                    style={{ borderRadius: '8px' }}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3" controlId="tags">
                                        <Form.Label className="fw-semibold text-muted small">TAGS (COMMA SEPARATED)</Form.Label>
                                        <Form.Control
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            required
                                            className="border-0 shadow-sm py-2 px-3"
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>
                                </Card>
                            </Col>

                            <Col lg={4}>
                                <Card className="border-0 shadow-none bg-light p-4 mb-4" style={{ borderRadius: '12px' }}>
                                    <h5 className="fw-bold mb-4">Featured Image</h5>
                                    <Form.Group className="mb-3" controlId="image">
                                        <Form.Label className="fw-semibold text-muted small">IMAGE URL</Form.Label>
                                        <Form.Control
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            required
                                            className="border-0 shadow-sm py-2 px-3 mb-3"
                                            style={{ borderRadius: '8px' }}
                                        />
                                        <div className="upload-btn-wrapper position-relative">
                                            <Button variant="outline-primary" className="w-100 py-2" style={{ borderRadius: '8px', borderStyle: 'dashed' }}>
                                                {loadingUpload ? 'Uploading...' : '+ Change Featured Image'}
                                                <Form.Control
                                                    type="file"
                                                    onChange={(e) => uploadFileHandler(e, 'blog')}
                                                    style={{ position: 'absolute', opacity: 0, left: 0, top: 0, height: '100%', width: '100%', cursor: 'pointer' }}
                                                />
                                            </Button>
                                        </div>
                                        {image && <div className="mt-3 text-center bg-white p-2 rounded shadow-sm">
                                            <img src={image} alt="Preview" style={{ maxWidth: '100%', borderRadius: '4px' }} />
                                        </div>}
                                    </Form.Group>
                                </Card>

                                <Card className="border-0 shadow-none bg-light p-4 mb-4" style={{ borderRadius: '12px' }}>
                                    <h5 className="fw-bold mb-4">Author Details</h5>
                                    <Form.Group className="mb-3" controlId="author">
                                        <Form.Label className="fw-semibold text-muted small">AUTHOR NAME</Form.Label>
                                        <Form.Control
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            required
                                            className="border-0 shadow-sm py-2 px-3"
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="authorImage">
                                        <Form.Label className="fw-semibold text-muted small">AUTHOR IMAGE URL</Form.Label>
                                        <Form.Control
                                            value={authorImage}
                                            onChange={(e) => setAuthorImage(e.target.value)}
                                            required
                                            className="border-0 shadow-sm py-2 px-3 mb-3"
                                            style={{ borderRadius: '8px' }}
                                        />
                                        <div className="upload-btn-wrapper position-relative">
                                            <Button variant="outline-secondary" className="w-100 py-2 small" style={{ borderRadius: '8px', borderStyle: 'dashed', fontSize: '13px' }}>
                                                Change Author Avatar
                                                <Form.Control
                                                    type="file"
                                                    onChange={(e) => uploadFileHandler(e, 'author')}
                                                    style={{ position: 'absolute', opacity: 0, left: 0, top: 0, height: '100%', width: '100%', cursor: 'pointer' }}
                                                />
                                            </Button>
                                        </div>
                                    </Form.Group>
                                </Card>

                                <Button
                                    disabled={loadingUpdate}
                                    type="submit"
                                    className="w-100 py-3 mt-2 fw-bold shadow-sm"
                                    style={{ backgroundColor: '#ff8717', borderColor: '#ff8717', borderRadius: '12px' }}
                                >
                                    {loadingUpdate ? <Spinner animation="border" size="sm" /> : 'UPDATE POST'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                )}
            </div>
        </Container>
    );
};

export default BlogEditScreen;
