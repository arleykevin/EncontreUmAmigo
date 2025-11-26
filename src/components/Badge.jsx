import React from 'react';

const Badge = ({ children, color = "blue" }) => {
    const colors = {
        blue: "bg-blue-100 text-blue-800",
        green: "bg-green-100 text-green-800",
        purple: "bg-purple-100 text-purple-800",
        orange: "bg-orange-100 text-orange-800",
        indigo: "bg-indigo-100 text-indigo-800",
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[color] || colors.blue}`}>
            {children}
        </span>
    );
};

export default Badge;