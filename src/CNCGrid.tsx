'use client';
import React, { useState, useEffect } from 'react';
import { GridProvider, useGridContext } from './contexts/GridContext';
import FilterComponent from './filter/FilterComponent';
import PaginationComponent from './pagination/PaginationComponent';
import RowComponent from './rows/RowComponent';
import { exportToCSV } from './exporters/csvExporter';
import { filterData } from './filter/FilterUtils';
import { GridProps, ColumnDef } from './interfaces/GridInterfaces';
import { exportToExcel } from "./exporters/excelExporter";
import { exportToPDF } from "./exporters/pdfExporter";
import CNCGridHeader from './header/CNCGridHeader';
import { Button } from "@nextui-org/button";
import { NextUIProvider } from "@nextui-org/system";
import { Dropdown, Checkbox, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

const GridContent: React.FC<GridProps> = ({
                                              colDef,
                                              rowData,
                                              gridHeight = "600px",
                                              gridWidth = "100%",
                                              rowHeight = 40,
                                              headerHeight = 50,
                                              onSelectionChange,
                                              onRowClick,
                                              onRowDoubleClick,
                                              onRowRightClick,
                                              onCellClick,
                                              onCellDoubleClick,
                                              onCellRightClick,
                                              onSortChange,
                                              onFilterChange,
                                              onColumnResize,
                                              onColumnVisibilityChange,
                                              onColumnOrderChange,
                                              onGridReady,
                                              export: { csv = false, excel = false, pdf = false } = { csv: false, excel: false, pdf: false },
                                              pagination = false,
                                              pageSize = 10,
                                              pageSizes = [10, 20, 50],
                                              currentPage = 1,
                                              onPageChange,
                                              loading = false,
                                              noDataMessage = "No data available"
                                          }) => {
    const { filterText, setFilterText } = useGridContext();
    const [filteredData, setFilteredData] = useState(rowData);
    const [clearFilters, setClearFilters] = useState(false);

    // Set visible to true by default if not provided
    const [visibleColumns, setVisibleColumns] = useState<ColumnDef[]>(
        colDef.map((col) => ({ ...col, visible: col.visible !== false }))
    );

    const [internalPage, setInternalPage] = useState(currentPage);
    const [internalPageSize, setInternalPageSize] = useState(pageSize);

    useEffect(() => {
        setFilteredData(filterData(rowData, filterText));
    }, [filterText, rowData]);

    const handleColumnVisibilityChange = (field: string) => {
        setVisibleColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.field === field ? { ...col, visible: !col.visible } : col
            )
        );
        onColumnVisibilityChange && onColumnVisibilityChange(field, !colDef.find(col => col.field === field)?.visible);
    };

    const handleExport = (type: 'csv' | 'excel' | 'pdf') => {
        const exportData = [
            visibleColumns.filter((col) => col.visible).map((col) => col.headerName),
            ...filteredData.map((row) =>
                visibleColumns.filter((col) => col.visible).map((col) => row[col.field] || "")
            ),
        ];

        if (type === 'csv') {
            exportToCSV(exportData, "grid-data.csv");
        } else if (type === 'excel') {
            exportToExcel(exportData, "grid-data.xlsx");
        } else if (type === 'pdf') {
            exportToPDF(exportData, "grid-data.pdf");
        }
    };

    const handleClearFilters = () => {
        setFilteredData(rowData); // Reset the filtered data to the original row data
        setClearFilters(true); // Trigger clear filters in CNCGridHeader
        setFilterText(''); // Clear the global filter text
        setInternalPage(1); // Reset pagination to the first page

        // Reset the filters after a short delay to avoid immediate re-render
        setTimeout(() => setClearFilters(false), 100);
    };

    const handlePageChange = (page: number) => {
        if (onPageChange) {
            onPageChange(page);
        } else {
            setInternalPage(page);
        }
    };

    const handlePageSizeChange = (size: number) => {
        setInternalPageSize(size);
        setInternalPage(1); // Reset to first page when page size changes
    };

    return (
        <NextUIProvider>
            <div className="grid-container" style={{ width: gridWidth, height: gridHeight }}>
                <div className="flex justify-between items-center flex-col md:flex-row px-3 py-1 md:gap-2">
                    {/* Export Buttons */}
                    <div className="flex flex-row gap-1">
                        {csv && <Button onClick={() => handleExport('csv')} className="rounded" size="sm">CSV</Button>}
                        {excel && <Button onClick={() => handleExport('excel')} className="rounded" size="sm">Excel</Button>}
                        {pdf && <Button onClick={() => handleExport('pdf')} className="rounded" size="sm">PDF</Button>}
                    </div>

                    {/* Filter Component, Clear Filters Button, and Column Visibility Dropdown */}
                    <div className="flex items-center gap-3">
                        <FilterComponent onFilterChange={(text) => {
                            setFilterText(text);
                            onFilterChange && onFilterChange(text);
                        }} />

                        <Button onClick={handleClearFilters} className="rounded" size="sm">Clear Filters</Button>

                        {/* Column Visibility Dropdown */}
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="bordered">Visibility</Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Column Visibility">
                                {visibleColumns.map((col) => (
                                    <DropdownItem key={col.field}>
                                        <Checkbox
                                            isSelected={col.visible}
                                            onChange={() => handleColumnVisibilityChange(col.field)}
                                        >
                                            {col.headerName}
                                        </Checkbox>
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>

                <div className="table-container flex-1 overflow-auto" style={{ maxHeight: `calc(${gridHeight} - ${headerHeight}px - 60px)` }}>
                    <table className="table-auto w-full border">
                        <CNCGridHeader
                            colDef={visibleColumns.filter(col => col.visible)}  // Apply visibility to headers
                            setFilteredData={setFilteredData}
                            rowData={rowData}
                            clearFilters={clearFilters}  // Pass clearFilters prop to reset filters in header
                        />
                        <tbody>
                        {filteredData.length > 0 ? (
                            filteredData
                                .slice((internalPage - 1) * internalPageSize, internalPage * internalPageSize)
                                .map((row, index) => (
                                    <RowComponent
                                        key={index}
                                        row={row}
                                        rowHeight={rowHeight}
                                        visibleColumns={visibleColumns.filter(col => col.visible)} // Only show visible columns
                                        onRowClick={onRowClick}
                                        onRowDoubleClick={onRowDoubleClick}
                                        onRowRightClick={onRowRightClick}
                                        onCellClick={onCellClick}
                                        onCellDoubleClick={onCellDoubleClick}
                                        onCellRightClick={onCellRightClick}
                                        loading={loading}
                                    />
                                ))
                        ) : (
                            <tr>
                                <td colSpan={visibleColumns.length} className="text-center py-4">
                                    {noDataMessage}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Component */}
                {pagination && (
                    <PaginationComponent
                        currentPage={internalPage}
                        pageSize={internalPageSize}
                        totalRecords={filteredData.length}
                        onPageChange={handlePageChange}
                        pages={pageSizes}
                        onPageSizeChange={handlePageSizeChange}
                    />
                )}
            </div>
        </NextUIProvider>
    );
};

const CNCGrid: React.FC<GridProps> = (props) => (
    <GridProvider>
        <GridContent {...props} />
    </GridProvider>
);

export default CNCGrid;
