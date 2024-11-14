import React, {useEffect, useRef} from 'react';
import {ColumnDef} from '../interfaces/GridInterfaces';

interface RowProps {
    row: any;
    rowIndex: number;
    rowHeight: number;
    visibleColumns: ColumnDef[];
    focusedCell: { rowIndex: number; colIndex: number } | null;
    setFocusedCell: (cell: { rowIndex: number; colIndex: number } | null) => void;
    cellWrap?: boolean;
    onRowClick?: (row: any) => void;
    onRowDoubleClick?: (row: any) => void;
    onRowRightClick?: (row: any) => void;
    onCellClick?: (rowIndex: number, colIndex: number) => void;
    onCellDoubleClick?: (rowIndex: number, colIndex: number) => void;
    onCellRightClick?: (rowIndex: number, colIndex: number) => void;
    loading?: boolean;
    rowData: any[]; // Added to handle vertical focus navigation
}

const RowComponent: React.FC<RowProps> = ({
                                              row,
                                              rowIndex,
                                              rowHeight,
                                              visibleColumns,
                                              focusedCell,
                                              setFocusedCell,
                                              cellWrap = false,
                                              onRowClick,
                                              onRowDoubleClick,
                                              onRowRightClick,
                                              onCellClick,
                                              onCellDoubleClick,
                                              onCellRightClick,
                                              loading = false,
                                              rowData,
                                          }) => {
    const rowRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent, colIndex: number) => {
        e.preventDefault();

        if (!focusedCell) return;

        let newFocusedCell = {rowIndex: focusedCell.rowIndex, colIndex: focusedCell.colIndex};

        switch (e.key) {
            case 'ArrowRight':
                newFocusedCell.colIndex = Math.min(colIndex + 1, visibleColumns.length - 1);
                break;
            case 'ArrowLeft':
                newFocusedCell.colIndex = Math.max(colIndex - 1, 0);
                break;
            case 'ArrowDown':
                newFocusedCell.rowIndex = Math.min(focusedCell.rowIndex + 1, rowData.length - 1);
                break;
            case 'ArrowUp':
                newFocusedCell.rowIndex = Math.max(focusedCell.rowIndex - 1, 0);
                break;
            default:
                return;
        }

        setFocusedCell(newFocusedCell);
    };

    // Effect to handle clicks outside the grid to remove focus
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (rowRef.current && !rowRef.current.contains(event.target as Node)) {
                setFocusedCell(null); // Remove focus when clicking outside the grid
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setFocusedCell]);

    return (
        <div
            ref={rowRef}
            onClick={() => onRowClick && onRowClick(row)}
            onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row)}
            onContextMenu={(e) => {
                e.preventDefault();
                onRowRightClick && onRowRightClick(row);
            }}
            className="grid-row"
            style={{height: rowHeight}}
        >
            {loading ? (
                <div className="grid-cell">Loading...</div>
            ) : (
                visibleColumns.map((col, colIndex) => {
                    const isFocused = focusedCell?.rowIndex === rowIndex && focusedCell?.colIndex === colIndex;

                    // Ensure width, minWidth, and maxWidth are valid numbers with fallback values
                    const cellWidth = typeof col.width === 'number' && !isNaN(col.width) ? col.width : 150;
                    const minWidth = typeof col.minWidth === 'number' && !isNaN(col.minWidth) ? col.minWidth : 50;
                    const maxWidth = typeof col.maxWidth === 'number' && !isNaN(col.maxWidth) ? col.maxWidth : 500;

                    const computedWidth = Math.max(minWidth, Math.min(cellWidth, maxWidth));

                    return (
                        <div
                            key={colIndex}
                            className={`grid-cell ${!cellWrap ? 'not-wrapped' : ''} ${isFocused ? 'focused' : ''}`}
                            style={{
                                width: computedWidth,
                                minWidth: minWidth,
                                maxWidth: maxWidth,
                            }}
                            tabIndex={0} // Make each cell focusable
                            onFocus={() => setFocusedCell({rowIndex, colIndex})} // Set focus to this cell
                            onKeyDown={(e) => handleKeyDown(e, colIndex)} // Prevent scrolling with arrow keys
                            onClick={() => {
                                setFocusedCell({rowIndex, colIndex}); // Update focused cell on click
                                onCellClick && onCellClick(rowIndex, colIndex);
                            }}
                            onDoubleClick={() => onCellDoubleClick && onCellDoubleClick(rowIndex, colIndex)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                onCellRightClick && onCellRightClick(rowIndex, colIndex);
                            }}
                        >
                            {col.renderCell ? col.renderCell(row) : col.field ? row[col.field] : ''}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default RowComponent;
