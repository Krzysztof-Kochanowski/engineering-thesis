import {NgModule} from '@angular/core';

import {WorkScheduleRoutingModule} from './work-schedule-routing.module';
import {SharedModule} from "shared/shared.module";
import {CustomDatePipe} from "shared/pipes/custom-date.pipe";
import {WorkScheduleComponent} from './work-schedule.component';


@NgModule({
    declarations: [
        WorkScheduleComponent,
    ],
    imports: [
        WorkScheduleRoutingModule,
        SharedModule,
    ],
    providers: [
        CustomDatePipe
    ]
})
export class WorkScheduleModule { }
