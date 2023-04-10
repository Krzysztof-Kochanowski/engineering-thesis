import {Employee} from "shared/models/employee.model";

export interface UserDto {
  id: number;
  username: string;
  roles: string[];
  employee?: Employee;
}
