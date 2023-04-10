import {Injectable} from '@angular/core';
import {environment} from "environments/environment";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";

@Injectable()
export class SheetService {
  private filePosted$ = new Subject<any>();

  constructor(
    private http: HttpClient,
  ) { }

  postExcelFile(file: FormData) {
    this.http.post<any>(
      environment.apiUrl + '/sheet/upload',
      file
    ).subscribe({
      next: response => this.filePosted$.next(response),
      error: err => {
        this.filePosted$.error(err);
        this.filePosted$ = new Subject<any>();
      }
    });

    return this.filePosted$.asObservable();
  }
}
