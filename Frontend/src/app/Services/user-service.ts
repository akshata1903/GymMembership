import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5114/api/User';

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(null);
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  // ❌ EXISTING (kept as-is, even though JWT doesn't contain MemberId)
  getMemberId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.memberId ?? payload.MemberID ?? null;
    } catch {
      return null;
    }
  }

  // ✅ NEW: READ USER ID FROM JWT (THIS IS WHAT YOU NEED)
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      return (
        payload.userId ||
        payload.UserId ||
        payload.sub ||
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        null
      );
    } catch {
      return null;
    }
  }

  // -------------------- API Calls --------------------
  login(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, request);
  }

  register(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, request);
  }

  // -------------------- Token Handling --------------------
  saveToken(token: string) {
    localStorage.setItem('jwtToken', token);
    this.loadUserFromToken();     // <-- Trigger refresh
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');

    this.isLoggedInSubject.next(false);
    this.roleSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // -------------------- Decode JWT & Set Role --------------------
  private loadUserFromToken() {
    const token = this.getToken();

    if (!token) {
      this.isLoggedInSubject.next(false);
      this.roleSubject.next(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const role =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        payload.role ||
        payload.Role ||
        null;

      if (!role) {
        this.logout();
        return;
      }

      localStorage.setItem('role', role);

      this.roleSubject.next(role);
      this.isLoggedInSubject.next(true);

    } catch (err) {
      console.error("Invalid token!", err);
      this.logout();
    }
  }
}
