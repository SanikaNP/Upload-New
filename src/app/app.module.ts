import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
// ag-grid
import { AgGridModule } from "@ag-grid-community/angular"; // Importing AgGridModule

// application
import { AppComponent } from "./app.component";
// rich grid
import { RichGridComponent } from "./rich-grid-example/rich-grid.component";
import { DateComponent } from "./date-component/date.component";
import { SortableHeaderComponent } from "./header-component/sortable-header.component";
import { HeaderGroupComponent } from "./header-group-component/header-group.component";
import { RendererComponent } from './renderer-component/renderer.component';
import { ProficiencyFilter } from "./filters/proficiency.component.filter";
import { SkillFilter } from "./filters/skill.component.filter";
import * as FileSaver from 'file-saver';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AgGridModule // Correctly importing AgGridModule without withComponents
    ],
    declarations: [
        AppComponent,
        RichGridComponent,
        DateComponent,
        SortableHeaderComponent,
        HeaderGroupComponent,
        RendererComponent,
        ProficiencyFilter,
        SkillFilter,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
