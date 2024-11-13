import { Component } from '@angular/core';
import { AdminService } from '../../Services/admin.service'; 
import {Router} from '@angular/router';
import { TravelReservationsService,SpaceTrip } from 'src/app/Services/travel-reservations.service';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css']

})
export class AdminManagementComponent {
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


  constructor(private adminService: AdminService,private router:Router,private travelReservationsService: TravelReservationsService) {}

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
    }