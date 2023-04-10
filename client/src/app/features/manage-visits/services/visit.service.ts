import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "environments/environment";
import {VisitDetails} from "shared/models/visit-details.model";
import * as moment from "moment";
import {VisitDetailsDto} from "shared/models/visit-details-dto.model";
import {handleHttpObservable} from "shared/utilities/http.helper";

@Injectable()
export class VisitService {

  constructor(
    private http: HttpClient,
  ) { }

  postVisitDetails(visitDetails: VisitDetails, date: moment.Moment, time: { hour: number, minute: number }, employeeId: number): Observable<VisitDetails> {
    const dateTime = date.set({'hour': time.hour, 'minute': time.minute});
    let params = new HttpParams()
      .set('employee-id', employeeId)
      .set('date-time', dateTime.toISOString(true));

    return handleHttpObservable<VisitDetails>(this.http.post<VisitDetails>(environment.apiUrl + `/visit-details`, visitDetails, {params}));
  }

  updateVisitDetails(id: number, visitDetails: VisitDetailsDto, employeeId: number) {
    let params = new HttpParams()
      .set('employee-id', employeeId)
    return handleHttpObservable<VisitDetails>(this.http.put<VisitDetails>(environment.apiUrl + `/visit-details/${id}`, visitDetails, {params}));
  }
}
