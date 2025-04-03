import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service'; // importe AuthService
import { Constants } from '../constants';
import { User, UserLogin } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class SigninService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  public connected!: User;
  public signupUser(user: User): Observable<any> {
    return this.http
      .post<any>(Constants.SIGNUP_API, user, { observe: 'response' })
      .pipe(map((res) => res));
  }

  public loginUser(user: UserLogin): Observable<any> {
    return this.http
      .post<any>(Constants.LOGIN_API, user, { observe: 'response' })
      .pipe(
        map((res) => {
          const token = res.body.token;
          if (token) {
            this.authService.saveToken(token);
            this.saveConnectedUser();
          }
          return res;
        })
      );
  }
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${Constants.USERS_API}/${id}`);
  }

  saveConnectedUser(): void {
    const userData = this.authService.getUserFromToken();
    this.getUserById(userData.id).subscribe({
      next: (user) => {
        this.connected = user;
        sessionStorage.setItem('connected_admin', JSON.stringify(user));
      },
      error: (err) => {
        console.error('Error fetching connected user:', err);
      }
    });
  }
  getConnectedUser(): User {
    const storedUser = JSON.parse(sessionStorage.getItem('connected_admin')!) as User;
    return storedUser;
  }
  deconnexion(){
    sessionStorage.clear();
  }
}
