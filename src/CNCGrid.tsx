'use client';
import React, {useState, useEffect} from 'react';
import {GridProvider, useGridContext} from './contexts/GridContext';
import FilterComponent from './filter/FilterComponent';
import PaginationComponent from './pagination/PaginationComponent';
import RowComponent from './rows/RowComponent';
import {exportToCSV} from './exporters/csvExporter';
import {filterData} from './filter/FilterUtils';
import {GridProps, ColumnDef} from './interfaces/GridInterfaces';
import {exportToExcel} from "./exporters/excelExporter";
import {exportToPDF} from "./exporters/pdfExporter";
import CNCGridHeader from './header/CNCGridHeader';
import {Button} from "@nextui-org/button";
import {NextUIProvider} from "@nextui-org/system";
import {Dropdown, Checkbox, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";

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
                                              export: {csv = false, excel = false, pdf = false} = {
                                                  csv: false,
                                                  excel: false,
                                                  pdf: false
                                              },
                                              pagination = false,
                                              pageSize = 10,
                                              pageSizes = [10, 20, 50, 100],
                                              currentPage = 1,
                                              onPageChange,
                                              loading = false,
                                              noDataMessage = "No data available",
                                              rowModelType = 'clientSide',
                                              fetchData,
                                              className
                                          }) => {
    const {filterText, setFilterText} = useGridContext();
    const [filteredData, setFilteredData] = useState(rowData);
    const [clearFilters, setClearFilters] = useState(false);
    const [focusedCell, setFocusedCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);
    const [visibleColumns, setVisibleColumns] = useState<ColumnDef[]>(
        colDef.map((col) => ({...col, visible: col.visible !== false}))
    );

    const [internalPage, setInternalPage] = useState(currentPage);
    const [internalPageSize, setInternalPageSize] = useState(pageSize);

    useEffect(() => {
        setFilteredData(filterData(rowData, filterText));
    }, [filterText, rowData]);

    const handleColumnVisibilityChange = (index: number) => {
        setVisibleColumns((prevColumns) =>
            prevColumns.map((col, colIndex) =>
                colIndex === index ? {...col, visible: !col.visible} : col
            )
        );
        if (onColumnVisibilityChange) {
            const updatedCol = colDef[index];
            onColumnVisibilityChange(updatedCol.headerName, !updatedCol.visible);
        }
    };

    const handleExport = (type: 'csv' | 'excel' | 'pdf') => {
        const exportData = [
            visibleColumns.filter((col) => col.visible).map((col) => col.headerName),
            ...filteredData.map((row) =>
                visibleColumns.filter((col) => col.visible).map((col, colIndex) =>
                    col.renderCell ? col.renderCell(row) : row[colDef[colIndex].headerName] || ""
                )
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
        setFilteredData(rowData);
        setClearFilters(true);
        setFilterText('');
        setInternalPage(1);

        setTimeout(() => setClearFilters(false), 100);
    };

    const handlePageChange = (page: number) => {
        if (onPageChange) {
            onPageChange(page);
        } else {
            setInternalPage(page);
        }
    };


    return (
        <NextUIProvider>
            <div className={`grid-container ${className}`} style={{width: gridWidth, height: gridHeight}}>
                <div className="flex justify-between items-center flex-col md:flex-row px-3 py-1 md:gap-2">
                    {/* Export Buttons */}
                    <div className="flex flex-row gap-1">
                        {csv && <Button onClick={() => handleExport('csv')} className="rounded" size="sm">CSV</Button>}
                        {excel &&
                            <Button onClick={() => handleExport('excel')} className="rounded" size="sm">Excel</Button>}
                        {pdf && <Button onClick={() => handleExport('pdf')} className="rounded" size="sm">PDF</Button>}
                    </div>

                    {/* Filter Component, Clear Filters Button, and Column Visibility Dropdown */}
                    <div className="flex items-center gap-3">
                        <FilterComponent onFilterChange={(text) => {
                            setFilterText(text);
                            onFilterChange && onFilterChange(text);
                        }}/>

                        <Button onClick={handleClearFilters} className="rounded" size="sm">Clear Filters</Button>

                        {/* Column Visibility Dropdown */}
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="bordered">Visibility</Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Column Visibility">
                                {visibleColumns.map((col, index) => (
                                    <DropdownItem key={index}>
                                        <Checkbox
                                            isSelected={col.visible}
                                            onChange={() => handleColumnVisibilityChange(index)}
                                        >
                                            {col.headerName}
                                        </Checkbox>
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>

                <div className="grid flex-1 overflow-auto"
                     style={{maxHeight: `calc(${gridHeight} - ${headerHeight}px - 60px)`}}>
                    <div className="flex flex-col">
                        <CNCGridHeader
                            colDef={visibleColumns.filter(col => col.visible)}
                            setFilteredData={setFilteredData}
                            rowData={rowData}
                            clearFilters={clearFilters}
                        />
                        <div className="grid-body">
                            {filteredData.length > 0 ? (
                                filteredData
                                    .slice((internalPage - 1) * internalPageSize, internalPage * internalPageSize)
                                    .map((row, index) => (
                                        <RowComponent
                                            key={index}
                                            row={row}
                                            rowHeight={rowHeight}
                                            visibleColumns={visibleColumns.filter(col => col.visible)}
                                            onRowClick={onRowClick}
                                            onRowDoubleClick={onRowDoubleClick}
                                            onRowRightClick={onRowRightClick}
                                            onCellClick={onCellClick}
                                            onCellDoubleClick={onCellDoubleClick}
                                            onCellRightClick={onCellRightClick}
                                            loading={loading}
                                            rowIndex={index}
                                            rowData={row}
                                            focusedCell={focusedCell}
                                            setFocusedCell={setFocusedCell}
                                        />
                                    ))
                            ) : (
                                <div className="md:text-center py-4 px-5">
                                    {noDataMessage}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pagination Component */}
                {pagination && (
                    <PaginationComponent
                        currentPage={internalPage}
                        pageSize={internalPageSize}
                        totalRecords={filteredData.length}
                        onPageChange={handlePageChange}
                        pages={pageSizes}
                        setInternalPage={setInternalPage}
                        internalPageSize={internalPageSize}
                        setInternalPageSize={setInternalPageSize}
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
