import React from 'react';
import Slider from 'react-slick';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const HeroCarousel = () => {
    // Custom arrow components
    const NextArrow = ({ onClick }) => (
        <div
            onClick={onClick}
            style={{
                position: 'absolute',
                right: '30px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 135, 23, 0.9)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
        >
            <FaChevronRight style={{ color: 'white', fontSize: '20px' }} />
        </div>
    );

    const PrevArrow = ({ onClick }) => (
        <div
            onClick={onClick}
            style={{
                position: 'absolute',
                left: '30px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 135, 23, 0.9)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
        >
            <FaChevronLeft style={{ color: 'white', fontSize: '20px' }} />
        </div>
    );

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    const slides = [
        {
            id: 1,
            title: 'Weekend Discount',
            heading: 'Hi-Res Audio \n Wireless Supported',
            price: '$339.99',
            image: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/product-1.png',
            bg: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/slider-bg.jpg',
        },
        {
            id: 2,
            title: 'Weekend Discount',
            heading: 'Smart Home \n Security Camera',
            price: '$120.00',
            image: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/product-2.png', // Placeholder, reusing/guessing
            bg: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/slider-bg.jpg',
        },
          {
            id: 3,
            title: 'Weekend Discount',
            heading: 'Hi-Res Audio \n Wireless Supported',
            price: '$339.99',
            image: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/product-1.png',
            bg: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/slider-bg.jpg',
        },
      
    ];

    return (
        <div className='hero-slider' style={{ overflow: 'hidden' }}>
            <Slider {...settings}>
                {slides.map((slide) => (
                    <div key={slide.id}>
                        <div
                            className='d-flex align-items-center'
                            style={{
                                backgroundImage: `url(${slide.bg})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                minHeight: '600px',
                                padding: '50px 0',
                            }}
                        >
                            <Container>
                                <Row className='align-items-center'>
                                    <Col md={6} className='order-md-2'>
                                        <img
                                            src={slide.image}
                                            alt={slide.heading}
                                            className='img-fluid'
                                            style={{ maxHeight: '450px', animation: 'fadeInRight 1s' }}
                                        />
                                    </Col>
                                    <Col md={6} className='order-md-1'>
                                        <div style={{ padding: '20px' }}>
                                            <div data-aos="fade-right" data-aos-delay="100"
                                                style={{
                                                    color: '#FF8717',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 'bold',
                                                    letterSpacing: '2px',
                                                    marginBottom: '10px',
                                                }}
                                            >
                                                {slide.title}
                                            </div>
                                            <h1 data-aos="fade-right" data-aos-delay="80"
                                                style={{
                                                    fontSize: '3.5rem',
                                                    fontWeight: '800',
                                                    lineHeight: '1.2',
                                                    marginBottom: '20px',
                                                    whiteSpace: 'pre-line',
                                                    color: 'white'
                                                }}
                                            >
                                                {slide.heading}
                                            </h1>
                                            <div data-aos="fade-right" data-aos-delay="60"
                                                style={{
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold',
                                                    color: '#fff',
                                                    marginBottom: '30px',
                                                }}
                                            >
                                                {slide.price}
                                            </div>
                                            <Link to='/search'>
                                                <Button data-aos="fade-right" data-aos-delay="40"
                                                    variant='primary'
                                                    size='lg'
                                                    style={{
                                                        backgroundColor: '#FF8717',
                                                        borderColor: '#FF8717',
                                                        padding: '12px 30px',
                                                        fontWeight: 'bold',
                                                        textTransform: 'uppercase',
                                                        borderRadius: '30px',
                                                    }}
                                                >
                                                    Shop Now
                                                </Button>
                                            </Link>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HeroCarousel;
