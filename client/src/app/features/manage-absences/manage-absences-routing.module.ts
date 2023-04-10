import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManageAbsencesComponent} from "app/features/manage-absences/manage-absences.component";

const childRoutes: Routes = [
  {
    path: '',
    component: ManageAbsencesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ManageAbsencesRoutingModule { }
