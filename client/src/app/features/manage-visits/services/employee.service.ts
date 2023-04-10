import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "environments/environment";
import {handleHttpObservable} from "shared/utilities/http.helper";
import {Employee} from "shared/models/employee.model";

@Injectable()
export class EmployeeService {
  private employee = new Subject<Employee>();
  employee$ = this.employee.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  refreshEmployee(employeeId: number) {
    handleHttpObservable<Employee>(
      this.http.get<Employee>(environment.apiUrl + `/employee/${employeeId}`),
      (x) => this.employee.next(x)).subscribe();
  }
}
