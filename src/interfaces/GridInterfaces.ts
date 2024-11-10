/**
 * Developed By Suhaib
 */
import React from "react";

export interface ColumnDef {
    headerName: string;
    field: string;
    sortable?: boolean;
    renderCell?: (row: any) => React.ReactNode;
    width?: number; //default according to content
    resizable?: boolean; //default true
    filterable?: boolean; //default true
    visible?: boolean; //default true
    wrapText?: boolean; //default false
    checkboxSelection?: boolean; //default false
    headerCheckboxSelection?: boolean; //default false
}

export interface GridProps {
    colDef: ColumnDef[];
    rowData: any[];
    gridHeight?: string;
    gridWidth?: string;
    rowHeight?: number;
    headerHeight?: number;
    onSelectionChange?: (selectedRows: any) => void;
    onRowClick?: (row: any) => void;
    onRowDoubleClick?: (row: any) => void;
    onRowRightClick?: (row: any) => void;
    onCellClick?: (cell: any) => void;
    onCellDoubleClick?: (cell: any) => void;
    onCellRightClick?: (cell: any) => void;
    onSortChange?: (sortField: string, sortDirection: 'asc' | 'desc') => void;
    onFilterChange?: (filterText: string) => void;
    onColumnResize?: (field: string, width: number) => void;
    onColumnVisibilityChange?: (field: string, visible: boolean) => void;
    onColumnOrderChange?: (field: string, order: number) => void;
    onGridReady?: (api: any) => void;
    export?: {
        excel?: boolean;
        csv?: boolean;
        pdf?: boolean;
    };
    pagination?: boolean;
    pageSize?: number;
    currentPage?: number;
    totalRecords?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizes?: number[];
    loading?: boolean;
    noDataMessage?: string;
}