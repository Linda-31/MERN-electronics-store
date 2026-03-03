import Slider from 'react-slick';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaWifi, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { BiLock } from 'react-icons/bi';

const FeaturedSection = () => {
    const NextArrow = ({ onClick }) => (
        <div className="custom-arrow next-arrow" onClick={onClick}>
            <FaChevronRight />
        </div>
    );

    const PrevArrow = ({ onClick }) => (
        <div className="custom-arrow prev-arrow" onClick={onClick}>
            <FaChevronLeft />
        </div>
    );

    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    const slides = [
        {
            title: 'WEEKEND DISCOUNT',
            name: 'Hi-Res Audio \n Wireless Supported',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
            features: [
                { icon: <FaWifi />, label: 'WIRELESS', subLabel: 'BIKE' },
                { icon: <BiLock />, label: 'SMART', subLabel: 'LOCK' },
                { icon: <MdLocationOn />, label: 'ACTIVE', subLabel: 'GPS' },
            ],
            price: '$1699.00',
            image: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/product-2.png',
            discount: 'Enjoy 15% off your first order.',
            badge: 'HOT SALE',
        },
        {
            title: 'WEEKEND DISCOUNT',
            name: 'Hi-Res Audio \n Wireless Supported',
            description: 'Experience pure sound with our latest high-resolution audio technology for an immersive listening experience.',
            features: [
                { icon: <FaWifi />, label: 'WIRELESS', subLabel: 'AUDIO' },
                { icon: <BiLock />, label: 'SECURE', subLabel: 'LINK' },
                { icon: <MdLocationOn />, label: 'ACTIVE', subLabel: 'ON' },
            ],
            price: '$339.99',
            image: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/product-2.png',
            discount: 'Limited time offer: Free shipping included.',
            badge: 'NEW ARRIVAL',
        },
        {
            title: 'WEEKEND DISCOUNT',
            name: 'Hi-Res Audio \n Wireless Supported',
            description: 'Keep your home safe with 4K resolution and real-time alerts directly to your smartphone.',
            features: [
                { icon: <FaWifi />, label: 'WIFI', subLabel: '6' },
                { icon: <BiLock />, label: 'ENCRYPT', subLabel: 'SYS' },
                { icon: <MdLocationOn />, label: 'ACTIVE', subLabel: 'MAP' },
            ],
            price: '$249.00',
            image: 'https://themexriver.com/wp/radios/wp-content/uploads/2023/05/product-2.png',
            discount: 'Save 20% when you buy a pack of three.',
            badge: 'BEST SELLER',
        }
    ];

    return (
        <section className="featured-section-new" style={{ padding: '80px 0', overflow: 'hidden' }}>
            <style>{`
                .featured-section-new .slick-list {
                    overflow: visible;
                }
                .capsule-bg {
                    background-color: #ffeaeeff;
                    border-radius: 50% / 100%;
                    padding: 60px 80px;
                    position: relative;
                    min-height: 450px;
                    display: flex;
                    align-items: center;
                    border-radius: 250px;
                }
                .product-image-featured {
                    position: absolute;
                    left: 50%;
                    bottom: -30px;
                    transform: translateX(-50%);
                    max-height: 550px;
                    z-index: 2;
                }
                .feature-icon-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .icon-circle {
                    width: 35px;
                    height: 35px;
                    background: #333;
                    color: #fff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                }
                .feature-text {
                    font-size: 11px;
                    font-weight: 700;
                    line-height: 1.2;
                    color: #333;
                }
                .hot-badge {
                    background-color: #FFD200;
                    color: #000;
                    padding: 4px 15px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                    display: inline-block;
                    margin-bottom: 20px;
                }
                .featured-price {
                    font-size: 42px;
                    font-weight: 800;
                    color: #333;
                    margin-bottom: 5px;
                }
                .custom-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 45px;
                    height: 45px;
                    background: #fff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    cursor: pointer;
                    z-index: 10;
                    transition: all 0.3s;
                }
                .custom-arrow:hover {
                    background: #FF8717;
                    color: #fff;
                }
                .prev-arrow { left: -60px; }
                .next-arrow { right: -60px; }
                
                @media (max-width: 991px) {
                    .capsule-bg {
                        border-radius: 50px;
                        padding: 40px;
                        flex-direction: column;
                        text-align: center;
                    }
                    .product-image-featured {
                        position: relative;
                        transform: none;
                        left: 0;
                        bottom: 0;
                        margin: 20px 0;
                        max-height: 300px;
                    }
                    .custom-arrow { display: none !important; }
                    .prev-arrow { left: 10px; }
                    .next-arrow { right: 10px; }
                }
            `}</style>

            <Container>
                <div style={{ position: 'relative' }}>
                    <Slider {...settings}>
                        {slides.map((slide, index) => (
                            <div key={index} className="py-4">
                                <div className="capsule-bg">
                                    <Row className="w-100 align-items-center">
                                        <Col lg={5} md={12}>
                                            <div className="ps-lg-4 text-start">
                                                <small style={{ color: '#666', fontWeight: '600', letterSpacing: '1px' }}>{slide.title}</small>
                                                <h2 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.1', margin: '15px 0', color: '#1a1a1a', whiteSpace: 'pre-line' }}>
                                                    {slide.name}
                                                </h2>
                                                <div style={{ width: '80%', height: '1px', backgroundColor: '#e0e0e0', margin: '20px 0' }}></div>
                                                <p style={{ color: '#666', fontSize: '14px', maxWidth: '400px', marginBottom: '30px' }}>
                                                    {slide.description}
                                                </p>

                                                <div className="d-flex gap-4">
                                                    {slide.features.map((feat, fIdx) => (
                                                        <div key={fIdx} className="feature-icon-item">
                                                            <div className="icon-circle">{feat.icon}</div>
                                                            <div className="feature-text">
                                                                {feat.label}<br />{feat.subLabel}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Col>

                                        <Col lg={2} className="d-none d-lg-block">
                                            {/* Spacer for product image */}
                                        </Col>

                                        <Col lg={5} md={12}>
                                            <div className="ps-lg-5 text-start">
                                                <div className="hot-badge">{slide.badge}</div>
                                                <div className="featured-price">{slide.price}</div>
                                                <p style={{ color: '#555', fontSize: '15px', marginBottom: '25px' }}>{slide.discount}</p>
                                                <Link to="/shop">
                                                    <Button style={{
                                                        backgroundColor: '#262626',
                                                        borderColor: '#262626',
                                                        borderRadius: '30px',
                                                        padding: '12px 45px',
                                                        fontWeight: '700',
                                                        fontSize: '14px'
                                                    }}>
                                                        Shop Now
                                                    </Button>
                                                </Link>
                                            </div>
                                        </Col>
                                    </Row>

                                    <img
                                        src={slide.image}
                                        alt={slide.name}
                                        className="product-image-featured d-none d-lg-block"
                                    />
                                </div>
                                {/* Mobile Image */}
                                <div className="d-lg-none text-center mt-3">
                                    <img src={slide.image} alt={slide.name} style={{ maxHeight: '250px' }} />
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </Container>
        </section>
    );
};

export default FeaturedSection;
