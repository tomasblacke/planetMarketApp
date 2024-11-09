import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface SpaceTrip {
  id: number;
  title: string;
  description: string;
  departure: Date;
  origin: string;
  destination: string;
  availableSeats: number;
  imageUrl: string;
  priceByPassanger: number;
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
      priceByPassanger: 20000,
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
      priceByPassanger: 20000,
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
      priceByPassanger: 20000,
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
      priceByPassanger: 20000,
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
      priceByPassanger: 20000,
      imageUrl: "/assets/planet-travel-moon.png"
    },
    
  ];

  constructor(private firestore: AngularFirestore) {}

  getTrips(): Observable<SpaceTrip[]> {
    return of(this.trips);
  }

  getTripById(id: number): Observable<SpaceTrip | undefined> {
    return of(this.trips.find(trip => trip.id === id));
  }

  /* MISMO CASO QUE EL DE PLANETAS PERO PARA TRIPS */
  searchTrips(term: string): Promise<any[]> {
    return new Promise(resolve => {
      const results = this.trips.filter(trip => 
        trip.title.toLowerCase().includes(term.toLowerCase()) ||
        trip.description.toLowerCase().includes(term.toLowerCase())
      );
      resolve(results);
    });
  }

  // Nueva función para agregar un viaje a Firebase
  addTripToFirebase(trip: SpaceTrip): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('trips').doc(id).set(trip);
  }

  // Función para agregar todos los viajes hardcodeados a Firebase
  addAllTripsToFirebase(): void {
    this.trips.forEach(trip => {
      this.addTripToFirebase(trip).then(() => {
        console.log(`Trip to ${trip.destination} added successfully!`);
      }).catch(error => {
        console.error(`Error adding trip to ${trip.destination}:`, error);
      });
    });
  }
}
