import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Store } from '../../context/StoreContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loading: true };
        case 'CREATE_SUCCESS':
            return { ...state, loading: false };
        case 'CREATE_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const ProductAddScreen = () => {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ loading, error }, dispatch] = useReducer(reducer, {
        loading: false,
        error: '',
    });

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [sku, setSku] = useState('');
    const [colors, setColors] = useState([]);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
        }
    }, [navigate, userInfo]);

    const uploadFileHandler = async (e, type = 'single') => {
        const file = e.target.files[0];
        const formData = new FormData();

        if (type === 'multiple') {
            const files = e.target.files;
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }
        } else {
            formData.append('image', file);
        }

        setUploading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            if (type === 'multiple') {
                const { data } = await axios.post('/api/upload/multiple', formData, config);
                setImages(data);
            } else {
                const { data } = await axios.post('/api/upload', formData, config);
                setImage(data);
            }
            setUploading(false);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Upload failed');
        }
    };

    const handleColorChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setColors([...colors, value]);
        } else {
            setColors(colors.filter((c) => c !== value));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'CREATE_REQUEST' });
            await axios.post(
                '/api/products',
                {
                    name,
                    price,
                    image,
                    brand,
                    category,
                    countInStock,
                    description,
                    sku,
                    colors,
                    images,
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({ type: 'CREATE_SUCCESS' });
            toast.success('Product created successfully');
            navigate('/admin/productlist');
        } catch (err) {
            dispatch({
                type: 'CREATE_FAIL',
                payload: err.message,
            });
            toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
        }
    };

    return (
        <Container fluid className="px-md-4 py-4 mt-2">
            <div className="bg-white rounded shadow-sm border p-3 p-md-4">
                <Row className="align-items-center mb-4 gy-3">
                    <Col xs={12} sm={6}>
                        <h2 className="fw-bold mb-0" style={{ color: '#333', fontSize: '1.5rem' }}>Add New Product</h2>
                    </Col>
                    <Col xs={12} sm={6} className="text-sm-end">
                        <Link to='/admin/productlist' className='btn btn-outline-secondary w-50 w-sm-auto' style={{ borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
                            Go Back
                        </Link>
                    </Col>
                </Row>

                {error && <div className='alert alert-danger'>{error}</div>}

                <Form onSubmit={submitHandler}>
                    <Row>
                        <Col lg={8}>
                            <Card className="border-0 shadow-none bg-light p-4 mb-4" style={{ borderRadius: '12px' }}>
                                <h5 className="fw-bold mb-4">Basic Information</h5>
                                <Form.Group className="mb-3" controlId='name'>
                                    <Form.Label className="fw-semibold text-muted small">PRODUCT NAME</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter product name'
                                        value={name}
                                        required
                                        onChange={(e) => setName(e.target.value)}
                                        className="border-0 shadow-sm py-2 px-3"
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId='description'>
                                    <Form.Label className="fw-semibold text-muted small">DESCRIPTION</Form.Label>
                                    <Form.Control
                                        as='textarea'
                                        rows={4}
                                        placeholder='Enter product description'
                                        value={description}
                                        required
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="border-0 shadow-sm py-2 px-3"
                                        style={{ borderRadius: '8px' }}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId='price'>
                                            <Form.Label className="fw-semibold text-muted small">PRICE ($)</Form.Label>
                                            <Form.Control
                                                type='number'
                                                placeholder='0.00'
                                                value={price}
                                                required
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="border-0 shadow-sm py-2 px-3"
                                                style={{ borderRadius: '8px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId='sku'>
                                            <Form.Label className="fw-semibold text-muted small">SKU</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Enter SKU'
                                                value={sku}
                                                required
                                                onChange={(e) => setSku(e.target.value)}
                                                className="border-0 shadow-sm py-2 px-3"
                                                style={{ borderRadius: '8px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card>

                            <Card className="border-0 shadow-none bg-light p-4 mb-4" style={{ borderRadius: '12px' }}>
                                <h5 className="fw-bold mb-4">Inventory & Details</h5>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId='category'>
                                            <Form.Label className="fw-semibold text-muted small">CATEGORY</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Enter category'
                                                value={category}
                                                required
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="border-0 shadow-sm py-2 px-3"
                                                style={{ borderRadius: '8px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId='brand'>
                                            <Form.Label className="fw-semibold text-muted small">BRAND</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Enter brand'
                                                value={brand}
                                                required
                                                onChange={(e) => setBrand(e.target.value)}
                                                className="border-0 shadow-sm py-2 px-3"
                                                style={{ borderRadius: '8px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId='countInStock'>
                                            <Form.Label className="fw-semibold text-muted small">STOCK QUANTITY</Form.Label>
                                            <Form.Control
                                                type='number'
                                                placeholder='0'
                                                value={countInStock}
                                                required
                                                onChange={(e) => setCountInStock(e.target.value)}
                                                className="border-0 shadow-sm py-2 px-3"
                                                style={{ borderRadius: '8px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold text-muted small d-block">AVAILABLE COLORS</Form.Label>
                                            <div className="d-flex gap-3 mt-2">
                                                {['Blue', 'Green', 'Red', 'Black'].map(color => (
                                                    <Form.Check
                                                        key={color}
                                                        type="checkbox"
                                                        label={color}
                                                        value={color}
                                                        onChange={handleColorChange}
                                                        className="small"
                                                    />
                                                ))}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col lg={4}>
                            <Card className="border-0 shadow-none bg-light p-4 mb-4" style={{ borderRadius: '12px' }}>
                                <h5 className="fw-bold mb-4">Product Images</h5>
                                <Form.Group className="mb-4" controlId='image'>
                                    <Form.Label className="fw-semibold text-muted small">MAIN IMAGE URL</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter image url'
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        className="border-0 shadow-sm py-2 px-3 mb-2"
                                        style={{ borderRadius: '8px' }}
                                    />
                                    <div className="upload-btn-wrapper">
                                        <Button variant="outline-primary" className="w-100 py-2" style={{ borderRadius: '8px', borderStyle: 'dashed' }}>
                                            {uploading ? 'Uploading...' : '+ Upload Main Image'}
                                            <Form.Control
                                                type='file'
                                                onChange={uploadFileHandler}
                                                style={{ position: 'absolute', opacity: 0, left: 0, top: 0, height: '100%', cursor: 'pointer' }}
                                            />
                                        </Button>
                                    </div>
                                    {image && <div className="mt-3 text-center bg-white p-2 rounded shadow-sm">
                                        <img src={image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }} />
                                    </div>}
                                </Form.Group>

                                <Form.Group className="mb-4" controlId='multiple-images'>
                                    <Form.Label className="fw-semibold text-muted small">GALLERY IMAGES</Form.Label>
                                    <div className="upload-btn-wrapper">
                                        <Button variant="outline-secondary" className="w-100 py-2" style={{ borderRadius: '8px', borderStyle: 'dashed' }}>
                                            {uploading ? 'Uploading...' : '+ Upload Gallery Images'}
                                            <Form.Control
                                                type='file'
                                                multiple
                                                onChange={(e) => uploadFileHandler(e, 'multiple')}
                                                style={{ position: 'absolute', opacity: 0, left: 0, top: 0, height: '100%', cursor: 'pointer' }}
                                            />
                                        </Button>
                                    </div>
                                    {images && images.length > 0 && (
                                        <div className="mt-3 d-flex flex-wrap gap-2 justify-content-center bg-white p-2 rounded shadow-sm">
                                            {images.map((img, idx) => (
                                                <img key={idx} src={img} alt={`Gallery ${idx}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                            ))}
                                        </div>
                                    )}
                                </Form.Group>
                            </Card>

                            <Button
                                type='submit'
                                disabled={loading}
                                className='w-100 py-3 mt-2 fw-bold shadow-sm'
                                style={{ backgroundColor: '#ff8717', borderColor: '#ff8717', borderRadius: '12px' }}
                            >
                                {loading ? 'Creating...' : 'PUBLISH PRODUCT'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Container>
    );
};

export default ProductAddScreen;
