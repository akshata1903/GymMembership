import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
    private baseUrl = 'http://localhost:5114/api/Session';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllSessions(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/getAllSessions`,
      { headers: this.getAuthHeaders() }
    );
  }

  getSessionById(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  addOrUpdate(id: number, data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/AddOrUpdate?id=${id}`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  getSessionsByFilter(filter: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/GetByFilter`,
      filter,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteSession(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/delete/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
  
}
