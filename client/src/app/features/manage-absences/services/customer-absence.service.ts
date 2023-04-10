import {Injectable} from '@angular/core';
import {environment} from "environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {handleHttpObservable} from "shared/utilities/http.helper";
import {SharedDataService} from "app/core/services/shared-data.service";
import {CustomerAbsence} from "shared/models/customer-absence.model";
import * as moment from "moment";
import {Customer} from "shared/models/customer.model";

@Injectable()
export class CustomerAbsenceService {
  private customerAbsences = new BehaviorSubject<CustomerAbsence[]>([]);
  customerAbsences$ = this.customerAbsences.asObservable();

  constructor(
    private http: HttpClient,
    private sharedDataService: SharedDataService
  ) { }

  refreshCustomerAbsences(customer?: Customer, startDate?: moment.Moment, endDate?: moment.Moment) {
    let params = new HttpParams();
    if (customer)
      params = params
        .set('customer-id', customer.id!)
    if (startDate)
      params = params
        .set('start-date', startDate.utc().toISOString(true))
    if (endDate)
      params = params
        .set('end-date', endDate.utc().toISOString(true));
    handleHttpObservable<CustomerAbsence[]>(
      this.http.get<CustomerAbsence[]>(environment.apiUrl + '/customer-absence', {params}),
      (x) => this.customerAbsences.next(x)).subscribe();
  }

  postCustomerAbsence(data: CustomerAbsence): Observable<CustomerAbsence> {
    return handleHttpObservable<CustomerAbsence>(
      this.http.post<CustomerAbsence>(environment.apiUrl + `/customer-absence`, data),
      () => this.refreshCustomerAbsences()
    );
  }

  updateCustomerAbsence(id: number, customerAbsence: CustomerAbsence) {
    return handleHttpObservable<CustomerAbsence>(this.http.put<CustomerAbsence>(environment.apiUrl + `/customer-absence/${id}`, customerAbsence));
  }

  deleteCustomerAbsence(id: number) {
    return handleHttpObservable<CustomerAbsence>(this.http.delete<CustomerAbsence>(environment.apiUrl + `/customer-absence/${id}`));
  }
}
