import {Injectable} from '@angular/core';
import {environment} from "environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {EmployeeAbsence} from "shared/models/employee-absence.model";
import {handleHttpObservable} from "shared/utilities/http.helper";
import {Employee} from "shared/models/employee.model";
import * as moment from "moment";

@Injectable()
export class EmployeeAbsenceService {
  private employeeAbsences = new BehaviorSubject<EmployeeAbsence[]>([]);
  employeeAbsences$ = this.employeeAbsences.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  refreshEmployeeAbsences(employee?: Employee, startDate?: moment.Moment, endDate?: moment.Moment) {
    let params = new HttpParams();
    if (employee)
      params = params
        .set('employee-id', employee.id!)
    if (startDate)
      params = params
        .set('start-date', startDate.utc().toISOString(true))
    if (endDate)
      params = params
        .set('end-date', endDate.utc().toISOString(true));
    handleHttpObservable<EmployeeAbsence[]>(
      this.http.get<EmployeeAbsence[]>(environment.apiUrl + '/employee-absence', {params}),
      (x) => this.employeeAbsences.next(x)).subscribe();
  }

  postEmployeeAbsence(data: EmployeeAbsence): Observable<EmployeeAbsence> {
    return handleHttpObservable<EmployeeAbsence>(
      this.http.post<EmployeeAbsence>(environment.apiUrl + `/employee-absence`, data),
      () => this.refreshEmployeeAbsences()
    );
  }

  updateEmployeeAbsence(id: number, employeeAbsence: EmployeeAbsence) {
    return handleHttpObservable<EmployeeAbsence>(this.http.put<EmployeeAbsence>(environment.apiUrl + `/employee-absence/${id}`, employeeAbsence));
  }

  deleteEmployeeAbsence(id: number) {
    return handleHttpObservable<EmployeeAbsence>(this.http.delete<EmployeeAbsence>(environment.apiUrl + `/employee-absence/${id}`));
  }
}
