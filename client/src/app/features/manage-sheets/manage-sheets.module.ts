import {NgModule} from '@angular/core';
import {AddSheetFormComponent} from './components/add-sheet-form/add-sheet-form.component';
import {SharedModule} from "shared/shared.module";
import {ManageSheetsComponent} from './manage-sheets.component';
import {SavedSheetsComponent} from "./components/saved-sheets/saved-sheets.component";
import {ManageSheetsRoutingModule} from "app/features/manage-sheets/manage-sheets-routing.module";
import {WorkScheduleOptionsComponent} from './components/work-schedule-options/work-schedule-options.component';
import {SharedDataService} from "app/core/services/shared-data.service";
import {SheetService} from "app/features/manage-sheets/services/sheet.service";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {FileSaverModule} from "ngx-filesaver";

@NgModule({
  declarations: [
    AddSheetFormComponent,
    ManageSheetsComponent,
    SavedSheetsComponent,
    WorkScheduleOptionsComponent
  ],
  imports: [
    SharedModule,
    ManageSheetsRoutingModule,
    NgxMatSelectSearchModule,
    FileSaverModule
  ],
  providers: [
    SharedDataService,
    SheetService
  ]
})
export class ManageSheetsModule { }
