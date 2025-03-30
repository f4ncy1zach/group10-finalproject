// Logo component
const TravelIcon = ({ size = 24 }) => {
    const viewBoxSize = 128
    const width = size
    const height = size

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ minWidth: width, minHeight: height, maxWidth: width, maxHeight: height }}
        >
            <defs>
                <radialGradient id="globeGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#8ff9d0" />
                    <stop offset="100%" stopColor="#6abed3" />
                </radialGradient>
                <linearGradient id="pinGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#b1a8f5" />
                    <stop offset="100%" stopColor="#6e5cf5" />
                </linearGradient>
            </defs>

            {/* Globe */}
            <circle cx="64" cy="64" r="36" fill="url(#globeGradient)" stroke="#6e5cf5" strokeWidth="3" />
            <ellipse cx="64" cy="64" rx="32" ry="12" stroke="#ffffff" strokeWidth="1.5" />
            <ellipse cx="64" cy="64" rx="12" ry="32" stroke="#ffffff" strokeWidth="1.5" />

            {/* Location Pin */}
            <path
                d="M64 22C76 22 85 32 85 44C85 59 64 86 64 86C64 86 43 59 43 44C43 32 52 22 64 22Z"
                fill="url(#pinGradient)"
                stroke="#6e5cf5"
                strokeWidth="2"
            />
            <circle cx="64" cy="44" r="6" fill="white" />

            {/* Paper Plane */}
            <path d="M100 28L58 64L72 70L74 88L82 68L100 28Z" fill="#ffffff" stroke="#6e5cf5" strokeWidth="2" />
        </svg>
    )
}

export default TravelIcon