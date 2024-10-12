import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap  } from 'rxjs/operators';

export interface Planet {
  id: number;
  name: string;
  type: string;
  diameter: number;
  distanceFromSun: number;
  imageUrl: string;
  price: number;
  available: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class PlanetService {
  private nasaApiKey = 'ccn605v3j7TiIR5kXUEBfOXrocFnCbQes3j1Oea1';
  private nasaImageApi = 'https://images-api.nasa.gov/search?q=';

  private planets: Planet[] = [
    { id: 1, name: 'Mercury', type: 'Terrestrial', diameter: 4879, distanceFromSun: 57.9, imageUrl: '', price: 1000000, available: true },
    { id: 2, name: 'Venus', type: 'Terrestrial', diameter: 12104, distanceFromSun: 108.2, imageUrl: '', price: 2000000, available: true },
    // ... el id del sistema no va a coincidir con los de la url. En URL aparece 1 y si aca lo pones 0 lo toma a mecrurio
  ];

  constructor(private http: HttpClient) { }

  getPlanets(): Observable<Planet[]> {
    return of(this.planets);
  }

  getPlanetById(id: number): Observable<Planet | undefined> {
    console.log('Searching for planet with id:', id);
    return of(this.planets.find(planet => planet.id === id)).pipe(
      tap(planet => console.log('getPlanetById result:', planet))
    );
    /*return this.getPlanets().pipe(
      map(planets => planets.find(planet => planet.id === id)),
      tap(planet => console.log('getPlanetById result:', planet))
    );*/
  }

  getPlanetImage(planetName: string): Observable<string> {
    return this.http.get<any>(`${this.nasaImageApi}${planetName}&media_type=image`).pipe(
      map(response => {
        if (response.collection.items.length > 0 && response.collection.items[0].links.length > 0) {
          return response.collection.items[0].links[0].href;
        }
        throw new Error('No image found');
      }),
      catchError(error => {
        console.error('Error fetching planet image:', error);
        return of(''); // Return a default image URL or empty string
      })
    );
  }


}
