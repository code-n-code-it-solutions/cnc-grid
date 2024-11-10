'use client';
import React, { FC, useState, useEffect, useRef } from 'react';
import { Icon } from "@iconify/react";

interface IColumn {
    headerName: string;
    field: string;
    sortable?: boolean;
    filter?: boolean;
    checkboxSelection?: boolean;
    headerCheckboxSelection?: boolean;
    renderCell?: (params: any) => React.ReactNode;
    width?: number;
}

interface IProps {
    colDef: IColumn[];
    rowData: { [key: string]: any }[];
    onSelectionChange?: (selectedRows: any) => void;
}

const CNCGrid: FC<IProps> = ({ colDef, rowData, onSelectionChange }) => {
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [sortedData, setSortedData] = useState(rowData);
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
    const [showMenu, setShowMenu] = useState<{ index: number | null; position: { top: number; left: number } | null }>({ index: null, position: null });

    const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const initialWidths = colDef.reduce((acc, col) => {
            acc[col.field] = col.width || 150;
            return acc;
        }, {} as { [key: string]: number });
        setColumnWidths(initialWidths);
    }, [colDef]);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !iconRefs.current.some(icon => icon && icon.contains(event.target as Node))
            ) {
                handleHideMenu();
            }
        };

        if (showMenu.index !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    // Handle sorting
    const handleSort = (field: string, direction: 'asc' | 'desc') => {
        setSortField(field);
        setSortDirection(direction);
        const sorted = [...sortedData].sort((a, b) => {
            if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setSortedData(sorted);
    };

    // Handle row selection
    const handleRowSelect = (row: any) => {
        const newSelectedRows = selectedRows.includes(row)
            ? selectedRows.filter(selected => selected !== row)
            : [...selectedRows, row];
        setSelectedRows(newSelectedRows);
        onSelectionChange && onSelectionChange(newSelectedRows);
    };

    // Show menu on icon click
    const handleIconClick = (event: React.MouseEvent, index: number) => {
        event.stopPropagation();
        const iconElement = iconRefs.current[index];
        if (iconElement) {
            const rect = iconElement.getBoundingClientRect();
            setShowMenu({
                index,
                position: {
                    top: rect.bottom + window.scrollY + 4, // Adjusted positioning for spacing below the icon
                    left: rect.left + window.scrollX,
                },
            });
        }
    };

    // Hide menu
    const handleHideMenu = () => setShowMenu({ index: null, position: null });

    // Menu actions
    const handleMenuAction = (field: string, action: string) => {
        switch (action) {
            case 'sortAsc':
                handleSort(field, 'asc');
                break;
            case 'sortDesc':
                handleSort(field, 'desc');
                break;
            case 'autosize':
                setColumnWidths(prev => ({ ...prev, [field]: 200 }));
                break;
            case 'reset':
                setColumnWidths(prev => ({ ...prev, [field]: 150 }));
                break;
            default:
                break;
        }
        handleHideMenu();
    };

    // Render header with context menu
    const renderHeader = () => (
        <tr>
            {colDef.map((col, index) => (
                <th
                    key={index}
                    className="px-4 py-2 text-left font-semibold text-gray-700 bg-gray-100 relative"
                    style={{ width: columnWidths[col.field] }}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                            {col.headerName}
                            {col.sortable && sortField === col.field && (
                                <span>
                                    {sortDirection === 'asc'
                                        ? <Icon icon={'stash:arrow-up-light'} className="text-lg" />
                                        : <Icon icon={'stash:arrow-down-light'} className="text-lg" />}
                                </span>
                            )}
                        </div>
                        {/* Icon for opening the dropdown menu */}
                        <div
                            ref={(el) => {
                                iconRefs.current[index] = el;
                            }}
                        >
                            <Icon
                                icon={'mingcute:more-2-line'}
                                className="cursor-pointer text-lg"
                                onClick={(e) => handleIconClick(e, index)}
                            />
                        </div>
                    </div>
                    {showMenu.index === index && showMenu.position && (
                        <div
                            ref={menuRef}
                            className="fixed bg-white shadow-lg border border-gray-200 rounded-md z-50 p-2"
                            style={{ top: showMenu.position.top, left: showMenu.position.left }}
                            onMouseLeave={handleHideMenu}
                        >
                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleMenuAction(col.field, 'sortAsc')}>Sort Ascending</div>
                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleMenuAction(col.field, 'sortDesc')}>Sort Descending</div>
                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleMenuAction(col.field, 'autosize')}>Autosize This Column</div>
                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleMenuAction(col.field, 'reset')}>Reset Column Width</div>
                        </div>
                    )}
                </th>
            ))}
        </tr>
    );

    // Render rows
    const renderRows = () =>
        sortedData.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-100 cursor-pointer">
                {colDef.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-2 border-t">
                        {col.renderCell ? col.renderCell(row[col.field]) : row[col.field]}
                    </td>
                ))}
            </tr>
        ));

    return (
        <div className="overflow-auto">
            <table className="min-w-full border border-gray-200">
                <thead>{renderHeader()}</thead>
                <tbody>{renderRows()}</tbody>
            </table>
        </div>
    );
};

export default CNCGrid;
