import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './user-auth.service'; // Suponiendo que tienes un servicio de autenticación

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
  private COLLECTION_NAME = 'trips'; // Asegúrate de que este sea el nombre correcto de tu colección
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

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  

  getTrips(): Observable<SpaceTrip[]> {
    return of(this.trips);
  }

  getTripById(id: number): Observable<SpaceTrip | undefined> {
    return of(this.trips.find(trip => trip.id === id));
  }

  searchTrips(term: string): Promise<any[]> {
    return new Promise(resolve => {
      const results = this.trips.filter(trip => 
        trip.title.toLowerCase().includes(term.toLowerCase()) ||
        trip.description.toLowerCase().includes(term.toLowerCase())
      );
      resolve(results);
    });
  }

  // addTripToFirebase(trip: SpaceTrip): Promise<void> {
  //   const id = this.firestore.createId();
  //   return this.firestore.collection('trips').doc(id).set(trip);
  // }
  addTripToFirebase(trip: SpaceTrip): Promise<void> {
    const id = this.firestore.createId(); // Genera un nuevo ID
    trip.id = parseInt(id); // Asigna el ID generado al viaje
    return this.firestore.collection(this.COLLECTION_NAME).doc(id).set(trip)
      .then(() => console.log(`Viaje ${trip.title} agregado exitosamente.`))
      .catch(error => {
        console.error("Error al agregar el viaje: ", error);
        throw error; // Propagar el error para manejarlo en el componente
      });
  }

  addAllTripsToFirebase(): void {
    this.trips.forEach(trip => {
      this.addTripToFirebase(trip).then(() => {
        console.log(`Trip to ${trip.destination} added successfully!`);
      }).catch(error => {
        console.error(`Error adding trip to ${trip.destination}:`, error);
      });
    });
  }



  /*async processPurchase(
    tripId: string,
    seatsToBuy: number
  ): Promise<{ success: boolean; message: string; transaction?: any }> {
    try {
      const currentUser = await this.authService.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: 'You must be logged in'
        };
      }
  
      const tripRef = this.firestore.collection(this.COLLECTION_NAME).doc(tripId);
      console.log(`Accessing trip with ID: ${tripId}`);
  
      return await this.firestore.firestore.runTransaction(async transaction => {
        const tripDoc = await transaction.get(tripRef.ref);
        if (!tripDoc.exists) {
          console.error(`Trip with ID ${tripId} not found in transaction.`);
          return { success: false, message: 'Viaje no encontrado' };
        }
        console.log(`Trip data found:`, tripDoc.data());
        
        const tripData = tripDoc.data() as SpaceTrip;
        const userRef = this.firestore.collection('users').doc(currentUser.uid);
        const userDoc = await transaction.get(userRef.ref);
        const userData = userDoc.data() as any;
  
        const userTripRef = this.firestore
          .collection('users')
          .doc(currentUser.uid)
          .collection('purchasedTrips')
          .doc(tripId);
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
          userId: currentUser.uid,
          userEmail: currentUser.email,
          tripId,
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
            tripId,
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
  */
 
  async processPurchase(
    tripId: string,
    seatsToBuy: number
  ): Promise<{ success: boolean; message: string; transaction?: any }> {
    try {
      const currentUser = await this.authService.getCurrentUser();
      if (!currentUser) {
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
  
        console.log(`Trip data found:`, tripDoc.data());
        
        const tripData = tripDoc.data() as SpaceTrip;
        const userRef = this.firestore.collection('users').doc(currentUser.uid);
        const userDoc = await transaction.get(userRef.ref);
        const userData = userDoc.data() as any;
  
        const userTripRef = this.firestore
          .collection('users')
          .doc(currentUser.uid)
          .collection('purchasedTrips')
          .doc(tripDoc.id); // Usamos el ID del documento aquí
  
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
          userId: currentUser.uid,
          userEmail: currentUser.email,
          tripId: tripDoc.id, // Usamos el ID del documento
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
            tripId: tripDoc.id, // Usamos el ID del documento
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
