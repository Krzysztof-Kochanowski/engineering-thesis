import {Employee} from "shared/models/employee.model";

export interface EmployeeAbsence {
  id?: number;
  employee: Employee;
  startDate: string;
  endDate: string;
}
