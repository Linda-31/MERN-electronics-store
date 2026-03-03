import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../Style/PaymentSuccessScreen.css';

const PaymentSuccessScreen = () => {
    const { orderId } = useParams();

    // Confetti burst on mount
    useEffect(() => {
        const container = document.getElementById('confetti-container');
        if (!container) return;

        const colors = ['#ff8717', '#ffd700', '#ff6b6b', '#51cf66', '#339af0', '#cc5de8'];
        for (let i = 0; i < 80; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = `${Math.random() * 1.5}s`;
            piece.style.width = `${6 + Math.random() * 8}px`;
            piece.style.height = `${6 + Math.random() * 8}px`;
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            container.appendChild(piece);
        }

        return () => {
            while (container.firstChild) container.removeChild(container.firstChild);
        };
    }, []);

    return (
        <div className="success-page">
            {/* Confetti */}
            <div id="confetti-container" className="confetti-container" />

            <div className="success-card">
                {/* Animated check icon */}
                <div className="success-icon-ring">
                    <svg
                        className="success-checkmark"
                        viewBox="0 0 52 52"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle className="check-circle" cx="26" cy="26" r="25" stroke="#ff8717" strokeWidth="2" />
                        <path className="check-path" d="M14.5 26.5L21.5 33.5L37.5 18" stroke="#ff8717" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <h1 className="success-heading">Payment Successful!</h1>
                <p className="success-subtext">
                    Thank you for your order. We've received your payment and are now processing your order.
                </p>

                {orderId && (
                    <div className="order-id-chip">
                        <span className="order-id-label">Order ID</span>
                        <span className="order-id-value">#{orderId.slice(-8).toUpperCase()}</span>
                    </div>
                )}

                <div className="success-steps">
                    <div className="step">
                        <div className="step-icon">📦</div>
                        <span>Order Placed</span>
                    </div>
                    <div className="step-connector" />
                    <div className="step">
                        <div className="step-icon">🔄</div>
                        <span>Processing</span>
                    </div>
                    <div className="step-connector" />
                    <div className="step">
                        <div className="step-icon">🚀</div>
                        <span>Shipped</span>
                    </div>
                    <div className="step-connector" />
                    <div className="step">
                        <div className="step-icon">🏠</div>
                        <span>Delivered</span>
                    </div>
                </div>

                <div className="success-actions">
                    {orderId && (
                        <Link to={`/order/${orderId}`} className="btn-view-order">
                            View Order Details
                        </Link>
                    )}
                    <Link to="/shop" className="btn-continue-shopping">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessScreen;
