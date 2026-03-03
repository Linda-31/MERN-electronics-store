import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    const steps = [
        { name: 'Sign In', active: step1, link: '/login' },
        { name: 'Shipping', active: step2, link: '/shipping' },
        { name: 'Payment', active: step3, link: '/payment' },
        { name: 'Place Order', active: step4, link: '/placeorder' },
    ];

    return (
        <div className='checkout-steps-container mb-5'>
            <div className='checkout-steps-wrapper d-flex align-items-center justify-content-between'>
                {steps.map((s, index) => (
                    <React.Fragment key={index}>
                        {s.active ? (
                            <LinkContainer to={s.link} style={{ cursor: 'pointer' }}>
                                <div className='step-item active'>
                                    <div className='step-circle'>
                                        {index + 1}
                                    </div>
                                    <span className='step-name'>{s.name}</span>
                                </div>
                            </LinkContainer>
                        ) : (
                            <div className='step-item'>
                                <div className='step-circle'>
                                    {index + 1}
                                </div>
                                <span className='step-name'>{s.name}</span>
                            </div>
                        )}
                        {index < steps.length - 1 && (
                            <div className={`step-line ${steps[index + 1]?.active ? 'active' : ''}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <style>{`
                .checkout-steps-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px 0;
                }
                .checkout-steps-wrapper {
                    position: relative;
                }
                .step-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    z-index: 2;
                    text-decoration: none !important;
                }
                .step-item.active {
                    cursor: pointer;
                }
                .step-circle {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    background-color: #f0f0f0;
                    color: #999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 14px;
                    border: 2px solid #ebebeb;
                    margin-bottom: 8px;
                    transition: all 0.3s ease;
                }
                .step-name {
                    font-size: 13px;
                    font-weight: 600;
                    color: #999;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .step-line {
                    flex: 1;
                    height: 2px;
                    background-color: #ebebeb;
                    margin: 0 15px;
                    margin-top: -25px;
                    position: relative;
                    z-index: 1;
                }
                
                /* Active / Completed States */
                .step-item.active .step-circle {
                    background-color: #FF8717;
                    color: #fff;
                    border-color: #FF8717;
                    box-shadow: 0 0 15px rgba(255, 135, 23, 0.3);
                }
                .step-item.active .step-name {
                    color: #FF8717;
                }
                .step-line.active {
                    background-color: #FF8717;
                }
                
                .step-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 3;
                }

                @media (max-width: 576px) {
                    .step-name {
                        font-size: 10px;
                    }
                    .step-circle {
                        width: 30px;
                        height: 30px;
                        font-size: 12px;
                    }
                }
            `}</style>
        </div>
    );
};

export default CheckoutSteps;
