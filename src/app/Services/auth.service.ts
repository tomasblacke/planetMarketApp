import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://example.com/api/auth'; // Cambia esta URL a tu endpoint de autenticación

  constructor(private http: HttpClient) { }

  // Método para el login de usuario
  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Método para el registro de usuario
  register(user: { username: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
}
