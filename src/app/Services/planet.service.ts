import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of, from } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AuthService} from '../Services/user-auth.service';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'; 

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
  description: string;
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
    private firestore: AngularFirestore,
    private authService: AuthService
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
        availableKilometers: 74800000,
        description: 'The closest planet to the Sun and the smallest in the solar system.'
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
        availableKilometers: 460200000,
        description: 'Known for its thick atmosphere and extreme greenhouse effect.'
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
        availableKilometers: 144800000,
        description: 'The Red Planet, famous for its iron oxide surface and potential for past life.'
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
        availableKilometers: 37900000,
        description: 'Earth’s only natural satellite, with a unique influence on ocean tides.'
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
        availableKilometers: 61419000000,
        description: 'The largest planet in the solar system, with a famous Great Red Spot storm.'
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
        availableKilometers: 42700000000,
        description: 'Famous for its extensive ring system and large number of moons.'
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
        availableKilometers: 8083000000,
        description: 'An ice giant with a unique tilted axis, giving it extreme seasonal changes.'
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
        availableKilometers: 7618000000,
        description: 'Known for its striking blue color and strong winds, the farthest planet from the Sun.'
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
        availableKilometers: 17000000,
        description: 'A dwarf planet in the Kuiper Belt, once considered the ninth planet.'
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
        availableKilometers: 87000000,
        description: 'Jupiter’s largest moon and the largest in the solar system, even bigger than Mercury.'
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
        availableKilometers: 83000000,
        description: 'Saturn’s largest moon, known for its thick atmosphere and lakes of methane.'
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
        availableKilometers: 30500000,
        description: 'Jupiter’s icy moon, speculated to have a subsurface ocean that may harbor life.'
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
        availableKilometers: 800000,
        description: 'One of Saturn’s moons, known for geysers ejecting water into space.'
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
      .valueChanges({ idField: 'id' })
      .pipe(
        tap(planets => {
          console.log('Planets loaded:', planets);
          this.planetsCache = planets; // Aca se actualiza el cache
      })
      );
  }

  // Aca se implmeneto la buscqueda del id del planeta, para que sea mas rapido va primero al cache si no vuevle a firebase
  getPlanetById(id: number): Observable<Planet | undefined> {

    console.log('Buscando planeta con ID en getid:', id);  // Debug log

    // Primero buscar en el cache
    const cachedPlanet = this.planetsCache.find(p => p.id === id);
    if (cachedPlanet) {
        console.log('Planeta encontrado en cache:', cachedPlanet); // Debug log
        return of(cachedPlanet);
    }

    // Si no está en cache, buscarlo en Firestore
    return this.firestore
        .collection<Planet>(this.COLLECTION_NAME)
        .doc(id.toString())
        .valueChanges({ idField: 'id' })  // Importante: incluir el idField
        .pipe(
            tap(planet => {
                console.log('Planeta obtenido de Firestore:', planet); // Debug log
                if (planet) {
                    // Asegurarnos que el ID está presente
                    const planetWithId = { ...planet, id };
                    // Actualizar cache
                    const cacheIndex = this.planetsCache.findIndex(p => p.id === id);
                    if (cacheIndex >= 0) {
                        this.planetsCache[cacheIndex] = planetWithId;
                    } else {
                        this.planetsCache.push(planetWithId);
                    }
                    return planetWithId;
                }
                return planet;
            })
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




  //PROCESO DE COMPRA
  async processPurchase(
    planetId: number,
    kilometersToBuy: number
): Promise<{ success: boolean; message: string; transaction?: any }> {
    try {
        const currentUser = await this.authService.getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                message: 'You must be logged'
            };
        }

        const planetRef = this.firestore
            .collection(this.COLLECTION_NAME)
            .doc(planetId.toString());

        return await this.firestore.firestore.runTransaction(async transaction => {
            
            // 1. Lee / busca datos del planeta
            const planetDoc = await transaction.get(planetRef.ref);
            if (!planetDoc.exists) {
                return { success: false, message: 'Planeta no encontrado' };
            }
            const planetData = planetDoc.data() as any;

            // 2. Lee / chequea datos del usuario logeado
            const userRef = this.firestore.collection('users').doc(currentUser.uid);
            const userDoc = await transaction.get(userRef.ref);
            const userData = userDoc.data() as any;

          
            const userPlanetRef = this.firestore
                .collection('users')
                .doc(currentUser.uid)
                .collection('purchasedPlanets')
                .doc(planetId.toString());
            const userPlanetDoc = await transaction.get(userPlanetRef.ref);

            // Verificar que lo que compre esta disponible
            if (!planetData.available || planetData.availableKilometers < kilometersToBuy) {
                return {
                    success: false,
                    message: `Solo hay ${planetData.availableKilometers} km² disponibles`
                };
            }

            let currentTotalKilometers = 0;
            let currentPurchases: any[] = [];
            let currentTotalInvestment = userData?.totalInvestment || 0;

            if (userPlanetDoc.exists) {
                const data = userPlanetDoc.data() as { 
                    totalKilometers: number; 
                    purchases: any[] 
                };
                currentTotalKilometers = data['totalKilometers'] || 0;
                currentPurchases = data['purchases'] || [];
            }
              //ingresamos la info
            const purchaseData = {
                userId: currentUser.uid,
                userEmail: currentUser.email,
                planetId,
                planetName: planetData.name,
                kilometersPurchased: kilometersToBuy,
                pricePerKilometer: planetData.price,
                totalPrice: planetData.price * kilometersToBuy,
                purchaseDate: new Date()
            };
              //Escribe en fb
            
            // Actualiza planeta
            const newAvailableKilometers = planetData.availableKilometers - kilometersToBuy;
            transaction.update(planetRef.ref, {
                availableKilometers: newAvailableKilometers,
                available: newAvailableKilometers > 0
            });

            //  Crea registro de compra
            const purchaseRef = this.firestore.collection('purchases').doc();
            transaction.set(purchaseRef.ref, purchaseData);

            //  Actualizar datos de planetas del usuario
            transaction.set(
                userPlanetRef.ref,
                {
                    planetId,
                    planetName: planetData.name,
                    planetType: planetData.type,          
                    planetImage: planetData.imageUrl,     
                    totalKilometers: currentTotalKilometers + kilometersToBuy,
                    totalInvested: (currentTotalKilometers + kilometersToBuy) * planetData.price, 
                    lastPurchase: purchaseData,
                    purchases: [...currentPurchases, purchaseData]
                },
                { merge: true }
            );

            //  Actualizar documento principal del usuario
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

