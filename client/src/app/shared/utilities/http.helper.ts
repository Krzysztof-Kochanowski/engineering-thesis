import {catchError, map, Observable, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

export function handleHttpObservable<Type>(
  httpObservable: Observable<Type>,
  action?: (x: Type) => void,
  errorAction?: (err: any) => void
): Observable<Type> {
  return httpObservable.pipe(
    map(x => {
      if (x instanceof HttpErrorResponse)
        throw x;
      if (action)
        action(x);
      return x;
    })
  ).pipe(
    catchError(err => {
      if (errorAction)
        errorAction(err);
      return throwError(err);
    })
  );
}

function buildUrl(apiUrl: string, endpoint: string) {

}
