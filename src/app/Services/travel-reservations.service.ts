import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface SpaceTrip {
  id: number;
  title: string;
  description: string;
  departure: Date;
  origin: string;
  destination: string;
  availableSeats: number;
  imageUrl: string;
}


@Injectable({
  providedIn: 'root'
})
export class TravelReservationsService {
  private trips: SpaceTrip[] = [
    {
      id: 1,
      title: "Viaje a Marte",
      description: "Explora el planeta rojo",
      departure: new Date('2025-07-15'),
      origin: "Tierra",
      destination: "Marte",
      availableSeats: 5,
      imageUrl: ""
    },
    {
      id: 2,
      title: "Viaje a Venus",
      description: "Explora el planeta verde",
      departure: new Date('2025-09-13'),
      origin: "Tierra",
      destination: "Venus",
      availableSeats: 9,
      imageUrl: ""
    },
    
  ];
  getTrips(): Observable<SpaceTrip[]> {
    return of(this.trips);
  }
  /*constructor() { }*/
}
