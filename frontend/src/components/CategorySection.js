import React from 'react';
import Slider from 'react-slick';
import { Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CategorySection = () => {
    const settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 7000,
        cssEase: 'linear',
        slidesToShow: 5,
        slidesToScroll: 1,
        pauseOnHover: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const categories = [
        {
            name: 'Laptops Cell \n Tablets',
            image: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/feature-1.png',
            link: '/search?category=laptops',
            bgColor: '#E8F0FE', // Light blue
        },
        {
            name: 'SmartPhones \n & GPS',
            image: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/feature-2.png',
            link: '/search?category=smartphones',
            bgColor: '#FFE4E8', // Light pink
        },
        {
            name: 'Desktop \n Computers',
            image: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/feature-3.png',
            link: '/search?category=computers',
            bgColor: '#E8F8E8', // Light green
        },
        {
            name: 'Peripheral \n Devices',
            image: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/feature-5.png',
            link: '/search?category=peripherals',
            bgColor: '#F0E8F8', // Light purple
        },
        {
            name: 'Game \n Consoles',
            image: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/feature-4.png',
            link: '/search?category=consoles',
            bgColor: '#FFF8E0', // Light yellow
        },
        {
            name: 'Cameras \n & Audio',
            image: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/feature-1.png', // Reusing image
            link: '/search?category=cameras',
            bgColor: '#FFE4E8', // Light pink
        },
    ];

    return (
        <div className='category-section' style={{ padding: '20px 0', backgroundColor: '#f9f9f9' }}>
            <style>{`
                .category-card {
                    transition: all 0.3s ease-in-out !important;
                }
                .category-card img {
                    transition: transform 0.5s ease-in-out !important;
                }
                .category-card:hover img {
                    transform: scaleX(-1);
                }
            `}</style>
            <Container fluid>
                <Slider {...settings}>
                    {categories.map((cat, index) => (
                        <div key={index} style={{ padding: '0 10px' }}>
                            <Link to={cat.link} style={{ textDecoration: 'none' }}>
                                <Card
                                    className="border-0 shadow-sm category-card"
                                    style={{
                                        borderRadius: '90px',
                                        overflow: 'hidden',
                                        textAlign: 'center',
                                        margin: '0 10px',
                                        height: '250px',
                                        backgroundColor: cat.bgColor,
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <Card.Body style={{ padding: '30px 10px' }}>
                                        <div style={{ marginBottom: '15px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={cat.image} alt={cat.name} style={{ maxHeight: '100%', maxWidth: '100%' }} />
                                        </div>
                                        <Card.Title style={{ fontSize: '1rem', fontWeight: 'bold', color: '#333', whiteSpace: 'pre-line' }}>
                                            {cat.name}
                                        </Card.Title>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </Container>
        </div>
    );
};

export default CategorySection;
