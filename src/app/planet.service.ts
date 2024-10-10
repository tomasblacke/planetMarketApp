import { Injectable } from '@angular/core';

export interface Planet {
  name: string;
  image: string;
  available: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class PlanetService {
  planets: Planet[] = [
    { name: 'Mars', image: 'assets/marte.jpeg', available: true },
    { name: 'Saturn', image: 'assets/saturno.jpg', available: true },
    { name: 'Moon', image: 'assets/luna.JPG', available: false },
  ];
  getPlanets() {
    return this.planets;
  }

  constructor() { }
}
