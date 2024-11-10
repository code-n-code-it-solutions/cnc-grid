/**
 * Developed By Suhaib
 */
import React, { createContext, useContext, useState } from 'react';

interface GridContextProps {
    selectedRows: any[];
    setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>;
    filterText: string;
    setFilterText: React.Dispatch<React.SetStateAction<string>>;
}

const GridContext = createContext<GridContextProps | undefined>(undefined);

export const GridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [filterText, setFilterText] = useState("");

    return (
        <GridContext.Provider value={{ selectedRows, setSelectedRows, filterText, setFilterText }}>
            {children}
        </GridContext.Provider>
    );
};

export const useGridContext = () => {
    const context = useContext(GridContext);
    if (!context) {
        throw new Error('useGridContext must be used within a GridProvider');
    }
    return context;
};
