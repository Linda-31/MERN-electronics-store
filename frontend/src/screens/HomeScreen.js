import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Product from '../components/Product';
import axios from 'axios';
import HeroCarousel from '../components/HeroCarousel';
import CategorySection from '../components/CategorySection';
import FeaturedSection from '../components/FeaturedSection';
import DealsSection from '../components/DealsSection';
import OnlineStoreSection from '../components/OnlineStoreSection';
import PromoBannerSection from '../components/PromoBannerSection';
import WaterproofBanner from '../components/WaterproofBanner';
import TestimonialsSection from '../components/TestimonialsSection';
import ProductsShowcaseSection from '../components/ProductsShowcaseSection';
import BrandSection from '../components/BrandSection';
import RecentlyViewedSection from '../components/RecentlyViewedSection';
import SubscriptionSection from '../components/SubscriptionSection';

const HomeScreen = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await axios.get('/api/products');
            setProducts(data);
        };

        fetchProducts();
    }, []);

    /* ── Initialise AOS once on mount ─────────────────────── */
    useEffect(() => {
        if (window.AOS) {
            window.AOS.init({
                duration: 700,      // animation duration in ms
                easing: 'ease-in-out',
                once: false,        // animate every time element enters viewport
                mirror: true,       // animate out when scrolling past
                offset: 80,         // trigger 80px before element comes into view
            });
        }
    }, []);

    return (
        <div className="home-screen">


            <HeroCarousel />


            <div>
                <CategorySection />
            </div>


            <div >
                <FeaturedSection />
            </div>


            <div data-aos="fade-left" data-aos-duration="1000">
                <DealsSection products={products} />
            </div>


            <div data-aos="fade-right" data-aos-duration="1000">
                <OnlineStoreSection />
            </div>


            <div data-aos="zoom-in" data-aos-delay="0" data-aos-duration="800">
                <PromoBannerSection />
            </div>


            <Container style={{ marginTop: '40px', marginBottom: '40px' }}>
                <h2
                    style={{ marginBottom: '20px', fontWeight: 'bold' }}
                    data-aos="fade-up"
                    data-aos-delay="0"
                >
                    Latest Products
                </h2>
                <Row className="g-4">
                    {products.slice(0, 8).map((product, index) => (
                        <Col
                            key={product._id}
                            sm={12}
                            md={6}
                            lg={4}
                            xl={3}
                            data-aos="fade-up"
                            data-aos-delay={String((index % 4) * 150)}
                            data-aos-offset="50"
                        >
                            <Product product={product} />
                        </Col>
                    ))}
                </Row>
            </Container>


            <div >
                <WaterproofBanner />
            </div>


            <div data-aos="fade-up" data-aos-duration="900">
                <TestimonialsSection />
            </div>


            <div>
                <ProductsShowcaseSection />
            </div>


            <div data-aos="zoom-in" data-aos-delay="0" data-aos-duration="800">
                <BrandSection />
            </div>


            <div>
                <RecentlyViewedSection />
            </div>


            <div >
                <SubscriptionSection />
            </div>

        </div>
    );
};

export default HomeScreen;
