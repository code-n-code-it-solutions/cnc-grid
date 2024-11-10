/**
 * Developed By Suhaib
 */
export const exportToCSV = (data: any[], filename: string) => {
    const csvContent = data.map(row => Object.values(row).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};