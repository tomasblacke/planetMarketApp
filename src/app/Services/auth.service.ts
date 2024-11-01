import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/v1/clientes'; // Cambia esta URL a tu endpoint de autenticación

  constructor(private http: HttpClient) { }

  // Método para el login de usuario
  login(credentials: { name: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/traer`, credentials);
  }

  // Método para el registro de usuario
  register(user: { name: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, user);
  }
}

