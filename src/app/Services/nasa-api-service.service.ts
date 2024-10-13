import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NasaApiService {
  private apiKey = 'ccn605v3j7TiIR5kXUEBfOXrocFnCbQes3j1Oea1';
  private apiUrl = 'https://api.nasa.gov/planetary/apod';

  constructor(private http: HttpClient) { }

  getAstronomyPictureOfDay(): Observable<any> {
    return this.http.get(`${this.apiUrl}?api_key=${this.apiKey}`);
  }
}