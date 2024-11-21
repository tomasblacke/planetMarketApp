import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './user-auth.service'; // Suponiendo que tienes un servicio de autenticación
import { map } from 'rxjs/operators';


export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}
export interface SpaceTrip {
  id: number;
  title: string;
  description: string;
  departure: Date | FirebaseTimestamp  |null; 
  origin: string;
  destination: string;
  availableSeats: number;
  imageUrl: string;
  priceByPassanger: number;
  purchases?: any[];  
}

@Injectable({
  providedIn: 'root'
})
export class TravelReservationsService {
  private COLLECTION_NAME = 'trips'; 

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  // Método para obtener todos los viajes desde Firebase
  /*getTrips(): Observable<SpaceTrip[]> {
    return this.firestore.collection<SpaceTrip>(this.COLLECTION_NAME).valueChanges();
  }*/
    getTrips(): Observable<SpaceTrip[]> {
      return this.firestore.collection<SpaceTrip>(this.COLLECTION_NAME).valueChanges().pipe(
        map(trips => trips.map(trip => {
          if (trip.departure && typeof trip.departure === 'object' && 'seconds' in trip.departure) {
            trip.departure = new Date(trip.departure.seconds * 1000);
          } else if (trip.departure && typeof trip.departure === 'string') {
            trip.departure = new Date(trip.departure);
          } else {
            trip.departure = null;
          }
          return trip;
        }))
      );
    }
    

    
    
    getTripById(id: number): Observable<SpaceTrip | undefined> {
      return this.firestore.collection<SpaceTrip>(this.COLLECTION_NAME, ref => ref.where('id', '==', id))
        .valueChanges()
        .pipe(
          map((trips: SpaceTrip[]) => {
            if (trips.length > 0) {
              const trip = trips[0];
              if (trip.departure && typeof trip.departure === 'object' && 'seconds' in trip.departure) {
                trip.departure = new Date(trip.departure.seconds * 1000); // Convierte el Timestamp a Date
              } else if (trip.departure && typeof trip.departure === 'string') {
                trip.departure = new Date(trip.departure); // Convierte cadenas ISO a Date
              } else {
                trip.departure = null; // Si no es válida, asigna null
              }
              return trip;
            }
            return undefined;
          })
        );
    }
    
    
    private isFirebaseTimestamp(obj: any): obj is FirebaseTimestamp {
      return obj && typeof obj.seconds === 'number' && typeof obj.nanoseconds === 'number';
    }
    
    
    
    

  // Método para obtener un viaje por ID
  /*getTripById(id: number): Observable<SpaceTrip | undefined> {
    return this.firestore.collection<SpaceTrip>(this.COLLECTION_NAME, ref => ref.where('id', '==', id))
      .valueChanges()
      .pipe(
        map((trips: SpaceTrip[]) => trips.length > 0 ? trips[0] : undefined) // Especifica el tipo de `trips` aquí
      );
  }*/

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
    const id = this.firestore.createId(); // Genera un nuevo ID
    trip.id = parseInt(id); // Asigna el ID generado al viaje
    return this.firestore.collection(this.COLLECTION_NAME).doc(id).set(trip)
      .then(() => console.log(`Viaje ${trip.title} agregado exitosamente.`))
      .catch(error => {
        console.error("Error al agregar el viaje: ", error);
        throw error; // Propagar el error para manejarlo en el componente
      });
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
  /*async processPurchase(
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
  }*/



    //METODO PRINCIPAL

  async processPurchase(
    tripId: string, 
    seatsToBuy: number
  ): Promise<{ success: boolean; message: string; transaction?: any }> {
    try {
      const currentUser = await this.validateUserLogin();
      const tripRef = await this.findTripReference(tripId);
  
      return await this.firestore.firestore.runTransaction(async transaction => {
        const { tripData, tripDoc } = await this.validateTrip(tripRef, transaction, seatsToBuy);
        const { userDoc, userData } = await this.getUserDetails(currentUser, transaction);
        const userTripDoc = await this.getUserTripDocument(currentUser, tripDoc, transaction);
  
        const purchaseData = this.createPurchaseData(currentUser, tripData, tripDoc, seatsToBuy);
        const { currentTotalSeats, currentPurchases } = this.getPreviousPurchaseDetails(userTripDoc);
        
        await this.updateTripAvailableSeats(transaction, tripRef, tripData.availableSeats - seatsToBuy);
        await this.recordPurchase(transaction, purchaseData);
        await this.updateUserTripCollection(transaction, currentUser, tripData, purchaseData, currentTotalSeats, currentPurchases, seatsToBuy);
        await this.updateUserProfile(transaction, currentUser, userData, purchaseData);
  
        return { 
          success: true, 
          message: 'Compra realizada exitosamente', 
          transaction: purchaseData 
        };
      });
    } catch (error) {
      return this.handlePurchaseError(error);
    }
  }
  
