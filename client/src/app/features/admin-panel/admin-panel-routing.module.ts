import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminPanelComponent} from "app/features/admin-panel/admin-panel.component";

const childRoutes: Routes = [
  {
    path: '',
    component: AdminPanelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
