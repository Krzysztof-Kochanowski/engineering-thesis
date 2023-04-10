import {Employee} from "shared/models/employee.model";

export interface User {
  id?: number;
  username: string;
  password?: string;
  roles: string[];
  employee?: Employee;
}
