import React, { useRef } from 'react';
import { Container } from 'react-bootstrap';
import Slider from 'react-slick';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TestimonialsSection = () => {
    const sliderRef = useRef(null);

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
        speed: 800,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    const testimonials = [
        {
            name: 'Albert Fro',
            role: 'Sale Manager',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'
        },
        {
            name: 'Stifine Fro',
            role: 'Sale Manager',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'
        },
        {
            name: 'Albert Fro',
            role: 'Sale Manager',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/women/65.jpg',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'
        },
        {
            name: 'Sarah Johnson',
            role: 'Product Manager',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/women/28.jpg',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'
        }
    ];

    return (
        <div style={{ padding: '60px 0', backgroundColor: '#f9f9f9' }}>
            <style>{`
                @media (max-width: 991px) {
                    .custom-nav-btn {
                        display: none !important;
                    }
                    .testimonial-container {
                        padding: 30px 0 !important;
                    }
                    .testimonial-title {
                        font-size: 1.8rem !important;
                    }
                }
            `}</style>
            <Container className="testimonial-container">
                <div className="text-center mb-5">
                    <div style={{
                        color: '#FF8717',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '0.9rem',
                        marginBottom: '10px',
                        letterSpacing: '1px'
                    }}>
                       Client Spotlight
                    </div>
                    <h2 className="testimonial-title" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
                        Our Good Customers
                    </h2>
                </div>

                <div style={{ position: 'relative' }}>
                    {/* Custom Navigation Arrows */}
                    <button
                        className="custom-nav-btn"
                        onClick={() => sliderRef.current?.slickPrev()}
                        style={{
                            position: 'absolute',
                            left: '-60px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            backgroundColor: '#fff',
                            border: '2px solid #e0e0e0',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FF8717';
                            e.currentTarget.style.borderColor = '#FF8717';
                            e.currentTarget.querySelector('svg').style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff';
                            e.currentTarget.style.borderColor = '#e0e0e0';
                            e.currentTarget.querySelector('svg').style.color = '#333';
                        }}
                    >
                        <FaChevronLeft style={{ color: '#333', fontSize: '18px' }} />
                    </button>

                    <button
                        className="custom-nav-btn"
                        onClick={() => sliderRef.current?.slickNext()}
                        style={{
                            position: 'absolute',
                            right: '-60px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            backgroundColor: '#fff',
                            border: '2px solid #e0e0e0',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FF8717';
                            e.currentTarget.style.borderColor = '#FF8717';
                            e.currentTarget.querySelector('svg').style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff';
                            e.currentTarget.style.borderColor = '#e0e0e0';
                            e.currentTarget.querySelector('svg').style.color = '#333';
                        }}
                    >
                        <FaChevronRight style={{ color: '#333', fontSize: '18px' }} />
                    </button>

                    <Slider ref={sliderRef} {...settings}>
                        {testimonials.map((testimonial, index) => (
                            <div key={index} style={{ padding: '0 15px' }}>
                                <div
                                    style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '15px',
                                        padding: '30px',
                                        textAlign: 'center',
                                        boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                                        transition: 'transform 0.3s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            marginBottom: '15px',
                                            objectFit: 'cover',
                                            border: '3px solid #f0f0f0'
                                        }}
                                    />
                                    <div style={{ marginBottom: '10px' }}>
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <FaStar key={i} style={{ color: '#FFD700', fontSize: '14px', marginRight: '2px' }} />
                                        ))}
                                    </div>
                                    <h5 style={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                                        {testimonial.name}
                                    </h5>
                                    <p style={{ color: '#999', fontSize: '0.85rem', marginBottom: '15px' }}>
                                        {testimonial.role}
                                    </p>
                                    <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                        {testimonial.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </Container>
        </div>
    );
};

export default TestimonialsSection;
