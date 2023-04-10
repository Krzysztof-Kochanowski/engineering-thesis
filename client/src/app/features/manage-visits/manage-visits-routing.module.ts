import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageVisitsComponent} from "app/features/manage-visits/manage-visits.component";

const routes: Routes = [
  {
    path: '',
    component: ManageVisitsComponent
  },
  {
    path: ':employee-id',
    component: ManageVisitsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageVisitsRoutingModule { }
