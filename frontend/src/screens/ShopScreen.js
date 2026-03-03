import React, { useEffect, useReducer, useState } from 'react';
import { Row, Col, Container, Form, Pagination } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Product from '../components/Product';
import { FaThLarge, FaTh, FaList, FaSearch, FaAngleDoubleRight } from 'react-icons/fa';
import '../Style/ShopScreen.css';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                countProducts: action.payload.countProducts,
                loading: false,
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const ShopScreen = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const category = sp.get('category') || 'all';
    const query = sp.get('query') || 'all';
    const price = sp.get('price') || 'all';
    const rating = sp.get('rating') || 'all';
    const order = sp.get('order') || 'newest';
    const page = sp.get('page') || 1;

    const [{ loading, error, products, pages, countProducts }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`/api/products/categories`);
                setCategories(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(
                    `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
                );
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        };
        fetchData();
    }, [category, error, order, page, price, query, rating]);

    const getFilterUrl = (filter) => {
        const filterPage = filter.page || page;
        const filterCategory = filter.category || category;
        const filterQuery = filter.query || query;
        const filterRating = filter.rating || rating;
        const filterPrice = filter.price || price;
        const sortOrder = filter.order || order;
        return `/shop?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
    };

    const [gridCols, setGridCols] = useState(4); // default 4 columns

    return (
        <div className="shop-page-wrapper pb-80">
            {/* Breadcrumb */}
            <section className="breadcrumb-area">
                <Container>
                    <div className="radios-breadcrumb">
                        <ul className="list-unstyled d-flex align-items-center">
                            <li><Link to="/">Home</Link></li>
                            <li className="active">Shop</li>
                        </ul>
                    </div>
                </Container>
            </section>

            <Container>
                <Row>
                    {/* Main Content */}
                    <Col lg={9} className="order-lg-2">
                        <div className="shop-area">
                            <div className="woocommerce-toolbar-top d-flex justify-content-between align-items-center mb-3">
                                <p className="woocommerce-result-count mb-0">
                                    Showing {products?.length} of {countProducts} results
                                </p>

                                <div className="d-flex align-items-center">
                                    <div className="products-sizes mr-20 d-flex">
                                        <button className={`size-btn ${gridCols === 4 ? 'active' : ''}`} onClick={() => setGridCols(4)}>
                                            <FaTh />
                                        </button>
                                        <button className={`size-btn ${gridCols === 3 ? 'active' : ''}`} onClick={() => setGridCols(3)}>
                                            <FaThLarge />
                                        </button>
                                        <button className={`size-btn ${gridCols === 1 ? 'active' : ''}`} onClick={() => setGridCols(1)}>
                                            <FaList />
                                        </button>
                                    </div>

                                    <div className="woocommerce-ordering">
                                        <Form.Select
                                            value={order}
                                            onChange={(e) => navigate(getFilterUrl({ order: e.target.value }))}
                                            className="orderby"
                                        >
                                            <option value="newest">Default sorting</option>
                                            <option value="lowest">Price: Low to High</option>
                                            <option value="highest">Price: High to Low</option>
                                            <option value="toprated">Avg. Customer Review</option>
                                        </Form.Select>
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <div>Loading...</div>
                            ) : error ? (
                                <div className="alert alert-danger">{error}</div>
                            ) : (
                                <>
                                    <Row>
                                        {products.length === 0 && (
                                            <Col>No Product Found</Col>
                                        )}
                                        {products.map((product) => (
                                            <Col key={product._id} sm={gridCols === 1 ? 12 : 6} md={gridCols === 4 ? 3 : gridCols === 3 ? 4 : 12} className="mb-4">
                                                <Product product={product} showDetails={gridCols === 1} />
                                            </Col>
                                        ))}
                                    </Row>

                                    {/* Pagination */}
                                    <div className="woocommerce-pagination mt-40">
                                        <Pagination className="justify-content-center">
                                            {[...Array(pages).keys()].map((x) => (
                                                <Pagination.Item
                                                    key={x + 1}
                                                    active={x + 1 === Number(page)}
                                                    onClick={() => navigate(getFilterUrl({ page: x + 1 }))}
                                                >
                                                    {x + 1}
                                                </Pagination.Item>
                                            ))}
                                            {page < pages && (
                                                <Pagination.Next onClick={() => navigate(getFilterUrl({ page: Number(page) + 1 }))}>
                                                    <FaAngleDoubleRight />
                                                </Pagination.Next>
                                            )}
                                        </Pagination>
                                    </div>
                                </>
                            )}
                        </div>
                    </Col>

                    {/* Sidebar */}
                    <Col lg={3} className="order-lg-1">
                        <div className="shop-sidebar">
                            {/* Search Widget */}
                            <div className="widget mb-40">
                                <h2 className="widget__title"><span>Search</span></h2>
                                <Form className="widget__search" onSubmit={(e) => {
                                    e.preventDefault();
                                    navigate(getFilterUrl({ query: e.target.search.value }));
                                }}>
                                    <Form.Control type="text" name="search" placeholder="Search..." />
                                    <button type="submit"><FaSearch /></button>
                                </Form>
                            </div>

                            {/* Price Filter Widget */}
                            <div className="widget mb-40">
                                <h2 className="widget__title"><span>Filter by price</span></h2>
                                <div className="price_slider_wrapper">
                                    <ul className="list-unstyled price-filters">
                                        <li><Link to={getFilterUrl({ price: 'all' })} className={price === 'all' ? 'active' : ''}>Any</Link></li>
                                        <li><Link to={getFilterUrl({ price: '1-50' })} className={price === '1-50' ? 'active' : ''}>$1 to $50</Link></li>
                                        <li><Link to={getFilterUrl({ price: '51-200' })} className={price === '51-200' ? 'active' : ''}>$51 to $200</Link></li>
                                        <li><Link to={getFilterUrl({ price: '201-1000' })} className={price === '201-1000' ? 'active' : ''}>$201 to $1000</Link></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Categories Widget */}
                            <div className="widget mb-40">
                                <h2 className="widget__title"><span>Product categories</span></h2>
                                <ul className="product-categories list-unstyled">
                                    <li><Link to={getFilterUrl({ category: 'all' })} className={category === 'all' ? 'active' : ''}>All</Link></li>
                                    {categories.map((c) => (
                                        <li key={c}>
                                            <Link to={getFilterUrl({ category: c })} className={category === c ? 'active' : ''}>
                                                {c}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Brand/Color Filter or Tags Widget */}
                            <div className="widget mb-40">
                                <h2 className="widget__title"><span>Product tags</span></h2>
                                <div className="tagcloud">
                                    <Link to={getFilterUrl({ query: 'monitor' })}>Monitor</Link>
                                    <Link to={getFilterUrl({ query: 'television' })}>Television</Link>
                                    <Link to={getFilterUrl({ query: 'smart' })}>Smart Device</Link>
                                    <Link to={getFilterUrl({ query: 'watch' })}>Watch</Link>
                                </div>
                            </div>

                            {/* Ad Widget */}
                            <div className="widget ad-widget">
                                <Link to="#">
                                    <img src="https://themexriver.com/wp/radios/wp-content/uploads/2022/09/Group-21441.jpg" alt="Ad" className="img-fluid" />
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ShopScreen;
