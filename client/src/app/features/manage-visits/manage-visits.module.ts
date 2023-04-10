import {NgModule} from '@angular/core';
import {ManageVisitsComponent} from './manage-visits.component';
import {VisitDetailsComponent} from './components/visit-details/visit-details.component';
import {AddVisitDetailsFormComponent} from './components/add-visit-details-form/add-visit-details-form.component';
import {SharedModule} from "shared/shared.module";
import {VisitDetailsItemComponent} from './components/visit-details-item/visit-details-item.component';
import {VisitTableComponent} from './components/visit-table/visit-table.component';
import {ManageVisitsRoutingModule} from "app/features/manage-visits/manage-visits-routing.module";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {CustomDatePipe} from "shared/pipes/custom-date.pipe";
import {TabMenuComponent} from './components/tab-menu/tab-menu.component';
import {SharedDataService} from "app/core/services/shared-data.service";
import {VisitService} from "app/features/manage-visits/services/visit.service";

@NgModule({
  declarations: [
    ManageVisitsComponent,
    VisitDetailsComponent,
    AddVisitDetailsFormComponent,
    VisitDetailsItemComponent,
    VisitTableComponent,
    TabMenuComponent
  ],
  imports: [
    SharedModule,
    ManageVisitsRoutingModule,
    NgxMatSelectSearchModule
  ],
  exports: [
    ManageVisitsComponent,
    VisitDetailsComponent,
    AddVisitDetailsFormComponent,
    VisitDetailsItemComponent,
    VisitTableComponent,
    TabMenuComponent,
    NgxMatSelectSearchModule
  ],
  providers: [
    CustomDatePipe,
    SharedDataService,
    VisitService,
  ]
})
export class ManageVisitsModule { }
