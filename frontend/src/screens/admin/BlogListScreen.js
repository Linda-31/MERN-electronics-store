import React, { useContext, useEffect, useReducer } from 'react';
import { Table, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../../context/StoreContext';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, blogs: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreate: false };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelete: false };
        case 'DELETE_SUCCESS':
            return { ...state, loadingDelete: false, successDelete: true };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false, successDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state;
    }
};

const BlogListScreen = () => {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [
        {
            loading,
            error,
            blogs,
            loadingCreate,
            loadingDelete,
            successDelete,
        },
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        error: '',
        blogs: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get('/api/blogs', {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        };

        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
    }, [userInfo, successDelete]);

    const createHandler = async () => {
        if (window.confirm('Are you sure to create a new blog?')) {
            try {
                dispatch({ type: 'CREATE_REQUEST' });
                const { data } = await axios.post(
                    '/api/blogs',
                    {},
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                dispatch({ type: 'CREATE_SUCCESS' });
                navigate(`/admin/blog/${data._id}/edit`);
            } catch (err) {
                dispatch({ type: 'CREATE_FAIL' });
                alert(err.message);
            }
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure to delete this blog?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' });
                await axios.delete(`/api/blogs/${id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'DELETE_SUCCESS' });
                toast.success('Blog post deleted successfully');
            } catch (err) {
                dispatch({ type: 'DELETE_FAIL' });
                toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
            }
        }
    };

    return (
        <div className="container-fluid px-md-4 py-4 mt-2">
            <Row className="align-items-center mb-4 gy-3">
                <Col xs={12} sm={6}>
                    <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>Blog Posts</h2>
                </Col>
                <Col xs={12} sm={6} className="text-sm-end">
                    <Button type="button" variant="warning" onClick={createHandler} className="fw-bold w-50 w-sm-auto">
                        <FaPlus className="me-2" /> CREATE BLOG
                    </Button>
                </Col>
            </Row>

            {loadingCreate && <Spinner animation="border" size="sm" className="mb-3" />}
            {loadingDelete && <Spinner animation="border" size="sm" className="mb-3" />}

            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <Table responsive hover className="mb-0">
                        <thead style={{ backgroundColor: '#f9fafb', fontSize: '12px', color: '#6b7280' }}>
                            <tr>
                                <th className="p-3 d-none d-md-table-cell">ID</th>
                                <th className="p-3">IMAGE</th>
                                <th className="p-3">BLOG TITLE</th>
                                <th className="p-3 d-none d-lg-table-cell">AUTHOR</th>
                                <th className="p-3 d-none d-sm-table-cell">CATEGORY</th>
                                <th className="p-3 d-none d-md-table-cell">DATE</th>
                                <th className="p-3">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog) => (
                                <tr key={blog._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td className="p-3 d-none d-md-table-cell" style={{ fontSize: '13px', color: '#6b7280' }}>#{blog._id.substring(0, 8)}</td>
                                    <td className="p-3">
                                        <img
                                            src={blog.image}
                                            alt=""
                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=NA'; }}
                                        />
                                    </td>
                                    <td className="p-3" style={{ fontSize: '14px', fontWeight: '500' }}>{blog.title}</td>
                                    <td className="p-3 d-none d-lg-table-cell" style={{ fontSize: '14px' }}>{blog.author}</td>
                                    <td className="p-3 d-none d-sm-table-cell" style={{ fontSize: '14px' }}>{blog.category}</td>
                                    <td className="p-3 d-none d-md-table-cell" style={{ fontSize: '13px' }}>{blog.createdAt.substring(0, 10)}</td>
                                    <td className="p-3">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => navigate(`/admin/blog/${blog._id}/edit`)}
                                            >
                                                <FaEdit size={12} />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => deleteHandler(blog._id)}
                                            >
                                                <FaTrash size={12} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default BlogListScreen;
