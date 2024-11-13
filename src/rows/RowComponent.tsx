/**
 * Developed By Suhaib
 */
import React from 'react';
import {ColumnDef} from '../interfaces/GridInterfaces';

interface RowProps {
    row: any;
    rowHeight: number;
    visibleColumns: ColumnDef[];
    onRowClick?: (row: any) => void;
    onRowDoubleClick?: (row: any) => void;
    onRowRightClick?: (row: any) => void;
    onCellClick?: (cell: any) => void;
    onCellDoubleClick?: (cell: any) => void;
    onCellRightClick?: (cell: any) => void;
    loading?: boolean;
    cellWrap?: boolean;
}

const RowComponent: React.FC<RowProps> = ({
                                              row,
                                              rowHeight,
                                              visibleColumns,
                                              onRowClick,
                                              onRowDoubleClick,
                                              onRowRightClick,
                                              onCellClick,
                                              onCellDoubleClick,
                                              onCellRightClick,
                                              loading = false,
                                              cellWrap = false
                                          }) => {
    return (
        <div
            onClick={() => onRowClick && onRowClick(row)}
            onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row)}
            onContextMenu={(e) => {
                e.preventDefault();
                onRowRightClick && onRowRightClick(row);
            }}
            className="flex border-b"
            style={{height: rowHeight}}
        >
            {loading ? (
                <div className="border-b px-4 py-2">Loading...</div>
            ) : (
                visibleColumns.map((col, index) => {
                    // Ensure width, minWidth, and maxWidth are valid numbers with fallback values
                    const cellWidth = typeof col.width === 'number' && !isNaN(col.width) ? col.width : 150;
                    const minWidth = typeof col.minWidth === 'number' && !isNaN(col.minWidth) ? col.minWidth : 50;
                    const maxWidth = typeof col.maxWidth === 'number' && !isNaN(col.maxWidth) ? col.maxWidth : 500;

                    const computedWidth = Math.max(minWidth, Math.min(cellWidth, maxWidth));

                    return (
                        <div
                            key={index}
                            className={`px-2 py-2 ${!cellWrap ? 'overflow-hidden text-ellipsis whitespace-nowrap' : ''}`}
                            style={{
                                width: computedWidth,
                                minWidth: minWidth,
                                maxWidth: maxWidth
                            }}
                            onClick={() => onCellClick && onCellClick(col.renderCell ? col.renderCell(row) : row[index])}
                            onDoubleClick={() => onCellDoubleClick && onCellDoubleClick(col.renderCell ? col.renderCell(row) : row[index])}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                onCellRightClick && onCellRightClick(col.renderCell ? col.renderCell(row) : row[index]);
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