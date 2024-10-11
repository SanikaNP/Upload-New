import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Component } from '@angular/core';

@Component({
    selector: 'custom-cell-renderer',
    template: `<div [style.background-color]="params.data.color || 'transparent'" [innerHTML]="params.value"></div>`,
})
export class CustomCellRenderer implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(params: any): boolean {
        this.params = params;
        return true;
    }
}
