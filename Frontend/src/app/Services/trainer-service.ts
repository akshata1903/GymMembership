import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {

  private baseUrl = 'http://localhost:5114/api/Trainer';

  constructor(private http: HttpClient) {}

  // ✅ SAME PATTERN AS MemberService
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // ================= GET ALL =================
  getAllTrainers(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/getAllTrainer`,
      { headers: this.getAuthHeaders() }
    );
  }

  // ================= GET BY ID =================
  getTrainerById(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // ================= ADD / UPDATE =================
  addOrUpdate(id: number, data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/AddOrUpdate?id=${id}`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  // ================= GET LOGGED-IN TRAINER =================
  getMyTrainer(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/my-trainer`,
      { headers: this.getAuthHeaders() }
    );
  }

  // ================= FILTER =================
  getByFilter(filter: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/getByFilter`,
      filter,
      { headers: this.getAuthHeaders() }
    );
  }

  // ================= DELETE =================
  deleteTrainer(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/delete/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
