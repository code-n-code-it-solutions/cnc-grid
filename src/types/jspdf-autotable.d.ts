/**
 * Developed By Suhaib
 */
import "jspdf";

declare module "jspdf" {
    interface jsPDF {
        autoTable: (options: {
            head: any[][];
            body: any[][];
        }) => jsPDF;
    }
}