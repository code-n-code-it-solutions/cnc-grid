/**
 * Developed By Suhaib
 */
export const filterData = (data: any[], filterText: string) => {
    return data.filter(row =>
        Object.values(row).some(val =>
            String(val).toLowerCase().includes(filterText.toLowerCase())
        )
    );
};