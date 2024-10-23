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
    { id: 3, name: 'Mars', type: 'Terrestrial', diameter: 12178, distanceFromSun: 227.9, imageUrl: '', price: 3000000, available: true },
    { id: 4, name: 'Earth Moon', type: 'Terrestrial', diameter: 1200, distanceFromSun: 384.4, imageUrl: '', price: 6000000, available: true },
    { id: 5, name: 'Jupiter', type: 'Gas Giant', diameter: 139820, distanceFromSun: 778.5, imageUrl: '', price: 5000000, available: true },
    { id: 6, name: 'Saturn', type: 'Gas Giant', diameter: 116460, distanceFromSun: 1434.0, imageUrl: '', price: 4500000, available: true },
    { id: 7, name: 'Uranus', type: 'Ice Giant', diameter: 50724, distanceFromSun: 2871.0, imageUrl: '', price: 4000000, available: true },
    { id: 8, name: 'Neptune', type: 'Ice Giant', diameter: 49244, distanceFromSun: 4495.1, imageUrl: '', price: 4000000, available: true },
    { id: 9, name: 'Pluto', type: 'Dwarf Planet', diameter: 2376, distanceFromSun: 5906.4, imageUrl: '', price: 3500000, available: true },
    { id: 10, name: 'Ganymede Moon', type: 'Moon', diameter: 5268, distanceFromSun: 778.5, imageUrl: '', price: 2500000, available: true },
    { id: 11, name: 'Titan Moon', type: 'Moon', diameter: 5150, distanceFromSun: 1434.0, imageUrl: '', price: 2400000, available: true },
    { id: 12, name: 'Europa Moon', type: 'Moon', diameter: 3121, distanceFromSun: 778.5, imageUrl: '', price: 2200000, available: true },
    { id: 13, name: 'Enceladus Moon', type: 'Moon', diameter: 504, distanceFromSun: 1434.0, imageUrl: '', price: 2000000, available: true }

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
    return this.http.get<any>(`${this.nasaImageApi}${'planet '+planetName}&media_type=image`).pipe(//aca le pide a la api que le traiga el nombre que tiene y planet adelante
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
  searchPlanets(term: string): Promise<any[]> {
    return new Promise(resolve => {
      const results = this.planets.filter(planet => 
        planet.name.toLowerCase().includes(term.toLowerCase()) ||
        planet.type.toLowerCase().includes(term.toLowerCase())
      );
      resolve(results);
    });
  }


}
