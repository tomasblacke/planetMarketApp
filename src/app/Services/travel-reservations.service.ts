import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './user-auth.service'; // Suponiendo que tienes un servicio de autenticación
import { map } from 'rxjs/operators';

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
  purchases?: any[];  // La propiedad "purchases" es opcional
}

@Injectable({
  providedIn: 'root'
})
export class TravelReservationsService {
  private COLLECTION_NAME = 'trips'; // Asegúrate de que este sea el nombre correcto de tu colección

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  // Método para obtener todos los viajes desde Firebase
  getTrips(): Observable<SpaceTrip[]> {
    return this.firestore.collection<SpaceTrip>(this.COLLECTION_NAME).valueChanges();
  }

  // Método para obtener un viaje por ID
  getTripById(id: number): Observable<SpaceTrip | undefined> {
    return this.firestore.collection<SpaceTrip>(this.COLLECTION_NAME, ref => ref.where('id', '==', id))
      .valueChanges()
      .pipe(
        map((trips: SpaceTrip[]) => trips.length > 0 ? trips[0] : undefined) // Especifica el tipo de `trips` aquí
      );
  }

  // Método de búsqueda para filtrar los viajes directamente desde Firebase
  searchTrips(term: string): Promise<SpaceTrip[]> {
    return new Promise(resolve => {
      this.getTrips().subscribe(trips => {
        const results = trips.filter(trip => 
          trip.title.toLowerCase().includes(term.toLowerCase()) ||
          trip.description.toLowerCase().includes(term.toLowerCase())
        );
        resolve(results);
      });
    });
  }

  // Método para añadir un viaje a Firebase
  addTripToFirebase(trip: SpaceTrip): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection(this.COLLECTION_NAME).doc(id).set(trip);
  }

  // Método para agregar todos los viajes de una vez a Firebase (puedes usarlo para migrar los datos iniciales)
  /*addAllTripsToFirebase(): void {
    const trips: SpaceTrip[] = [
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
      }
    ];

    trips.forEach(trip => {
      this.addTripToFirebase(trip).then(() => {
        console.log (`Trip to ${trip.destination} added successfully!`);
      }).catch(error => {
        console.error(`Error adding trip to ${trip.destination}:`, error);
      });
    });
  }*/

  // Método para procesar la compra de un viaje
  async processPurchase(
    tripId: string,
    seatsToBuy: number
  ): Promise<{ success: boolean; message: string; transaction?: any }> {
    try {
      const currentUser  = await this.authService.getCurrentUser ();
      if (!currentUser ) {
        return {
          success: false,
          message: 'You must be logged in'
        };
      }
  
      const tripsQuerySnapshot = await this.firestore
        .collection(this.COLLECTION_NAME)
        .ref
        .where('id', '==', parseInt(tripId))
        .get();
  
      if (tripsQuerySnapshot.empty) {
        console.error(`Trip with ID ${tripId} not found.`);
        return { 
          success: false, 
          message: 'Viaje no encontrado' 
        };
      }
  
      const tripRef = this.firestore
        .collection(this.COLLECTION_NAME)
        .doc(tripsQuerySnapshot.docs[0].id);
  
      return await this.firestore.firestore.runTransaction(async transaction => {
        const tripDoc = await transaction.get(tripRef.ref);
        if (!tripDoc.exists) {
          console.error(`Trip with ID ${tripId} not found in transaction.`);
          return { success: false, message: 'Viaje no encontrado' };
        }
  
        const tripData = tripDoc.data() as SpaceTrip;
        const userRef = this.firestore.collection('users').doc(currentUser .uid);
        const userDoc = await transaction.get(userRef.ref);
        const userData = userDoc.data() as any;
  
        const userTripRef = this.firestore
          .collection('users')
          .doc(currentUser .uid)
          .collection('purchasedTrips')
          .doc(tripDoc.id); 
  
        const userTripDoc = await transaction.get(userTripRef.ref);
  
        if (tripData.availableSeats < seatsToBuy) {
          return {
            success: false,
            message: `Solo hay ${tripData.availableSeats} asientos disponibles`
          };
        }
  
        let currentTotalSeats = 0;
        let currentPurchases: any[] = [];
        let currentTotalInvestment = userData?.totalInvestment || 0;
  
        if (userTripDoc.exists) {
          const data = userTripDoc.data() as {
            totalSeats: number;
            purchases: any[];
          };
          currentTotalSeats = data.totalSeats || 0;
          currentPurchases = data.purchases || [];
        }
  
        const purchaseData = {
          userId: currentUser .uid,
          userEmail: currentUser .email,
          tripId: tripDoc.id,
          tripTitle: tripData.title,
          seatsPurchased: seatsToBuy,
          pricePerSeat: tripData.priceByPassanger,
          totalPrice: tripData.priceByPassanger * seatsToBuy,
          purchaseDate: new Date()
        };
  
        const newAvailableSeats = tripData.availableSeats - seatsToBuy;
        transaction.update(tripRef.ref, {
          availableSeats: newAvailableSeats
        });
  
        const purchaseRef = this.firestore.collection('purchases').doc();
        transaction.set(purchaseRef.ref, purchaseData);
  
        transaction.set(
          userTripRef.ref,
          {
            tripId: tripDoc.id,
            tripTitle: tripData.title,
            tripDescription: tripData.description,
            tripImage: tripData.imageUrl,
            totalSeats: currentTotalSeats + seatsToBuy,
            totalInvested: (currentTotalSeats + seatsToBuy) * tripData.priceByPassanger,
            lastPurchase: purchaseData,
            purchases: [...currentPurchases, purchaseData]
          },
          { merge: true }
        );
  
        transaction.update(userRef.ref, {
          totalInvestment: currentTotalInvestment + purchaseData.totalPrice,
          lastPurchase: purchaseData
        });
  
        return {
          success: true,
          message: 'Compra realizada exitosamente',
          transaction: purchaseData
        };
      });
    } catch (error) {
      console.error('Error en el proceso de compra:', error);
      return {
        success: false,
        message: 'Error procesando la compra: ' + (error instanceof Error ? error.message : 'Error desconocido')
      };
    }
  }
}