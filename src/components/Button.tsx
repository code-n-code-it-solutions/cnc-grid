/**
 * Developed By Suhaib
 */

import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}

const Button: React.FC<ButtonProps> = (props) => {
    return (
        <button
            {...props}
            className={`px-3 py-1 mx-1 ${props.className}`}
        >
            {props.children}
        </button>
    );
}

export default Button;
