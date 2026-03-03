import React, { useContext, useEffect, useReducer } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import { Store } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false };
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

const ProductListScreen = () => {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;
    const [
        { loading, error, products, loadingCreate, loadingDelete, successDelete },
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
            return;
        }
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get('/api/products');
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: err.message,
                });
            }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
    }, [userInfo, successDelete, navigate]);

    const deleteHandler = async (product) => {
        if (window.confirm('Are you sure?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST' });
                await axios.delete(`/api/products/${product._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'DELETE_SUCCESS' });
                toast.success('Product deleted successfully');
            } catch (err) {
                dispatch({ type: 'DELETE_FAIL' });
                toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
            }
        }
    };

    return (
        <Container fluid className="px-4 py-4 mt-2">

            <div className="bg-white rounded shadow-sm border p-4">
                <Row className="align-items-center mb-4 gy-3">
                    <Col xs={12} sm={6}>
                        <h2 className="fw-bold mb-0" style={{ color: '#333' }}>Products</h2>
                    </Col>
                    <Col xs={12} sm={6} className="text-sm-end">
                        <Button
                            style={{ backgroundColor: '#FF8717', border: 'none', padding: '10px 20px', fontSize: '14px', fontWeight: '600' }}
                            onClick={() => navigate('/admin/product/add')}
                            className="w-50 w-sm-auto"
                        >
                            + Create Product
                        </Button>
                    </Col>
                </Row>

                {loadingDelete && <div>Loading...</div>}
                {loadingCreate && <div>Loading...</div>}
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className='alert alert-danger'>{error}</div>
                ) : (
                    <div className="overflow-hidden">
                        <Table responsive hover className="mb-0 align-middle border-0">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eee' }}>
                                    <th className="py-3 text-muted fw-semibold d-none d-md-table-cell" style={{ fontSize: '12px' }}>ID</th>
                                    <th className="py-3 text-muted fw-semibold" style={{ fontSize: '12px' }}>NAME</th>
                                    <th className="py-3 text-muted fw-semibold" style={{ fontSize: '12px' }}>PRICE</th>
                                    <th className="py-3 text-muted fw-semibold d-none d-lg-table-cell" style={{ fontSize: '12px' }}>CATEGORY</th>
                                    <th className="py-3 text-muted fw-semibold d-none d-xl-table-cell" style={{ fontSize: '12px' }}>BRAND</th>
                                    <th className="py-3 text-muted fw-semibold text-end pe-4" style={{ fontSize: '13px' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                        <td className="py-3 text-muted d-none d-md-table-cell" style={{ fontSize: '12px' }}>
                                            {product._id.substring(0, 8)}...
                                        </td>
                                        <td className="py-3 fw-bold" style={{ fontSize: '14px', color: '#444' }}>
                                            {product.name}
                                        </td>
                                        <td className="py-3 fw-bold" style={{ fontSize: '14px', color: '#444' }}>
                                            ${product.price}
                                        </td>
                                        <td className="py-3 fw-normal d-none d-lg-table-cell" style={{ fontSize: '14px', color: '#444' }}>
                                            {product.category}
                                        </td>
                                        <td className="py-3 fw-normal d-none d-xl-table-cell" style={{ fontSize: '14px', color: '#444' }}>
                                            {product.brand}
                                        </td>
                                        <td className="py-3 text-end pe-4 d-flex justify-content-center gap-2 ">
                                            <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                <Button
                                                    variant="link"
                                                    className="text-decoration-none me-2 px-3 py-1 rounded edit-btn"

                                                >
                                                    Edit
                                                </Button>
                                            </LinkContainer>
                                            <Button
                                                variant="link"
                                                className="text-decoration-none text-danger px-3 py-1 rounded"
                                                style={{ backgroundColor: '#FFEBEE', fontSize: '13px', fontWeight: '600', minWidth: '70px' }}
                                                onClick={() => deleteHandler(product)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>
            <style>{`
                .table > :not(caption) > * > * {
                    border-bottom-width: 0;
                }
                .table tr:hover {
                    background-color: #fcfdfd;
                }
                h2 {
                    letter-spacing: -0.5px;
                }
                .edit-btn {
                  background-color: #FFF3E0;
                  color: #FF8717;
                  fontSize: 10px !important;
                  fontWeight: 600;
                }
                  .edit-btn:hover {
    background-color: #FFF3E0 !important;
    color: #FF8717 !important;
    text-decoration: none !important;
    opacity: 0.9; 
}
            `}</style>
        </Container>
    );
};

export default ProductListScreen;
