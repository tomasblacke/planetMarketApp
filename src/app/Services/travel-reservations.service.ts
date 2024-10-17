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
      title: "Travel to Mars",
      description: "Explore the red planet and discover the great landscape",
      departure: new Date('2025-07-15'),
      origin: "Earth",
      destination: "Mars",
      availableSeats: 5,
      imageUrl: "/assets/planet-travel-mars.webp"
    },
    {
      id: 2,
      title: "Travel to Venus",
      description: "Explore the green planet",
      departure: new Date('2025-09-13'),
      origin: "Earth",
      destination: "Venus",
      availableSeats: 9,
      imageUrl: "/assets/planet-travel-venus.png"
    },
    {
      id: 3,
      title: "Travel to Jupiter",
      description: "Explore Jupiter as close as never before...",
      departure: new Date('2025-09-13'),
      origin: "Earth",
      destination: "Jupiter",
      availableSeats: 9,
      imageUrl: "/assets/planet-travel-jupiter.webp"
    },
    {
      id: 4,
      title: "Travel to Mars",
      description: "Explore Mars as close as never before...",
      departure: new Date('2025-12-08'),
      origin: "Earth",
      destination: "Mars",
      availableSeats: 10,
      imageUrl: "/assets/planet-travel-mars.webp"
    },
    {
      id: 5,
      title: "Travel to the Moon",
      description: "Explore the Darkside of the moon as bright as never before...",
      departure: new Date('2026-03-20'),
      origin: "Earth",
      destination: "Earth Moon", 
      availableSeats: 3,
      imageUrl: "/assets/planet-travel-moon.png"
    },
    
  ];
  getTrips(): Observable<SpaceTrip[]> {
    return of(this.trips);
  }
  /*constructor() { }*/
}
