import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, from } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface Planet {
  id: number;
  name: string;
  type: string;
  diameter: number;
  distanceFromSun: number;
  imageUrl: string;
  price: number;
  available: boolean;
  totalKilometers: number;
  availableKilometers: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlanetService {
  private readonly COLLECTION_NAME = 'planets';
  private nasaApiKey = 'ccn605v3j7TiIR5kXUEBfOXrocFnCbQes3j1Oea1';
  private nasaImageApi = 'https://images-api.nasa.gov/search?q=';
  
  // Cache local de planetas
  private planetsCache: Planet[] = [];

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore
  ) {
    // Inicialiazmos cache para que el usuario una vez que carga tenga en una arreglo, depaso el servicio anterior se manejaba con arreglo asi que es lo mismo solo
    //que ahora cargamos de firebase el arreglo , lo hice asi para mantener las funcionalidades que habiamos implementado
    this.getPlanets().subscribe(planets => {
      this.planetsCache = planets;
    });
  }

  // Se uso ya para cargar los planetas a firebase
  async loadDefaultPlanets(): Promise<void> {
    const snapshot = await this.firestore.collection(this.COLLECTION_NAME).get().toPromise();
    
    if (!snapshot?.empty) {
      console.log('Ya existen planetas en la base de datos');
      return;
    }

    const defaultPlanets: Omit<Planet, 'id'>[] = [
      { 
        name: 'Mercury', 
        type: 'Terrestrial', 
        diameter: 4879, 
        distanceFromSun: 57.9, 
        imageUrl: '', 
        price: 1000000, 
        available: true,
        totalKilometers: 74800000,
        availableKilometers: 74800000
      },
      { 
        name: 'Venus', 
        type: 'Terrestrial', 
        diameter: 12104, 
        distanceFromSun: 108.2, 
        imageUrl: '', 
        price: 2000000, 
        available: true,
        totalKilometers: 460200000,
        availableKilometers: 460200000
      },
      { 
        name: 'Mars', 
        type: 'Terrestrial', 
        diameter: 12178, 
        distanceFromSun: 227.9, 
        imageUrl: '', 
        price: 3000000, 
        available: true,
        totalKilometers: 144800000,
        availableKilometers: 144800000
      },
      { 
        name: 'Earth Moon', 
        type: 'Terrestrial', 
        diameter: 1200, 
        distanceFromSun: 384.4, 
        imageUrl: '', 
        price: 6000000, 
        available: true,
        totalKilometers: 37900000,
        availableKilometers: 37900000
      },
      { 
        name: 'Jupiter', 
        type: 'Gas Giant', 
        diameter: 139820, 
        distanceFromSun: 778.5, 
        imageUrl: '', 
        price: 5000000, 
        available: true,
        totalKilometers: 61419000000,
        availableKilometers: 61419000000
      },
      { 
        name: 'Saturn', 
        type: 'Gas Giant', 
        diameter: 116460, 
        distanceFromSun: 1434.0, 
        imageUrl: '', 
        price: 4500000, 
        available: true,
        totalKilometers: 42700000000,
        availableKilometers: 42700000000
      },
      { 
        name: 'Uranus', 
        type: 'Ice Giant', 
        diameter: 50724, 
        distanceFromSun: 2871.0, 
        imageUrl: '', 
        price: 4000000, 
        available: true,
        totalKilometers: 8083000000,
        availableKilometers: 8083000000
      },
      { 
        name: 'Neptune', 
        type: 'Ice Giant', 
        diameter: 49244, 
        distanceFromSun: 4495.1, 
        imageUrl: '', 
        price: 4000000, 
        available: true,
        totalKilometers: 7618000000,
        availableKilometers: 7618000000
      },
      { 
        name: 'Pluto', 
        type: 'Dwarf Planet', 
        diameter: 2376, 
        distanceFromSun: 5906.4, 
        imageUrl: '', 
        price: 3500000, 
        available: true,
        totalKilometers: 17000000,
        availableKilometers: 17000000
      },
      { 
        name: 'Ganymede Moon', 
        type: 'Moon', 
        diameter: 5268, 
        distanceFromSun: 778.5, 
        imageUrl: '', 
        price: 2500000, 
        available: true,
        totalKilometers: 87000000,
        availableKilometers: 87000000
      },
      { 
        name: 'Titan Moon', 
        type: 'Moon', 
        diameter: 5150, 
        distanceFromSun: 1434.0, 
        imageUrl: '', 
        price: 2400000, 
        available: true,
        totalKilometers: 83000000,
        availableKilometers: 83000000
      },
      { 
        name: 'Europa Moon', 
        type: 'Moon', 
        diameter: 3121, 
        distanceFromSun: 778.5, 
        imageUrl: '', 
        price: 2200000, 
        available: true,
        totalKilometers: 30500000,
        availableKilometers: 30500000
      },
      { 
        name: 'Enceladus Moon', 
        type: 'Moon', 
        diameter: 504, 
        distanceFromSun: 1434.0, 
        imageUrl: '', 
        price: 2000000, 
        available: true,
        totalKilometers: 800000,
        availableKilometers: 800000
      }
    ];

    const batch = this.firestore.firestore.batch();
    for (let i = 0; i < defaultPlanets.length; i++) {
      const planet = defaultPlanets[i];
      const docRef = this.firestore.collection(this.COLLECTION_NAME).doc((i + 1).toString());
      
      // Obtiene la imagen de la NASA antes de guardar
      try {
        const imageUrl = await this.getPlanetImage(planet.name).toPromise();
        planet.imageUrl = imageUrl || '';
      } catch (error) {
        console.error(`Error obteniendo imagen para ${planet.name}:`, error);
        planet.imageUrl = '';
      }
      
      batch.set(docRef.ref, planet);
    }

    await batch.commit();
    console.log('Planetas por defecto cargados exitosamente');
  }

  // Pedido de imagen
  getPlanetImage(planetName: string): Observable<string> {
    return this.http.get<any>(`${this.nasaImageApi}planet ${planetName}&media_type=image`).pipe(
      map(response => {
        if (response.collection.items.length > 0 && response.collection.items[0].links.length > 0) {
          return response.collection.items[0].links[0].href;
        }
        throw new Error('No image found');
      }),
      catchError(error => {
        console.error('Error fetching planet image:', error);
        return of('');
      })
    );
  }

  // Obtiene datos de los planetas
  getPlanets(): Observable<Planet[]> {
    return this.firestore.collection<Planet>(this.COLLECTION_NAME, ref => ref.orderBy('name'))
      .valueChanges({ idField: 'id' }).pipe(
        tap(planets => this.planetsCache = planets)
      );
  }

  // Aca se implmeneto la buscqueda del id del planeta, para que sea mas rapido va primero al cache si no vuevle a firebase
  getPlanetById(id: number): Observable<Planet | undefined> {

    const cachedPlanet = this.planetsCache.find(p => p.id === id);
    if (cachedPlanet) {
      return of(cachedPlanet);
    }


    return this.firestore
      .collection<Planet>(this.COLLECTION_NAME)
      .doc(id.toString())
      .valueChanges()
      .pipe(
        tap(planet => console.log('getPlanetById result:', planet))
      );
  }

  // Funcion para admin que aregue planeta a mano
  async addNewPlanet(planet: Omit<Planet, 'id'>): Promise<string> {
    try {
      const planets = await this.firestore.collection(this.COLLECTION_NAME)
        .get().toPromise();
      const nextId = (planets?.docs.length || 0) + 1;
      
      // Obtener imagen de la NASA
      const imageUrl = await this.getPlanetImage(planet.name).toPromise();
      
      const newPlanet = {
        name: planet.name,
        type: planet.type,
        diameter: planet.diameter,
        distanceFromSun: planet.distanceFromSun,
        price: planet.price,
        available: planet.available,
        totalKilometers: planet.totalKilometers,
        imageUrl: imageUrl || '',
        availableKilometers: planet.totalKilometers
      };
  
      await this.firestore.collection(this.COLLECTION_NAME)
        .doc(nextId.toString())
        .set(newPlanet);
  
      return 'Planet succesfully added';
    } catch (error) {
      console.error('Error al agregar planeta:', error);
      throw new Error('Error adding planet');
    }
  }

  // Buscar planetas (usando el cache)
  searchPlanets(term: string): Promise<Planet[]> {
    return Promise.resolve(
      this.planetsCache.filter(planet => 
        planet.name.toLowerCase().includes(term.toLowerCase()) ||
        planet.type.toLowerCase().includes(term.toLowerCase())
      )
    );
  }

  //************************************************************************************************************************* */
  //***************************************** Metodos de modificacion, procesos de compra de km y administrativos ***************** */
  //************************************************************************************************************************* */
  // Actualizar planeta
  async updatePlanet(id: number, updates: Partial<Planet>): Promise<void> {
    try {
      const planetRef = this.firestore
        .collection(this.COLLECTION_NAME)
        .doc(id.toString());
      
      // Si se está actualizando el nombre, actualizamos también la imagen
      if (updates.name) {
        const imageUrl = await this.getPlanetImage(updates.name).toPromise();
        updates.imageUrl = imageUrl || '';
      }
  
      await planetRef.update(updates);
      console.log(`Planeta ${id} actualizado exitosamente`);
    } catch (error) {
      console.error('Error actualizando planeta:', error);
      throw new Error('Error updating the planets');
    }
  }
// elimina planeta
async deletePlanet(id: number): Promise<void> {
  try {
    await this.firestore
      .collection(this.COLLECTION_NAME)
      .doc(id.toString())
      .delete();
    console.log(`Planeta ${id} eliminado exitosamente`);
  } catch (error) {
    console.error('Error eliminando planeta:', error);
    throw new Error('Error al eliminar el planeta');
  }
}

// Comprar kilómetros cuadrados, no se si poner mas datos, lo vemos
async purchaseKilometers(
  planetId: number, 
  kilometersToPurchase: number, 
  buyerInfo?: { //obligamos a que no pueda estar vacio?
    userId: string, 
    email: string 
  }
): Promise<{ 
  success: boolean, 
  transaction?: any, 
  message: string 
}> {
  try {
    const planetRef = this.firestore
      .collection(this.COLLECTION_NAME)
      .doc(planetId.toString());

    return await this.firestore.firestore.runTransaction(async transaction => {
      const planetDoc = await transaction.get(planetRef.ref);

      if (!planetDoc.exists) {
        return {
          success: false,
          message: 'Planet not found'
        };
      }

      const planetData = planetDoc.data() as Planet;



      // Verificar disponibilidad
      if (!planetData.available) {
        return {
          success: false,
          message: 'Planet not available for purchase'
        };
      }



      // Verificacion de kilometros disponibles
      if (planetData.availableKilometers < kilometersToPurchase) {
        return {
          success: false,
          message: `Just ${planetData.availableKilometers} km² available`
        };
      }

      const newAvailableKilometers = planetData.availableKilometers - kilometersToPurchase;




      // Actualizar planeta
      transaction.update(planetRef.ref, {
        availableKilometers: newAvailableKilometers,
        available: newAvailableKilometers > 0
      });




      // Si se proporcionó información del comprador, registrar la transacción, esto va de la mane con el comentario al principio, creo que tendriamos que hacerlo obligatorio
      if (buyerInfo) {
        const purchaseRecord = {
          planetId,
          planetName: planetData.name,
          kilometersPurchased: kilometersToPurchase,
          purchaseDate: new Date(),
          buyerId: buyerInfo.userId,
          buyerEmail: buyerInfo.email,
          pricePerKilometer: planetData.price,
          totalPrice: planetData.price * kilometersToPurchase
        };

        const purchaseRef = this.firestore.collection('purchases').doc();
        transaction.set(purchaseRef.ref, purchaseRecord);
      }

      return {
        success: true,
        transaction: {
          planetId,
          kilometersPurchased: kilometersToPurchase,
          remainingKilometers: newAvailableKilometers,
          timestamp: new Date()
        },
        message: 'Successful purchase'
      };
    });

  } catch (error) {
    console.error('Error on purchase transaction', error);
    return {
      success: false,
      message: 'Error on purchase transaction'
    };
  }
}



// Verificar disponibilidad
async checkAvailability(
  planetId: number, 
  kilometersRequested: number
): Promise<{
  available: boolean,
  currentAvailable: number,
  message: string
}> {
  try {
    const planetDoc = await this.firestore
      .collection(this.COLLECTION_NAME)
      .doc(planetId.toString())
      .get()
      .toPromise();

    if (!planetDoc?.exists) {
      return {
        available: false,
        currentAvailable: 0,
        message: 'Planeta not found'
      };
    }

    const planetData = planetDoc.data() as Planet;
    const available = planetData.availableKilometers >= kilometersRequested;

    return {
      available,
      currentAvailable: planetData.availableKilometers,
      message: available 
        ? `There´re available (${planetData.availableKilometers} km²)`
        : `Not enough kilometers available (just ${planetData.availableKilometers} km²)`
    };
  } catch (error) {
    console.error('Error verificando disponibilidad:', error);
    return {
      available: false,
      currentAvailable: 0,
      message: 'Error checking availabilty'
    };
  }
}
}