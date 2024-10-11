import { Component, ViewEncapsulation } from '@angular/core';
import { GridApi, Module, ColDef, ColGroupDef, GridReadyEvent, CellClickedEvent, CellDoubleClickedEvent, CellContextMenuEvent, ICellRendererParams } from '@ag-grid-community/core'; 
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { MenuModule } from '@ag-grid-enterprise/menu';
import { SideBarModule } from '@ag-grid-enterprise/side-bar';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { FiltersToolPanelModule } from '@ag-grid-enterprise/filter-tool-panel';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { StatusBarModule } from '@ag-grid-enterprise/status-bar';
import { RendererComponent } from '../renderer-component/renderer.component';
import RefData from '../data/refData';
import { HeaderGroupComponent } from '../header-group-component/header-group.component';
import * as XLSX from 'xlsx'; // Import the xlsx library
import * as FileSaver from 'file-saver'; // Import the file-saver library


@Component({
    selector: 'rich-grid',
    templateUrl: 'rich-grid.component.html',
    styleUrls: ['rich-grid.css', 'proficiency-renderer.css'],
    encapsulation: ViewEncapsulation.None
})
export class RichGridComponent {
    public rowData!: any[];
    public columnDefs!: (ColDef | ColGroupDef)[];
    public rowCount!: string;
    public defaultColDef: ColDef;
    public components: any;
    public sideBar!: boolean;
    public modules: Module[] = [
        ClientSideRowModelModule,
        MenuModule,
        SideBarModule,
        ColumnsToolPanelModule,
        FiltersToolPanelModule,
        StatusBarModule,
        RowGroupingModule
    ];
    public api!: GridApi;
showDownloadOptions: any;

    constructor() {
        this.defaultColDef = {
            editable: true,  // Make all cells editable
            filter: true,
            floatingFilter: true,
            headerComponent: 'sortableHeaderComponent',
            headerComponentParams: {
                menuIcon: 'fa-bars'
            },
            cellDataType: false,
        };

        this.components = {
            headerGroupComponent: HeaderGroupComponent,
            rendererComponent: RendererComponent
        };

        this.createRowData();
        this.createColumnDefs();
    }

    public openDownloadOptions() {
        this.showDownloadOptions = !this.showDownloadOptions;
    }

