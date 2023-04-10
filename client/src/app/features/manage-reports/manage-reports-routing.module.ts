import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageReportsComponent} from "app/features/manage-reports/manage-reports.component";

const childRoutes: Routes = [
  {
    path: '',
    component: ManageReportsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ManageReportsRoutingModule { }
