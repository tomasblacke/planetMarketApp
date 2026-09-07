import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../Services/admin.service'; 
import {Router} from '@angular/router';
import { TravelReservationsService,SpaceTrip } from 'src/app/Services/travel-reservations.service';
import { PlanetService, Planet } from 'src/app/Services/planet.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']

})
export class AdminManagementComponent implements OnInit, OnDestroy {
  showAdminSection: boolean = false;
  addAdminEmail: string = '';
  addAdminMessage: string | null = null;
  deleteAdminEmail: string = '';
  deleteAdminMessage: string | null = null;
  checkAdminEmail: string = '';
  checkAdminMessage: string | null = null;
  showAddTripSection: boolean = false;

  //PROPIEDADES DE ADMIN PARA AGREGAR VIJAE
  newTrip: SpaceTrip = {
    id: 0,
    title: '',
    description: '',
    departure: new Date(),
    origin: '',
    destination: '',
    availableSeats: 1,
    priceByPassanger: 0,
    imageUrl: ''
  };
  addTripMessage: string | null = null;

  //IMAGENES QUE YA ESTAN EN LA CARPETA assets. Agregar bajo el mismo formato nuevas
  imagenesViajes = [
    { nombre: 'Marte', ruta: '/assets/planet-travel-mars.webp' },
    { nombre: 'Venus', ruta: '/assets/planet-travel-venus.png' },
    { nombre: 'Jupiter', ruta: '/assets/planet-travel-jupiter.webp' },
    { nombre: 'Luna', ruta: '/assets/planet-travel-moon.png' },
    {nombre:'Ship', ruta: '/assets/imagen-interior-nave.png'},
    {nombre:'Luxury Ship', ruta:'/assets/imagen-interior-nave-luxury.png'},
    {nombre: 'Nave En Espacio', ruta:'/assets/spaceship-traveling.jpg'}
  ];

  //PROPIEDADES DE ADMIN PARA DAR DE BAJA VIAJES
  showTripListSection: boolean = false;
  trips: SpaceTrip[] = [];
  deleteTripMessage: string | null = null;
  ordenBaja: string = 'proximos'; // proximos o todos
  viajesBaja: SpaceTrip[] = [];
  private tripsSubscription?: Subscription;

  //PROPIEDADES DE ADMIN PARA VER LOS PASAJEROS DE UN VIAJE
  purchases: any[] = [];
  showManifiestoSection: boolean = false;
  ordenManifiesto: string = 'proximos'; // proximos o todos
  viajesManifiesto: SpaceTrip[] = [];
  manifiestoAbierto: string | null = null;
  pasajerosDelViaje: any[] = [];
  private purchasesSubscription?: Subscription;

  //PROPIEDADES DE ADMIN PARA GESTIONAR PLANETAS
  showPlanetSection: boolean = false;
  planets: Planet[] = [];
  addPlanetMessage: string | null = null;
  buscandoImagen: boolean = false;
  planetaEditando: number | null = null;
  editPlanetMessage: string | null = null;
  private planetsSubscription?: Subscription;

  // Planeta nuevo del formulario de alta
  newPlanet: any = {
    name: '',
    type: '',
    diameter: 0,
    distanceFromSun: 0,
    description: '',
    price: 0,
    totalKilometers: 0,
    imageUrl: '',
    available: true
  };

  // Copia del planeta que se esta editando, para no tocar el de la lista hasta guardar
  planetEdit: any = {
    name: '',
    type: '',
    description: '',
    price: 0,
    imageUrl: '',
    available: true
  };


  constructor(private adminService: AdminService,private router:Router,private travelReservationsService: TravelReservationsService,private planetService: PlanetService) {}

  ngOnInit(): void {
    // El admin ve todos los viajes, incluidos los dados de baja y los que ya salieron
    this.tripsSubscription = this.travelReservationsService.getAllTrips().subscribe(trips => {
      this.trips = trips;
      this.armarListaBaja();
      this.armarListaManifiesto();
    });

    // Las compras sirven para armar la lista de pasajeros de cada viaje
    this.purchasesSubscription = this.adminService.getPurchases().subscribe(purchases => {
      this.purchases = purchases;
    });

    // Los planetas para la seccion de gestion del catalogo
    this.planetsSubscription = this.planetService.getPlanets().subscribe(planets => {
      this.planets = planets;
    });
  }

  ngOnDestroy(): void {
    this.tripsSubscription?.unsubscribe();
    this.purchasesSubscription?.unsubscribe();
    this.planetsSubscription?.unsubscribe();
  }

  toggleAdminSection() {
    this.showAdminSection = !this.showAdminSection;
  }
  toggleAddTripSection() {
    this.showAddTripSection = !this.showAddTripSection;
  }

