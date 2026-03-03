import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color }) => {
    return (
        <div className='rating'>
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                    <span style={{ color: color || '#FFD700' }}>
                        {value >= star ? (
                            <FaStar style={{ color: color || '#FFD700' }} />
                        ) : value >= star - 0.5 ? (
                            <FaStarHalfAlt style={{ color: color || '#FFD700' }} />
                        ) : (
                            <FaRegStar style={{ color: color || '#FFD700' }} />
                        )}
                    </span>
                </span>
            ))}
            {text && <span className='ms-2 rating-text' style={{ fontSize: '12px', color: '#666' }}>{text}</span>}
        </div>
    );
};

Rating.defaultProps = {
    color: '#FFD700',
};

export default Rating;
