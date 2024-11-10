/**
 * Developed By Suhaib
 */
import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportToPDF = (data: any[][], filename: string) => {
    const doc = new jsPDF();
    doc.autoTable({
        head: [data[0]], // First row as headers
        body: data.slice(1), // Remaining rows as data
    });
    doc.save(filename);
};