  addAdmin() {
    if (this.addAdminEmail) {
      this.adminService.addAdmin(this.addAdminEmail).then(() => {
        this.addAdminMessage = 'Administrador agregado exitosamente.';
        this.addAdminEmail = ''; // Limpiar el campo de entrada
      }).catch(error => {
        this.addAdminMessage = 'Error al agregar'}
      )}};
      deleteAdmin() {
        if (this.deleteAdminEmail) {
          this.adminService.deleteAdmin(this.deleteAdminEmail).then(() => {
            this.deleteAdminMessage = 'Administrador eliminado exitosamente.';
            this.deleteAdminEmail = ''; // Limpiar el campo de entrada
          }).catch(error => {
            this.deleteAdminMessage = 'Error al eliminar el administrador: ' + error.message;
          });
        } else {
          this.deleteAdminMessage = 'Por favor, ingresa un correo.';
        }
      }
    
      checkAdmin() {
        if (this.checkAdminEmail) {
          this.adminService.isAdmin(this.checkAdminEmail).subscribe(isAdmin => {
            this.checkAdminMessage = isAdmin ? 'Este correo es un administrador.' : 'Este correo NO es un administrador.';
          });
        } else {
          this.checkAdminMessage = 'Por favor, ingresa un correo.';
        }
      }
      goToPurchases() {
        this.router.navigate(['/purchases']); // Asegúrate de que la ruta sea correcta
      }
      addTrip() {
        this.travelReservationsService.addTripToFirebase(this.newTrip).then(() => {
          this.addTripMessage = 'Viaje agregado exitosamente.';
          // Limpiar el formulario
          this.newTrip = {
            id: 0,
            title: '',
            description: '',
            departure: new Date(),
            origin: '',
            destination: '',
            availableSeats: 1,
            priceByPassanger: 0,
            imageUrl: ''
          };
        }).catch(error => {
          this.addTripMessage = 'Error al agregar el viaje: ' + error.message;
        });
      }

      //GESTION DE VIAJES: LISTAR Y DAR DE BAJA
      toggleTripListSection() {
        this.showTripListSection = !this.showTripListSection;
      }

      deleteTrip(trip: SpaceTrip) {
        if (!trip.docId) {
          this.deleteTripMessage = 'No se pudo identificar el viaje.';
          return;
        }
        if (!confirm(`¿Seguro que querés dar de baja "${trip.title}"?`)) {
          return;
        }
        this.travelReservationsService.deleteTrip(trip.docId).then(() => {
          this.deleteTripMessage = `Viaje "${trip.title}" dado de baja.`;
        }).catch(error => {
          this.deleteTripMessage = 'Error al dar de baja el viaje: ' + error.message;
        });
      }

      // Texto de estado para mostrar en la lista
      getTripStatus(trip: SpaceTrip): string {
        if (trip.active === false) {
          return 'Dado de baja';
        }
        if (trip.departure instanceof Date && trip.departure.getTime() < Date.now()) {
          return 'Ya salió';
        }
        return 'Activo';
      }

      toggleManifiestoSection() {
        this.showManifiestoSection = !this.showManifiestoSection;
        // Al abrir o cerrar la seccion no queda ningun viaje desplegado
        this.manifiestoAbierto = null;
        this.pasajerosDelViaje = [];
      }

      // Cambia entre ver solo los proximos o todos los viajes
      cambiarOrden(orden: string) {
        this.ordenManifiesto = orden;
        this.armarListaManifiesto();
        this.manifiestoAbierto = null;
        this.pasajerosDelViaje = [];
      }

      // Cambia el orden de la lista para dar de baja
      cambiarOrdenBaja(orden: string) {
        this.ordenBaja = orden;
        this.armarListaBaja();
      }

      armarListaBaja() {
        this.viajesBaja = this.ordenarViajes(this.ordenBaja);
      }

      armarListaManifiesto() {
        this.viajesManifiesto = this.ordenarViajes(this.ordenManifiesto);
      }

      // Ordena los viajes del mas proximo al mas lejano
      private ordenarViajes(orden: string): SpaceTrip[] {
        let lista = [...this.trips];

        if (orden === 'proximos') {
          // Deja afuera los que ya salieron
          lista = lista.filter(trip => trip.departure instanceof Date && trip.departure.getTime() >= Date.now());
        }

        lista.sort((a, b) => this.tiempoDeSalida(a) - this.tiempoDeSalida(b));
        return lista;
      }

      // Los viajes sin fecha cargada quedan al final de la lista
      private tiempoDeSalida(trip: SpaceTrip): number {
        return trip.departure instanceof Date ? trip.departure.getTime() : Number.MAX_SAFE_INTEGER;
      }

