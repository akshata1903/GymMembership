// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class MemberService {

//    private apiUrl = 'http://localhost:5114/api/Member';

//   constructor(private http: HttpClient) {}

//   getAllMembers(): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/getAllMember`);
//   }

//   getMemberById(id: number): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/${id}`);
//   }

//   addMember(request: any): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/addMember`, request);
//   }

//   updateMember(id: number, request: any): Observable<any> {
//     return this.http.put<any>(`${this.apiUrl}/updateMember/${id}`, request);
//   }

//   deleteMember(id: number): Observable<any> {
//     return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
// }
// }


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {

  private apiUrl = 'http://localhost:5114/api/Member';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllMembers(): Observable<any> {
   
    return this.http.get<any>(
      `${this.apiUrl}/getAllMember`,
      { headers: this.getAuthHeaders() }
    );
  }

  getMemberById(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
  getMyMember(): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/my-member`,
    { headers: this.getAuthHeaders() }
  );
}

  addMember(request: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/addMember`,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  updateMember(id: number, request: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/updateMember/${id}`,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteMember(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/delete/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
