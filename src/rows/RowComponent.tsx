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
    loading?: boolean
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
                                              loading = false
                                          }) => {
    return (
        <tr
            style={{height: rowHeight}}
            onClick={() => onRowClick && onRowClick(row)}
            onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row)}
            onContextMenu={(e) => {
                e.preventDefault();
                onRowRightClick && onRowRightClick(row);
            }}
        >
            {loading
                ? <td
                    colSpan={visibleColumns.length}
                    className="border px-4 py-2"
                >
                    Loading...
                </td>
                : visibleColumns.map((col, index) => (
                    <td
                        key={index}
                        className="border px-4 py-2"
                        onClick={() => onCellClick && onCellClick(row[col.field])}
                        onDoubleClick={() => onCellDoubleClick && onCellDoubleClick(row[col.field])}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            onCellRightClick && onCellRightClick(row[col.field]);
                        }}
                    >
                        {col.renderCell ? col.renderCell(row) : row[col.field]}
                    </td>
                ))}
        </tr>
    );
};

export default RowComponent;