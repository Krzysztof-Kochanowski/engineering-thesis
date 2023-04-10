import {Person} from "shared/models/person";

export interface Customer extends Person {
  id?: number;
  organizationName: string;
}