  //VERIFICACION AUTENTICACION USER
  private async validateUserLogin() {
    const currentUser = await this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('You must be logged in');
    }
    return currentUser;
  }
  

  //BUSCA VIAJE EN FIREBASE
  private async findTripReference(tripId: string) {
    const tripsQuerySnapshot = await this.firestore
      .collection(this.COLLECTION_NAME)
      .ref
      .where('id', '==', parseInt(tripId))
      .get();
  
    if (tripsQuerySnapshot.empty) {
      throw new Error('Viaje no encontrado');
    }
  
    return this.firestore
      .collection(this.COLLECTION_NAME)
      .doc(tripsQuerySnapshot.docs[0].id);
  }
  
  //VALIDA CANTIDAD ASIENTOS 
  private async validateTrip(tripRef: any, transaction: any, seatsToBuy: number) {
    const tripDoc = await transaction.get(tripRef.ref);
    if (!tripDoc.exists) {
      throw new Error('Viaje no encontrado');
    }
  
    const tripData = tripDoc.data() as SpaceTrip;
    if (tripData.availableSeats < seatsToBuy) {
      throw new Error(`Solo hay ${tripData.availableSeats} asientos disponibles`);
    }
  
    return { tripData, tripDoc };
  }
  
  private async getUserDetails(currentUser: any, transaction: any) {
    const userRef = this.firestore.collection('users').doc(currentUser.uid);
    const userDoc = await transaction.get(userRef.ref);
    const userData = userDoc.data() as any;
  
    return { userDoc, userData };
  }
  
  private async getUserTripDocument(currentUser: any, tripDoc: any, transaction: any) {
    const userTripRef = this.firestore
      .collection('users')
      .doc(currentUser.uid)
      .collection('purchasedTrips')
      .doc(tripDoc.id);
  
    return await transaction.get(userTripRef.ref);
  }
  


  //CREA OBJETO CON LOS DATOS DE LA COMPRA
  private createPurchaseData(currentUser: any, tripData: SpaceTrip, tripDoc: any, seatsToBuy: number) {
    return {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      tripId: tripDoc.id,
      tripTitle: tripData.title,
      seatsPurchased: seatsToBuy,
      pricePerSeat: tripData.priceByPassanger,
      totalPrice: tripData.priceByPassanger * seatsToBuy,
      purchaseDate: new Date()
    };
  }
  

  //RECUPERA LAS COMPRAS ANTERIORES DEL USUARIO
  private getPreviousPurchaseDetails(userTripDoc: any) {
    const currentTotalSeats = userTripDoc.exists 
      ? userTripDoc.data().totalSeats || 0 
      : 0;
    const currentPurchases = userTripDoc.exists 
      ? userTripDoc.data().purchases || [] 
      : [];
  
    return { currentTotalSeats, currentPurchases };
  }
  
  //ACTUALIZA LA CANTIDAD DE ASIENTOS
  private async updateTripAvailableSeats(transaction: any, tripRef: any, newAvailableSeats: number) {
    transaction.update(tripRef.ref, { availableSeats: newAvailableSeats });
  }
  
  private async recordPurchase(transaction: any, purchaseData: any) {
    const purchaseRef = this.firestore.collection('purchases').doc();
    transaction.set(purchaseRef.ref, purchaseData);
  }
  

  //Actualiza  un documento en la subcolección purchasedTrips
  private async updateUserTripCollection(
    transaction: any, 
    currentUser: any, 
    tripData: SpaceTrip, 
    purchaseData: any,
    currentTotalSeats: number,
    currentPurchases: any[],
    seatsToBuy: number
  ) {
    const userTripRef = this.firestore
      .collection('users')
      .doc(currentUser.uid)
      .collection('purchasedTrips')
      .doc(purchaseData.tripId);
  
    transaction.set(
      userTripRef.ref,
      {
        tripId: purchaseData.tripId,
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
  }
  

  //Actualiza el perfil del usuario en Firestore
  private async updateUserProfile(
    transaction: any, 
    currentUser: any, 
    userData: any, 
    purchaseData: any
  ) {
    const userRef = this.firestore.collection('users').doc(currentUser.uid);
    const currentTotalInvestment = userData?.totalInvestment || 0;
  
    transaction.update(userRef.ref, {
      totalInvestment: currentTotalInvestment + purchaseData.totalPrice,
      lastPurchase: purchaseData
    });
  }
  

  //ERROR EN CONSOLA
  private handlePurchaseError(error: any) {
    console.error('Error en el proceso de compra:', error);
    return {
      success: false,
      message: 'Error procesando la compra: ' + (error instanceof Error ? error.message : 'Error desconocido')
    };
  }
}