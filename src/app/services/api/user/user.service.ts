import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = environment.API_URL + 'users/';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Token ' + environment.TOKEN,
    })
  };

  constructor(private http: HttpClient) { }


  // POST
  public addUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user, this.httpOptions);
  }
}
