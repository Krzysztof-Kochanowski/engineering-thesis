import {Person} from "shared/models/person";

export interface Employee extends Person {
  id?: number;
  username: string;
}


