/**
 * Developed By Suhaib
 */

import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}

const Input: React.FC<InputProps> = (props) => {
    return (
        <input
            {...props}
            className={`border border-gray-300 rounded p-2 ${props.className}`}
        />
    );
}

export default Input;
