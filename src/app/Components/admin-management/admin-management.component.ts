import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../Services/admin.service'; 
import {Router} from '@angular/router';
import { TravelReservationsService,SpaceTrip } from 'src/app/Services/travel-reservations.service';
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

  //PROPIEDADES DE ADMIN PARA DAR DE BAJA VIAJES
  showTripListSection: boolean = false;
  trips: SpaceTrip[] = [];
  deleteTripMessage: string | null = null;
  private tripsSubscription?: Subscription;


  constructor(private adminService: AdminService,private router:Router,private travelReservationsService: TravelReservationsService) {}

  ngOnInit(): void {
    // El admin ve todos los viajes, incluidos los dados de baja y los que ya salieron
    this.tripsSubscription = this.travelReservationsService.getAllTrips().subscribe(trips => {
      this.trips = trips;
    });
  }

  ngOnDestroy(): void {
    this.tripsSubscription?.unsubscribe();
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

      getFormattedDate(date: any): string {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
          return 'Sin fecha';
        }
        return date.toLocaleDateString('en-GB');
      }
    }