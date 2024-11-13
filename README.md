# CNC Grid

> **🚧 This package is under active development. Rapid updates are being added daily, and contributions from developers are highly encouraged! 🚧**

CNC Grid is a customizable and easy-to-use data grid component for React and Next.js applications. It provides flexible filtering, sorting, and pagination features, along with the ability to export data to various formats (CSV, Excel, and PDF). Built to be lightweight and highly customizable, CNC Grid fits seamlessly into your projects.

![npm](https://img.shields.io/npm/v/cnc-grid)
![license](https://img.shields.io/npm/l/cnc-grid)
![downloads](https://img.shields.io/npm/dw/cnc-grid)

## Features

- **Column Visibility Management**: Show or hide columns based on user preferences.
- **Filtering and Sorting**: Easily filter and sort data on multiple columns.
- **Pagination**: Built-in pagination with configurable page sizes.
- **Data Export**: Export data to CSV, Excel, and PDF formats.
- **Customizable**: Customize styles, column headers, and more.
- **Responsive**: Adjusts to screen sizes and supports fixed headers.

## Demo and Documentation

Visit the [homepage](https://cnc-ui.com/cnc-grid) for a live demo and complete documentation.

## Installation

To install CNC Grid in your project, use npm:

```bash
npm install cnc-grid
```

## Usage

Here is a quick example of how to use CNC Grid in your project:

```jsx
import React from 'react';
import CNCGrid from 'cnc-grid';

const columns = [
  { headerName: 'Brand', field: 'brand', sortable: true, filterable: true },
  { headerName: 'Product', field: 'product', sortable: true, filterable: true },
  { headerName: 'Price', field: 'price', sortable: true, filterable: false },
];

const data = [
  { brand: 'Apple', product: 'iPhone 12', price: 799 },
  { brand: 'Samsung', product: 'Galaxy S21', price: 699 },
  { brand: 'Google', product: 'Pixel 5', price: 699 },
];

const App = () => (
  <CNCGrid
    colDef={columns}
    rowData={data}
    gridHeight="500px"
    gridWidth="100%"
    export={{ csv: true, excel: true, pdf: true }}
    pagination
  />
);

export default App;
```

## Props

### CNCGrid Props

| Prop                        | Type                              | Description                                                                                             | Default               |
|-----------------------------|-----------------------------------|---------------------------------------------------------------------------------------------------------|-----------------------|
| `colDef`                    | `Array<ColumnDef>`               | Defines columns of the grid. Each object in the array represents a column with its settings.             | Required              |
| `rowData`                   | `Array<Object>`                  | Array of data objects representing rows in the grid.                                                    | Required              |
| `gridHeight`                | `string`                         | Sets the height of the grid.                                                                            | `"500px"`             |
| `gridWidth`                 | `string`                         | Sets the width of the grid.                                                                             | `"100%"`              |
| `rowHeight`                 | `number`                         | Height of each row in the grid.                                                                         | `40`                  |
| `headerHeight`              | `number`                         | Height of the header row.                                                                               | `50`                  |
| `export`                    | `{ csv?: boolean, excel?: boolean, pdf?: boolean }` | Enables export options for CSV, Excel, and PDF.                           | `{ csv: false, excel: false, pdf: false }` |
| `pagination`                | `boolean`                        | Enables or disables pagination for the grid.                                                            | `false`               |
| `pageSize`                  | `number`                         | Number of rows per page if pagination is enabled.                                                       | `10`                  |
| `pageSizes`                 | `Array<number>`                  | Array of page size options for pagination.                                                              | `[10, 20, 50]`        |
| `currentPage`               | `number`                         | The current active page if pagination is enabled.                                                       | `1`                   |
| `onSelectionChange`         | `(selectedRows: any) => void`    | Callback function called when row selection changes.                                                    | `undefined`           |
| `onRowClick`                | `(row: any) => void`             | Callback function called when a row is clicked.                                                         | `undefined`           |
| `onRowDoubleClick`          | `(row: any) => void`             | Callback function called when a row is double-clicked.                                                  | `undefined`           |
| `onRowRightClick`           | `(row: any) => void`             | Callback function called when a row is right-clicked.                                                   | `undefined`           |
| `onCellClick`               | `(cell: any) => void`            | Callback function called when a cell is clicked.                                                        | `undefined`           |
| `onCellDoubleClick`         | `(cell: any) => void`            | Callback function called when a cell is double-clicked.                                                 | `undefined`           |
| `onCellRightClick`          | `(cell: any) => void`            | Callback function called when a cell is right-clicked.                                                  | `undefined`           |
| `onSortChange`              | `(sortField: string, sortDirection: 'asc' | 'desc') => void` | Callback function called when sorting changes.                    | `undefined`           |
| `onFilterChange`            | `(filterText: string) => void`   | Callback function called when a filter is applied.                                                      | `undefined`           |
| `onColumnResize`            | `(field: string, width: number) => void` | Callback function called when a column is resized.                 | `undefined`           |
| `onColumnVisibilityChange`  | `(field: string, visible: boolean) => void` | Callback for column visibility toggle.                            | `undefined`           |
| `onColumnOrderChange`       | `(field: string, order: number) => void` | Callback for changing column order.                               | `undefined`           |
| `onGridReady`               | `(api: any) => void`             | Callback function called when the grid is initialized.                                                  | `undefined`           |
| `loading`                   | `boolean`                        | Shows a loading indicator overlay on the grid if set to `true`.                                         | `false`               |
| `noDataMessage`             | `string`                         | Message to display when there is no data in the grid.                                                   | `"No data available"` |

### ColumnDef Props

| Prop                        | Type                              | Description                                                                                             | Default               |
|-----------------------------|-----------------------------------|---------------------------------------------------------------------------------------------------------|-----------------------|
| `headerName`                | `string`                          | The name of the column displayed in the header.                                                          | Required              |
| `field`                     | `string`                          | The field name in rowData for this column.                                                               | Required              |
| `sortable`                  | `boolean`                         | Enables sorting for the column.                                                                         | `false`               |
| `filterable`                | `boolean`                         | Enables filtering for the column.                                                                       | `false`               |
| `width`                     | `number`                          | Sets the width of the column.                                                                           | `undefined`           |
| `visible`                   | `boolean`                         | Controls column visibility.                                                                             | `true`                |

## Exports

### Export Options

You can export data from the grid in various formats. By setting the `export` prop, you can enable or disable export buttons for CSV, Excel, and PDF formats.

```javascript
export: {
  csv: true,
  excel: true,
  pdf: true
}
```
## Contributing

Contributions are welcome! Please follow the [contribution guidelines](https://github.com/code-n-code-it-solutions/cnc-grid/blob/main/CONTRIBUTING.md).

## License

This project is licensed under the ISC License. See the [LICENSE](https://github.com/code-n-code-it-solutions/cnc-grid/blob/main/LICENSE) file for more information.

## Author

Developed by [Syed Suhaib Zia](https://suhaibzia.com) from [Code N Code IT Solutions](https://codencode.ae).

- **Email**: suhaibzia786@gmail.com
- **Organization**: [Code N Code IT Solutions](https://codencode.ae)

## Links

- **Homepage**: [https://cnc-ui.com/cnc-grid](https://cnc-ui.com/cnc-grid)
- **Repository**: [GitHub](https://github.com/code-n-code-it-solutions/cnc-grid)