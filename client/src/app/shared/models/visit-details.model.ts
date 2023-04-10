import {Customer} from "shared/models/customer.model";
import {Visit} from "shared/models/visit.model";
import {Employee} from "shared/models/employee.model";

export interface VisitDetails {
  id?: number;
  status: string;
  comment?: string;
  employee?: Employee;
  customer: Customer;
  substitution?: VisitDetailsWithVisit;
}

export interface VisitDetailsWithVisit extends VisitDetails {
  visit: Visit;
}
