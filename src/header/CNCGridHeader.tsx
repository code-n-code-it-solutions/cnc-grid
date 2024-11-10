import React, { useState, useRef, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { sortData } from "../sort/SortUtils";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";

interface ColumnDef {
    headerName: string;
    field: string;
    sortable?: boolean;
    filterable?: boolean;
    width?: number;
}

interface CNCGridHeaderProps {
    colDef: ColumnDef[];
    setFilteredData: (data: any[]) => void;
    rowData: any[];
    clearFilters: boolean;  // Prop to trigger filter reset
}

const CNCGridHeader: React.FC<CNCGridHeaderProps> = ({ colDef, setFilteredData, rowData, clearFilters }) => {
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');
    const [showMenu, setShowMenu] = useState<{ index: number | null, position: { top: number, left: number } | null }>({ index: null, position: null });
    const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
    const [filterOptions, setFilterOptions] = useState<{ [key: string]: string[] }>({});
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: Set<string> }>({});
    const [searchText, setSearchText] = useState("");
    const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const initialWidths = colDef.reduce((acc, col) => {
            acc[col.field] = col.width || 150;
            return acc;
        }, {} as { [key: string]: number });
        setColumnWidths(initialWidths);
    }, [colDef]);

    useEffect(() => {
        if (clearFilters) {
            // Reset all filter states when clearFilters is true
            setSelectedFilters({});
            setSearchText('');
            setSortField(null);
            setSortDirection('ASC');
            setFilteredData(rowData);  // Reset to original data
        }
    }, [clearFilters, rowData]);

    const updateFilterOptions = () => {
        const options: { [key: string]: Set<string> } = {};
        let filteredData = rowData;

        Object.keys(selectedFilters).forEach(field => {
            if (selectedFilters[field] && selectedFilters[field].size > 0) {
                filteredData = filteredData.filter(row => selectedFilters[field].has(row[field]?.toString()));
            }
        });

        colDef.forEach(col => {
            if (col.filterable) {
                options[col.field] = new Set(filteredData.map(row => row[col.field]?.toString()));
            }
        });

        setFilterOptions(Object.fromEntries(Object.entries(options).map(([field, values]) => [field, Array.from(values)])));
    };

    useEffect(() => {
        updateFilterOptions();
    }, [selectedFilters, rowData]);

    const handleSort = (field: string) => {
        const newDirection = sortField === field && sortDirection === 'ASC' ? 'DESC' : 'ASC';
        setSortField(field);
        setSortDirection(newDirection);
        const sortedData = sortData([...rowData], field, newDirection);
        setFilteredData(sortedData);
    };

    const handleCheckboxFilter = (field: string, value: string) => {
        const updatedFilters = { ...selectedFilters };
        if (!updatedFilters[field]) {
            updatedFilters[field] = new Set();
        }
        if (updatedFilters[field].has(value)) {
            updatedFilters[field].delete(value);
        } else {
            updatedFilters[field].add(value);
        }
        setSelectedFilters(updatedFilters);
        applyFilters(updatedFilters);
    };

    const applyFilters = (filters: { [key: string]: Set<string> }) => {
        let filteredData = rowData;
        Object.keys(filters).forEach(field => {
            if (filters[field].size > 0) {
                filteredData = filteredData.filter(row => filters[field].has(row[field]?.toString()));
            }
        });
        setFilteredData(filteredData);
    };

    const handleSelectAll = (field: string, checked: boolean) => {
        const updatedFilters = { ...selectedFilters };
        updatedFilters[field] = checked ? new Set(filterOptions[field]) : new Set();
        setSelectedFilters(updatedFilters);
        applyFilters(updatedFilters);
    };

    const handleIconClick = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        const iconElement = iconRefs.current[index];
        if (iconElement) {
            const offsetTop = iconElement.offsetTop;
            const offsetLeft = iconElement.offsetLeft;
            setShowMenu({ index, position: { top: offsetTop + 25, left: offsetLeft - 192 } });
        }
    };

    const handleHideMenu = () => setShowMenu({ index: null, position: null });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                handleHideMenu();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <thead className="bg-gray-300">
        <tr>
            {colDef.map((col, index) => (
                <th key={`header-${col.field}-${index}`} className="px-4 py-2 text-left font-semibold text-gray-700 bg-gray-100 relative" style={{
                    width: columnWidths[col.field],
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'white',
                    zIndex: 2
                }}>
                    <div className={`flex items-center ${col.filterable ? 'justify-between' : 'justify-start'}`}>
                        <div className="flex items-center gap-1">
                            {col.headerName}
                            {col.sortable && sortField === col.field && (
                                <span>
                                    {sortDirection === 'ASC' ? (
                                        <Icon icon={'stash:arrow-up-light'} className="text-lg"/>
                                    ) : (
                                        <Icon icon={'stash:arrow-down-light'} className="text-lg"/>
                                    )}
                                </span>
                            )}
                        </div>

                        <div ref={(el) => { iconRefs.current[index] = el; }} className="relative">
                            <Icon icon={'mingcute:more-2-line'} className="cursor-pointer text-lg" onClick={(e) => handleIconClick(e, index)}/>
                        </div>
                    </div>

                    {showMenu.index === index && showMenu.position && (
                        <div
                            ref={menuRef}
                            className="absolute bg-white shadow-lg border border-gray-200 rounded-md z-50 p-3"
                            style={{
                                top: showMenu.position.top,
                                left: showMenu.position.left,
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <div className="font-semibold text-sm mb-2">Filter by {col.headerName}</div>
                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSort(col.field)}>
                                Sort A to Z
                            </div>
                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSort(col.field)}>
                                Sort Z to A
                            </div>
                            <Input
                                type="text"
                                placeholder="Search"
                                className="mt-2 mb-2 w-full"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                endContent={<Icon icon={'iconamoon:search-thin'} className={"text-lg"} />}
                            />

                            <label className="flex items-center">
                                <Checkbox
                                    isSelected={filterOptions[col.field]?.every(option => selectedFilters[col.field]?.has(option))}
                                    onChange={(e) => handleSelectAll(col.field, e.target.checked)}
                                >
                                    Select All
                                </Checkbox>
                            </label>

                            {/* Scrollable container for individual options */}
                            <div className="flex flex-col gap-1 overflow-y-auto" style={{ maxHeight: '150px' }}>
                                {filterOptions[col.field]?.filter((option) =>
                                    option.toLowerCase().includes(searchText.toLowerCase())
                                ).map((option) => (
                                    <Checkbox
                                        key={option}
                                        checked={selectedFilters[col.field]?.has(option) || false}
                                        onChange={() => handleCheckboxFilter(col.field, option)}
                                    >
                                        {option}
                                    </Checkbox>
                                ))}
                            </div>

                            <div className="flex justify-end mt-2">
                                <button className="px-2 py-1 text-blue-600" onClick={handleHideMenu}>OK</button>
                                <button className="px-2 py-1 text-gray-600 ml-2" onClick={handleHideMenu}>Cancel</button>
                            </div>
                        </div>
                    )}
                </th>
            ))}
        </tr>
        </thead>
    );
};

export default CNCGridHeader;