      // Arma la lista de pasajeros del viaje juntando todas sus compras
      verPasajeros(trip: SpaceTrip) {
        if (this.manifiestoAbierto === trip.docId) {
          this.manifiestoAbierto = null;
          this.pasajerosDelViaje = [];
          return;
        }

        this.manifiestoAbierto = trip.docId || null;
        this.pasajerosDelViaje = [];

        this.purchases
          .filter(compra => compra.tripId === trip.docId)
          .forEach(compra => {
            if (compra.passengers && compra.passengers.length > 0) {
              compra.passengers.forEach((pasajero: any) => {
                this.pasajerosDelViaje.push({
                  name: pasajero.name,
                  email: pasajero.email,
                  comprador: compra.userEmail
                });
              });
            } else {
              // Las compras viejas no guardaron los nombres, solo la cantidad por lo que se puede evitamos errores futuros en cargas de viajes viejos 
              this.pasajerosDelViaje.push({
                name: compra.seatsPurchased + ' asiento(s) sin datos de pasajero',
                email: '-',
                comprador: compra.userEmail
              });
            }
          });
      }

      //GESTION DE PLANETAS: ALTA, EDICION Y BAJA DEL CATALOGO
      togglePlanetSection() {
        this.showPlanetSection = !this.showPlanetSection;
        // Al abrir o cerrar la seccion no queda ningun planeta en edicion
        this.planetaEditando = null;
      }

      // Busca la imagen en la NASA y la deja en el campo, para que el admin la pueda ver o cambiar
      buscarImagenNasa() {
        if (!this.newPlanet.name) {
          this.addPlanetMessage = 'Escribi primero el nombre del planeta.';
          return;
        }
        this.buscandoImagen = true;
        this.planetService.getPlanetImage(this.newPlanet.name).subscribe(imageUrl => {
          this.buscandoImagen = false;
          if (imageUrl) {
            this.newPlanet.imageUrl = imageUrl;
            this.addPlanetMessage = 'Imagen encontrada en la NASA.';
          } else {
            this.addPlanetMessage = 'No se encontro imagen, cargala a mano.';
          }
        });
      }

      addPlanet() {
        if (!this.newPlanet.name || !this.newPlanet.type || this.newPlanet.totalKilometers <= 0) {
          this.addPlanetMessage = 'Completa el nombre, el tipo y la superficie total.';
          return;
        }

        this.planetService.addNewPlanet(this.newPlanet).then(() => {
          this.addPlanetMessage = 'Planeta agregado exitosamente.';
          // Limpiar el formulario
          this.newPlanet = {
            name: '',
            type: '',
            diameter: 0,
            distanceFromSun: 0,
            description: '',
            price: 0,
            totalKilometers: 0,
            imageUrl: '',
            available: true
          };
        }).catch(error => {
          this.addPlanetMessage = 'Error al agregar el planeta: ' + error.message;
        });
      }

      // Abre el formulario de edicion con los datos del planeta elegido
      editarPlaneta(planet: Planet) {
        if (this.planetaEditando === planet.id) {
          this.planetaEditando = null;
          return;
        }
        this.planetaEditando = planet.id;
        this.editPlanetMessage = null;
        this.planetEdit = {
          name: planet.name,
          type: planet.type,
          description: planet.description,
          price: planet.price,
          imageUrl: planet.imageUrl,
          available: planet.available
        };
      }

      cancelarEdicion() {
        this.planetaEditando = null;
        this.editPlanetMessage = null;
      }

      // No dejamos editar la superficie total porque ya hay kilometros vendidos sobre ese numero
      guardarPlaneta(planet: Planet) {
        this.planetService.updatePlanet(planet.id, this.planetEdit).then(() => {
          this.editPlanetMessage = `Planeta "${this.planetEdit.name}" actualizado.`;
          this.planetaEditando = null;
        }).catch(error => {
          this.editPlanetMessage = 'Error al actualizar el planeta: ' + error.message;
        });
      }

      eliminarPlaneta(planet: Planet) {
        if (!confirm(`¿Seguro que querés eliminar "${planet.name}" del catálogo?`)) {
          return;
        }
        this.planetService.deletePlanet(planet.id).then(() => {
          this.editPlanetMessage = `Planeta "${planet.name}" eliminado.`;
          this.planetaEditando = null;
        }).catch(error => {
          this.editPlanetMessage = 'Error al eliminar el planeta: ' + error.message;
        });
      }

      // Cuantos km2 se vendieron, para mostrarlo en la lista
      kilometrosVendidos(planet: Planet): number {
        return planet.totalKilometers - planet.availableKilometers;
      }

      getFormattedDate(date: any): string {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
          return 'Sin fecha';
        }
        return date.toLocaleDateString('en-GB');
      }
    }