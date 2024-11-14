import React from 'react';
import {Pagination} from "@nextui-org/pagination";
import {Select, SelectItem} from "@nextui-org/react";
import {Icon} from "@iconify/react";

interface PaginationProps {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    onPageChange: (page: number) => void;
    pages: number[];
    internalPageSize: number;
    setInternalPageSize: (size: number) => void;
    setInternalPage: (size: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
                                                            currentPage,
                                                            pageSize,
                                                            totalRecords,
                                                            onPageChange,
                                                            pages,
                                                            setInternalPage,
                                                            internalPageSize,
                                                            setInternalPageSize
                                                        }) => {
    // const startRecord = (currentPage - 1) * pageSize + 1;
    // const endRecord = Math.min(currentPage * pageSize, totalRecords);

    const startRecord = (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalRecords);
    const totalPages = Math.ceil(totalRecords / pageSize);

    const handlePageSizeChange = (size: number) => {
        setInternalPageSize(size);
        setInternalPage(1);
    };

    const onPageChangeClick = (page: number, direction: 'first' | 'back' | 'next' | 'last') => {
        if (direction === 'first') {
            setInternalPage(1)
            return
        }

        if (direction === 'next') {
            setInternalPage(page + 1 > totalRecords ? totalRecords : page + 1)
            return
        }

        if (direction === 'back') {
            setInternalPage(page - 1 < 1 ? 1 : page - 1)
            return
        }

        if (direction === 'last') {
            setInternalPage(totalPages)
            return
        }
    }

    return (
        <div className="pagination-container">
            <div className="w-40 flex items-center gap-3">
                <div className="w-full text-right">Page Size:</div>
                <Select
                    size="sm"
                    // variant="bordered"
                    radius="sm"
                    classNames={{
                        base: 'border rounded',
                        listbox: 'p-0'
                    }}
                    selectedKeys={[String(internalPageSize)]}
                    onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                    aria-label="Select page size"
                >
                    {pages.map((page) => (
                        <SelectItem key={String(page)} textValue={String(page)}>
                            {page}
                        </SelectItem>
                    ))}
                </Select>

            </div>
            <div className="md:text-start">
                <span className="font-semibold">{startRecord}</span> to <span
                className="font-semibold">{endRecord}</span> of <span
                className="font-semibold">{totalRecords.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
                <div
                    className="p-1 cursor-pointer"
                    onClick={() => onPageChangeClick(currentPage, 'first')}
                >
                    <Icon icon="ph:caret-line-left"/>
                </div>
                <div
                    className="p-1 cursor-pointer"
                    onClick={() => onPageChangeClick(currentPage, 'back')}
                >
                    <Icon icon="radix-icons:caret-left" className="text-xl"/>
                </div>
                <span>
                    Page <span className="font-semibold">{currentPage}</span> of <span
                    className="font-semibold">{totalPages}</span>
                </span>
                <div
                    className="p-1 cursor-pointer"
                    onClick={() => onPageChangeClick(currentPage, 'next')}
                >
                    <Icon icon="radix-icons:caret-right" className="text-xl"/>
                </div>
                <div
                    className="p-1 cursor-pointer"
                    onClick={() => onPageChangeClick(currentPage, 'last')}
                >
                    <Icon icon="ph:caret-line-right"/>
                </div>
            </div>

        </div>
    );
};

export default PaginationComponent;