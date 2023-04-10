import {Injectable} from '@angular/core';
import {environment} from "environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Employee} from "shared/models/employee.model";
import {handleHttpObservable} from "shared/utilities/http.helper";
import {Sheet} from "shared/models/sheet.model";
import {PlannedVisit} from "shared/models/planned-visit.model";
import {Visit} from "shared/models/visit.model";
import * as moment from "moment";
import {Customer} from "shared/models/customer.model";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private visits = new BehaviorSubject<Visit[]>([]);
  private sheets = new BehaviorSubject<Sheet[]>([]);
  private employees = new BehaviorSubject<Employee[]>([]);
  private customers = new BehaviorSubject<Customer[]>([]);
  private plannedVisits = new BehaviorSubject<PlannedVisit[][]>([]);
  visits$ = this.visits.asObservable();
  sheets$ = this.sheets.asObservable();
  employees$ = this.employees.asObservable();
  customers$ = this.customers.asObservable();
  plannedVisits$ = this.plannedVisits.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  handleGetRequest<Type>(
    endpoint: string,
    params?: HttpParams,
    action?: (x: Type) => void,
    errorAction?: (err: any) => void,
    apiUrl?: string,
  ): Observable<Type> {
    const url = (apiUrl || environment.apiUrl) + endpoint;
    const httpObservable = this.http.get<Type>(url, {params});
    return handleHttpObservable<Type>(httpObservable, action, errorAction)
  }

  refreshVisits(date: moment.Moment, employeeId: number) {
    if (!employeeId) {
      this.visits.next([]);
      return;
    }
    const dateTime = date.clone().startOf("day").hours(12);
    let params = new HttpParams()
      .set('employee-id', employeeId)
      .set('date-time', dateTime.toISOString(true));

    this.handleGetRequest<Visit[]>('/visit/day', params, (x) => this.visits.next(x)).subscribe();
  }

  refreshSheets() {
    this.handleGetRequest<Sheet[]>('/sheet', undefined, (x) => this.sheets.next(x)).subscribe();
  }

  refreshEmployees() {
    this.handleGetRequest<Employee[]>('/employee', undefined, (x) => this.employees.next(x)).subscribe();
  }

  refreshCustomers() {
    this.handleGetRequest<Customer[]>('/customer', undefined, (x) => this.customers.next(x)).subscribe();
  }

  refreshPlannedVisits(sheetId: number, employeeId: number) {
    if (!employeeId) {
      this.plannedVisits.next([]);
      return;
    }

    let params = new HttpParams().set('sheet-id', sheetId);
    params = params.set('employee-id', employeeId);

    this.handleGetRequest<PlannedVisit[][]>('/planned-visit/week', params, (x) => this.plannedVisits.next(x)).subscribe();
  }
}
