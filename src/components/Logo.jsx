import React from 'react';

const Logo = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="35"
            height="35"
            role="img"
            aria-label="Travel Advisor Logo"
        >
            <path
                d="M32 272l128 48 16 160 80-112 112 112L480 32 32 272z"
                fill="#000000"
            />
            <path
                d="M350.7 417.4L256 320l128-176-192 153.8-82.6-31 322-172.5-80.7 323.1z"
                fill="#ffffff"
            />
        </svg>
    </div>
);

export default Logo;