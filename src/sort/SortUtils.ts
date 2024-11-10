/**
 * Developed By Suhaib
 */
export const sortData = (data: any[], field: string, direction: 'ASC' | 'DESC') => {
    return data.sort((a, b) => {
        if (a[field] < b[field]) return direction === 'ASC' ? -1 : 1;
        if (a[field] > b[field]) return direction === 'ASC' ? 1 : -1;
        return 0;
    });
};