    // Download JSON
    public downloadJson() {
        const jsonData = JSON.stringify(this.rowData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        FileSaver.saveAs(blob, 'data.json');
    }

    // Download XLSX
    public downloadXlsx() {
        const worksheet = XLSX.utils.json_to_sheet(this.rowData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'data.xlsx');
    }

    public createRowData() {
        const rowData: any[] = [];

        for (let i = 0; i < 200; i++) {
            const EmpData = RefData.EmpId[i % RefData.EmpId.length];
            rowData.push({
                name: RefData.firstNames[i % RefData.firstNames.length] + ' ' + RefData.lastNames[i % RefData.lastNames.length],
                dob: RefData.DOBs[i % RefData.DOBs.length],
                address: RefData.addresses[i % RefData.addresses.length],
                years: Math.round(Math.random() * 100),
                EmployeeId: EmpData.EmployeeId,
                mobile: createRandomPhoneNumber(),
                department: RefData.departments[i % RefData.departments.length],
                position: RefData.positions[i % RefData.positions.length],
                salary: Math.floor(Math.random() * 90000) + 10000 // Random salary between 10,000 and 100,000
            });
        }

        this.rowData = rowData;
    }

    private createColumnDefs() {
        this.columnDefs = [
            {
                headerName: '#',
                width: 40,
                checkboxSelection: true,
                filter: false,
                sortable: false,
                suppressMenu: true,
                pinned: true
            },
            {
                headerName: 'Employee',
                headerGroupComponent: 'headerGroupComponent',
                children: [
                    {
                        field: 'name',
                        width: 150,
                        pinned: true,
                        enableRowGroup: true,
                        enablePivot: true
                    },
                    {
                        field: 'EmployeeId',
                        width: 150,
                        pinned: true,
                        enableRowGroup: true,
                        enablePivot: true,
                        columnGroupShow: 'open'
                    },
                    {
                        headerName: 'DOB',
                        field: 'dob',
                        width: 195,
                        pinned: true,
                        cellRenderer: (params: ICellRendererParams) => {
                            return pad(params.value.getDate(), 2) + '/' +
                                pad(params.value.getMonth() + 1, 2) + '/' +
                                params.value.getFullYear();
                        },
                        filter: 'agDateColumnFilter',
                        columnGroupShow: 'open'
                    }
                ]
            },
            {
                headerName: 'Contact',
                children: [
                    {
                        field: 'mobile',
                        minWidth: 150,
                        filter: 'agTextColumnFilter'
                    },
                    {
                        field: 'address',
                        minWidth: 500,
                        filter: 'agTextColumnFilter'
                    }
                ]
            },
            {
                headerName: 'Employment Details',
                children: [
                    {
                        field: 'department',
                        headerName: 'Department',
                        minWidth: 150,
                        filter: 'agTextColumnFilter'
                    },
                    {
                        field: 'position',
                        headerName: 'Position',
                        minWidth: 150,
                        filter: 'agTextColumnFilter'
                    },
                    {
                        field: 'salary',
                        headerName: 'Salary',
                        minWidth: 150,
                        filter: 'agNumberColumnFilter'
                    }
                ]
            }
        ];
    }

    private calculateRowCount() {
        if (this.api && this.rowData) {
            const model = this.api.getModel();
            const totalRows = this.rowData.length;
            const processedRows = model.getRowCount();
            this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
        }
    }

    public onModelUpdated() {
        this.calculateRowCount();
    }

    public onGridReady(params: GridReadyEvent) {
        this.api = params.api;
        this.api.sizeColumnsToFit();
        this.calculateRowCount();
    }

    public onCellClicked($event: CellClickedEvent) {}
    public onCellDoubleClicked($event: CellDoubleClickedEvent) {}
    public onCellContextMenu($event: CellContextMenuEvent) {}

    public onQuickFilterChanged($event: any) {
        this.api.setQuickFilter($event.target.value);
    }

    // Method to add a new row below the selected row
    // Method to add a new blank row below the selected row
public addRow() {
    const selectedNodes = this.api.getSelectedNodes();
    if (selectedNodes.length > 0) {
        const selectedNode = selectedNodes[0]; // Get the first selected node

        // Ensure that selectedNode has a valid rowIndex
        if (selectedNode && typeof selectedNode.rowIndex === 'number') {
            // Create a new row with blank fields
            const newRow = {
                name: '',
                dob: null,
                address: '',
                years: null,
                EmployeeId: '',
                mobile: '',
                department: '',
                position: '',
                salary: null
            };

            // Add the new blank row below the selected row
            this.api.applyTransaction({ add: [newRow], addIndex: selectedNode.rowIndex + 1 });
        } else {
            // Handle case where selectedNode does not have a valid row index
            console.warn("Selected node is invalid or does not have a row index.");
        }
    } else {
        // Handle case where no row is selected
        console.warn("No row is selected.");
    }
}


    // Method to delete selected rows
    public delRow() {
        const selectedNodes = this.api.getSelectedNodes();
        const idsToDelete = selectedNodes.map(node => node.data.EmployeeId); // Assuming EmployeeId is unique
        this.api.applyTransaction({ remove: selectedNodes.map(node => node.data) }); // Remove the selected rows
    }
}

function createRandomPhoneNumber() {
    const digits = '0123456789';
    let phoneNumber = '';
    for (let i = 0; i < 10; i++) {
        phoneNumber += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return phoneNumber;
}

function pad(num: number, size: number) {
    let s = "000" + num;
    return s.substr(s.length - size);
}