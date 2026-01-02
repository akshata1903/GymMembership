import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
   private baseUrl = 'http://localhost:5114/api/Payment';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllPayments(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/getAllPayment`,
      { headers: this.getHeaders() }
    );
  }

  addOrUpdate(id: number, data: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/addOrUpdatePayment?id=${id}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  getByFilter(filter: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/getByFilter`,
      filter,
      { headers: this.getHeaders() }
    );
  }
    getMyPayments(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/my-payments`,
      { headers: this.getHeaders() }
    );
  }

  deletePayment(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/delete/${id}`,
      { headers: this.getHeaders() }
    );
  }
  
}
