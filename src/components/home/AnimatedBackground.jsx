import React from 'react';

const defaultRings = [
    {
        size: "min(95vw, 1000px)",
        borderColor: "border-primary/20",
        spinClass: "animate-[spin_40s_linear_infinite]",
        balls: [
            { position: "-top-[5px] left-1/2 -translate-x-1/2", size: 10, color: "bg-primary", shadow: "shadow-[0_0_20px_5px_#914be2]" },
            { position: "-bottom-[3px] left-1/2 -translate-x-1/2", size: 6, color: "bg-primary/60", shadow: "shadow-[0_0_15px_2px_#914be2]" },
        ]
    },
    {
        size: "min(70vw, 700px)",
        borderColor: "border-secondary/20",
        spinClass: "animate-[spin_25s_linear_infinite_reverse]",
        balls: [
            { position: "top-1/2 -left-[5px] -translate-y-1/2", size: 10, color: "bg-secondary", shadow: "shadow-[0_0_20px_5px_#4b6ce2]" },
            { position: "top-1/2 -right-[3px] -translate-y-1/2", size: 6, color: "bg-secondary/80", shadow: "shadow-[0_0_15px_3px_#4b6ce2]" },
        ]
    },
    {
        size: "min(40vw, 400px)",
        borderColor: "border-primary/15",
        spinClass: "animate-[spin_15s_linear_infinite]",
        balls: [
            { position: "-bottom-[4px] left-1/2 -translate-x-1/2", size: 8, color: "bg-primary", shadow: "shadow-[0_0_15px_3px_#914be2]" },
        ]
    }
];

const AnimatedBackground = ({ rings = defaultRings }) => {
    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-dot-pattern opacity-50"></div>
            
            {/* Glow effects */}
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float opacity-80"></div>
            <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[120px] animate-float-delayed opacity-80"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]"></div>

            {/* Animated Rings */}
            {rings.map((ring, idx) => {
                const ringSize = typeof ring.size === 'number' ? `${ring.size}px` : ring.size;
                return (
                    <div 
                        key={idx} 
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border rounded-full flex items-center justify-center ${ring.borderColor}`}
                        style={{ width: ringSize, height: ringSize }}
                    >
                        <div className={`w-full h-full relative ${ring.spinClass}`}>
                            {ring.balls.map((ball, ballIdx) => (
                                <div 
                                    key={ballIdx} 
                                    className={`absolute rounded-full ${ball.position} ${ball.color} ${ball.shadow}`}
                                    style={{ width: `${ball.size}px`, height: `${ball.size}px` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AnimatedBackground;
