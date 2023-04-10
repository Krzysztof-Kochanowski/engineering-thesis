import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageSheetsComponent} from "app/features/manage-sheets/manage-sheets.component";

const childRoutes: Routes = [
  {
    path: '',
    component: ManageSheetsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ManageSheetsRoutingModule { }
