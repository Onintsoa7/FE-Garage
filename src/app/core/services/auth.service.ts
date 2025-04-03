import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'bo_auth_token';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,private http: HttpClient
  ) {}

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(this.TOKEN_KEY);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserFromToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }

  getListMecanicien(role: string): Observable<User> {
    return this.http.get<User>(`${Constants.USERS_API}/role/${role}`);
  }
  addUser(data: User): Observable<User> {
    return this.http.post<User>(`${Constants.USERS_API}/register`, data);
  }
  countMecaniciens(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${Constants.USERS_API}/mecaniciens/count`);
  }
}
