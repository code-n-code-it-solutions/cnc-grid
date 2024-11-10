/**
 * Developed By Suhaib
 */
export const toggleRowSelection = (selectedRows: any[], row: any) => {
    const index = selectedRows.indexOf(row);
    if (index > -1) {
        return selectedRows.filter(r => r !== row);
    } else {
        return [...selectedRows, row];
    }
};
