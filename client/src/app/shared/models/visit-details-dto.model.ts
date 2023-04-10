import {Customer} from "shared/models/customer.model";

export interface VisitDetailsDto {
  status: string;
  comment: string;
  customer: Customer;
  substitutingEmployeeId?: number;
}
