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
    { name: 'Mars', image: 'assets/mars.jpg', available: true },
    { name: 'Saturn', image: 'assets/saturn.jpg', available: true },
    { name: 'Moon', image: 'assets/moon.jpg', available: false },
  ];
  getPlanets() {
    return this.planets;
  }

  constructor() { }
}
