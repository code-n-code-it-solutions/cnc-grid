import * as XLSX from "xlsx";

export const exportToExcel = (data: any[][], filename: string) => {
    // Check if data has any content
    if (!data || data.length === 0) {
        console.error("No data available for export");
        return;
    }

    // Convert data to sheet format
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write file
    XLSX.writeFile(workbook, filename);
};
