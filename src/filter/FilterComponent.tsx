/**
 * Developed By Suhaib
 */
import React from 'react';
import Input from "../components/Input";

interface FilterProps {
    onFilterChange: (value: string) => void;
}

const FilterComponent: React.FC<FilterProps> = ({ onFilterChange }) => {
    return (
        <Input
            type="text"
            placeholder="Filter..."
            onChange={(e) => onFilterChange(e.target.value)}
        />
    );
};

export default FilterComponent;
