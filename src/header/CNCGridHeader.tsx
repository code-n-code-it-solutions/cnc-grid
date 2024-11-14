import React, {useState, useRef, useEffect} from 'react';
import {Icon} from "@iconify/react";
import {sortData} from "../sort/SortUtils";
import {Checkbox} from "@nextui-org/checkbox";
import {Input} from "@nextui-org/input";
import {ColumnDef} from "../interfaces/GridInterfaces";

interface CNCGridHeaderProps {
    colDef: ColumnDef[];
    setFilteredData: (data: any[]) => void;
    rowData: any[];
    clearFilters: boolean;  // Prop to trigger filter reset
    headerWrap?: boolean;
    resizable?: boolean;
}

const CNCGridHeader: React.FC<CNCGridHeaderProps> = ({
                                                         colDef,
                                                         setFilteredData,
                                                         rowData,
                                                         clearFilters,
                                                         headerWrap,
                                                         resizable = true
                                                     }) => {
    const [sortField, setSortField] = useState<number | null>(null); // Track sorting by index
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');
    const [showMenu, setShowMenu] = useState<{
        index: number | null,
        position: { top: number, left: number } | null
    }>({index: null, position: null});
    const [columnWidths, setColumnWidths] = useState<{ [key: number]: number }>({});
    const [filterOptions, setFilterOptions] = useState<{ [key: number]: string[] }>({});
    const [selectedFilters, setSelectedFilters] = useState<{ [key: number]: Set<string> }>({});
    const [searchText, setSearchText] = useState("");
    const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const resizingColumnRef = useRef<number | null>(null); // Track the index of the column being resized

    useEffect(() => {
        const initialWidths = colDef.reduce((acc, _, index) => {
            acc[index] = colDef[index].width || 150;
            return acc;
        }, {} as { [key: number]: number });
        setColumnWidths(initialWidths);
    }, [colDef]);

    useEffect(() => {
        if (clearFilters) {
            setSelectedFilters({});
            setSearchText('');
            setSortField(null);
            setSortDirection('ASC');
            setFilteredData(rowData);  // Reset to original data
        }
    }, [clearFilters, rowData]);

    const updateFilterOptions = () => {
        const options: { [key: number]: Set<string> } = {};
        let filteredData = rowData;

        // Apply filters if 'field' exists; skip columns with only 'renderCell' definitions.
        Object.keys(selectedFilters).forEach(indexStr => {
            const colIndex = parseInt(indexStr, 10);
            const field = colDef[colIndex]?.field;
            if (field && selectedFilters[colIndex]?.size > 0) {
                filteredData = filteredData.filter(row =>
                    selectedFilters[colIndex].has(row[field]?.toString() || "")
                );
            }
        });

        // Populate filter options only for columns that are filterable and have a 'field'
        colDef.forEach((col, index) => {
            if (col.filterable && col.field && typeof col.field !== 'undefined') {
                options[index] = new Set(filteredData.map(row => col.field ? row[col.field]?.toString() : ""));
            }
        });

        setFilterOptions(
            Object.fromEntries(
                Object.entries(options).map(([index, values]) => [
                    parseInt(index, 10),
                    Array.from(values),
                ])
            )
        );
    };

    useEffect(() => {
        updateFilterOptions();
    }, [selectedFilters, rowData]);

    const handleSort = (index: number) => {
        const field = colDef[index]?.field;
        if (!field) return; // Skip sorting for columns without a 'field'

        const newDirection = sortField === index && sortDirection === 'ASC' ? 'DESC' : 'ASC';
        setSortField(index);
        setSortDirection(newDirection);
        const sortedData = sortData([...rowData], field, newDirection);
        setFilteredData(sortedData);
    };

    const handleCheckboxFilter = (index: number, value: string) => {
        const updatedFilters = {...selectedFilters};
        if (!updatedFilters[index]) {
            updatedFilters[index] = new Set();
        }
        if (updatedFilters[index].has(value)) {
            updatedFilters[index].delete(value);
        } else {
            updatedFilters[index].add(value);
        }
        setSelectedFilters(updatedFilters);
        applyFilters(updatedFilters);
    };

    const applyFilters = (filters: { [key: number]: Set<string> }) => {
        let filteredData = rowData;
        Object.keys(filters).forEach(indexStr => {
            const colIndex = parseInt(indexStr, 10);
            const field = colDef[colIndex]?.field;
            if (field && filters[colIndex].size > 0) {
                filteredData = filteredData.filter(row => filters[colIndex].has(row[field]?.toString() || ""));
            }
        });
        setFilteredData(filteredData);
    };

    const handleSelectAll = (index: number, checked: boolean) => {
        const updatedFilters = {...selectedFilters};
        updatedFilters[index] = checked ? new Set(filterOptions[index]) : new Set();
        setSelectedFilters(updatedFilters);
        applyFilters(updatedFilters);
    };

    const handleIconClick = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        const iconElement = iconRefs.current[index];
        if (iconElement) {
            const rect = iconElement.getBoundingClientRect();
            setShowMenu({
                index,
                position: {
                    top: 0,
                    left: rect.left + window.scrollX - 192  // Adjust left position as needed
                }
            });
        }
    };

    const handleHideMenu = () => setShowMenu({index: null, position: null});

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

    const handleMouseDown = (e: React.MouseEvent, index: number) => {
        resizingColumnRef.current = index;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (resizingColumnRef.current === null) return;

        const index = resizingColumnRef.current;
        const minWidth = colDef[index]?.minWidth || 50;
        const maxWidth = colDef[index]?.maxWidth || 500;
        const newWidth = Math.min(Math.max((columnWidths[index] || 0) + e.movementX, minWidth), maxWidth);

        setColumnWidths(prevWidths => ({
            ...prevWidths,
            [index]: newWidth
        }));
    };

    const handleMouseUp = () => {
        resizingColumnRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="grid-header">
            {colDef.map((col, index) => (
                <div
                    key={`header-${index}`}
                    className={`px-2 text-left font-semibold text-gray-700 relative ${!headerWrap ? 'overflow-hidden text-ellipsis whitespace-nowrap' : ''}`}
                    style={{
                        width: columnWidths[index],
                        position: 'sticky',
                        top: 0,
                        zIndex: 2
                    }}
                >
                    <div className="flex justify-between items-center">
                        <div
                            className={`flex w-full items-center ${col.filterable ? 'justify-between' : 'justify-start'}`}>
                            <div className="flex items-center gap-1">
                                {col.headerName}
                                {col.sortable && sortField === index && (
                                    <span>
                                        {sortDirection === 'ASC' ? (
                                            <Icon icon={'stash:arrow-up-light'} className="text-lg"/>
                                        ) : (
                                            <Icon icon={'stash:arrow-down-light'} className="text-lg"/>
                                        )}
                                    </span>
                                )}
                            </div>

                            <div ref={(el) => iconRefs.current[index] = el} className="relative">
                                <Icon
                                    icon={'mingcute:more-2-line'}
                                    className="cursor-pointer text-xl font-bold me-1"
                                    onClick={(e) => handleIconClick(e, index)}
                                />
                            </div>
                        </div>
                        {resizable && (
                            <div className="ps-1 cursor-col-resize" onMouseDown={(e) => handleMouseDown(e, index)}>
                                <div className="w-0.5 h-4 bg-gray-300 rounded-md"></div>
                            </div>
                        )}
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
                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSort(index)}>
                                Sort A to Z
                            </div>
                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSort(index)}>
                                Sort Z to A
                            </div>
                            <Input
                                type="text"
                                placeholder="Search"
                                className="mt-2 mb-2 w-full"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                endContent={<Icon icon={'iconamoon:search-thin'} className={"text-lg"}/>}
                            />

                            <label className="flex items-center">
                                <Checkbox
                                    isSelected={filterOptions[index]?.every(option => selectedFilters[index]?.has(option))}
                                    onChange={(e) => handleSelectAll(index, e.target.checked)}
                                >
                                    Select All
                                </Checkbox>
                            </label>

                            <div className="flex flex-col gap-1 overflow-y-auto" style={{ maxHeight: '150px' }}>
                                {filterOptions[index]?.filter((option) =>
                                    option.toLowerCase().includes(searchText.toLowerCase())
                                ).map((option) => (
                                    <Checkbox
                                        key={option}
                                        checked={selectedFilters[index]?.has(option) || false}
                                        onChange={() => handleCheckboxFilter(index, option)}
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
                </div>
            ))}
        </div>
    );
};

export default CNCGridHeader;