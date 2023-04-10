import {Customer} from "shared/models/customer.model";

export interface CustomerAbsence {
  id?: number;
  customer: Customer;
  startDate: string;
  endDate: string;
}
