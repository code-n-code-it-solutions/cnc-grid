import React from 'react';
import { Pagination } from "@nextui-org/pagination";
import { Select, SelectItem } from "@nextui-org/react";

interface PaginationProps {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    onPageChange: (page: number) => void;
    pages: number[];
    onPageSizeChange: (size: number) => void; // New prop
}

const PaginationComponent: React.FC<PaginationProps> = ({ currentPage, pageSize, totalRecords, onPageChange, pages, onPageSizeChange }) => {
    const startRecord = (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalRecords);

    return (
        <div className="pagination-container mt-auto py-3 flex justify-between items-center border-t">
            <div>
                Showing {startRecord} - {endRecord} of {totalRecords}
            </div>

            {/* Page Size Selector */}
            <div>
                {/*<Select*/}
                {/*    size={'sm'}*/}
                {/*    onChange={(value) => onPageSizeChange(Number(value))} // Trigger page size change*/}
                {/*>*/}
                {/*    {pages.map((page, index) => (*/}
                {/*        <SelectItem key={`page-size-${index}`} value={page.toString()}>*/}
                {/*            {page}*/}
                {/*        </SelectItem>*/}
                {/*    ))}*/}
                {/*</Select>*/}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-end">
                <Pagination
                    page={currentPage}
                    total={Math.ceil(totalRecords / pageSize)}
                    initialPage={1}
                    onChange={(page) => onPageChange(page)}
                    showControls
                />
            </div>
        </div>
    );
};

export default PaginationComponent;