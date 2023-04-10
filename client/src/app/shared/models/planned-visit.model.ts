import {Customer} from "shared/models/customer.model";
import {Employee} from "shared/models/employee.model";
import {Visit} from "shared/models/visit.model";

export interface PlannedVisit {
  visitTime: string;
  customer: Customer;
  employee?: Employee;
  visit?: Visit;
  dayOfWeek?: number;
}
