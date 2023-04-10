import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {handleHttpObservable} from "shared/utilities/http.helper";
import {environment} from "environments/environment";
import {saveAs} from "file-saver";

@Injectable()
export class ReportService {
  private reports = new BehaviorSubject<string[]>([]);
  reports$ = this.reports.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  public downloadFile(response: any) {
    const blob = new Blob([response.body], { type: response.headers.get('content-type') });
    let fileName: string = "download"
    if (response.headers.get('content-disposition')) {
      fileName = response.headers.get('content-disposition').split('filename=')[1].split(';')[0].replaceAll('"','');
    }
    const file = new File([blob], fileName, { type: response.headers.get('content-type') });
    saveAs(file);
  }

  downloadReport (fileName: string) {
    this.http.get(environment.apiUrl + `/report/${fileName}`,{ responseType: 'blob', observe: 'response' }
    ).subscribe(response => this.downloadFile(response));
  }

  refreshReports() {
    handleHttpObservable<string[]>(
      this.http.get<string[]>(environment.apiUrl + `/report`),
      (x) => this.reports.next(x)).subscribe();
  }

  generateReport(data: Object): Observable<HttpResponse<Blob>> {
    return handleHttpObservable<HttpResponse<Blob>>(
      this.http.post(environment.apiUrl + `/report/generate`, data,{ responseType: 'blob', observe: 'response' }),
      (response) => {
        this.refreshReports();
        this.downloadFile(response);
      }
    );
  }
}
