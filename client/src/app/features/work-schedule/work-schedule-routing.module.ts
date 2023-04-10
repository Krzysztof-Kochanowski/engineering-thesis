import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WorkScheduleComponent} from "app/features/work-schedule/work-schedule.component";

const routes: Routes = [
  {
    path: '',
    component: WorkScheduleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkScheduleRoutingModule { }
