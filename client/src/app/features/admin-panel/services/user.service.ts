import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {handleHttpObservable} from "shared/utilities/http.helper";
import {environment} from "environments/environment";
import {User} from "shared/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users = new BehaviorSubject<User[]>([]);
  users$ = this.users.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  refreshUsers() {
    handleHttpObservable<User[]>(
      this.http.get<User[]>(environment.apiUrl + '/user'),
      (x) => this.users.next(x)).subscribe();
  }

  postUser(data: User): Observable<User> {
    return handleHttpObservable<User>(
      this.http.post<User>(environment.apiUrl + `/user`, data),
      () => this.refreshUsers()
    );
  }

  updateUser(id: number, user: User) {
    return handleHttpObservable<User>(this.http.put<User>(environment.apiUrl + `/user/${id}`, user));
  }

  deleteUser(id: number) {
    return handleHttpObservable<User>(this.http.delete<User>(environment.apiUrl + `/user/${id}`));
  }
}
