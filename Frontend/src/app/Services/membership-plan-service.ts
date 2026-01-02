import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembershipPlanService {

  private baseUrl = 'http://localhost:5114/api/MembershipPlan';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('jwtToken');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
  }

  getAllMembershipPlans(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/getAllMembershipPlan`,
      this.getAuthHeaders()
    );
  }

  getPlanById(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/${id}`,
      this.getAuthHeaders()
    );
  }

  addOrUpdatePlan(id: number, request: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/addOrUpdate?id=${id}`,
      request,
      this.getAuthHeaders()
    );
  }

  filterPlans(filter: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/getByFilter`,
      filter,
      this.getAuthHeaders()
    );
  }

  deletePlan(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/delete/${id}`,
      this.getAuthHeaders()
    );
  }
}
