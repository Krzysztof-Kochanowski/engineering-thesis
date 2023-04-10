import {VisitDetails} from "shared/models/visit-details.model";
import {Employee} from "shared/models/employee.model";
import {PlannedVisit} from "shared/models/planned-visit.model";

export interface Visit {
  dateTime: string;
  visitDetailsList: VisitDetails[];
  id?: number;
  employee: Employee;
  plannedVisit?: PlannedVisit;
}
