import {NgModule} from '@angular/core';

import {ManageAbsencesComponent} from './manage-absences.component';
import {ManageAbsencesRoutingModule} from "app/features/manage-absences/manage-absences-routing.module";
import {SharedModule} from "shared/shared.module";
import {ManageVisitsModule} from "app/features/manage-visits/manage-visits.module";
import {
  AddEmployeeAbsenceFormComponent
} from "app/features/manage-absences/components/add-employee-absence-form/add-employee-absence-form.component";
import {EmployeeAbsenceService} from "app/features/manage-absences/services/employee-absence.service";
import {SharedDataService} from "app/core/services/shared-data.service";
import {
  AddCustomerAbsenceFormComponent
} from './components/add-customer-absence-form/add-customer-absence-form.component';
import {CustomerAbsenceService} from "app/features/manage-absences/services/customer-absence.service";
import {EmployeeAbsencesComponent} from './components/employee-absences/employee-absences.component';
import {CustomerAbsencesComponent} from './components/customer-absences/customer-absences.component';
import {
  CustomerAbsencesOptionsComponent
} from './components/customer-absences-options/customer-absences-options.component';
import {
  EmployeeAbsencesOptionsComponent
} from './components/employee-absences-options/employee-absences-options.component';
import {CustomerAbsencesItemComponent} from './components/customer-absences-item/customer-absences-item.component';
import {EmployeeAbsencesItemComponent} from './components/employee-absences-item/employee-absences-item.component';


@NgModule({
  declarations: [
    ManageAbsencesComponent,
    AddEmployeeAbsenceFormComponent,
    AddCustomerAbsenceFormComponent,
    EmployeeAbsencesComponent,
    CustomerAbsencesComponent,
    CustomerAbsencesOptionsComponent,
    EmployeeAbsencesOptionsComponent,
    CustomerAbsencesItemComponent,
    EmployeeAbsencesItemComponent
  ],
  imports: [
    ManageAbsencesRoutingModule,
    SharedModule,
    ManageVisitsModule
  ],
  providers: [
    SharedDataService,
    EmployeeAbsenceService,
    CustomerAbsenceService
  ]
})
export class ManageAbsencesModule { }
