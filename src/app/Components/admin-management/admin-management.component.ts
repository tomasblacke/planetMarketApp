import { Component } from '@angular/core';
import { AdminService } from '../../Services/admin.service'; 
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-management',
  template: `
    <div>
      <h2>Gestión de Administradores</h2>
      <button (click)="toggleAdminSection()">
        {{ showAdminSection ? 'Ocultar' : 'Mostrar' }} Sección de Administración
      </button>
      <div *ngIf="showAdminSection">
        <h3>Agregar Administrador</h3>
        <input [(ngModel)]="addAdminEmail" placeholder="Correo del administrador" />
        <button (click)="addAdmin()">Agregar</button>
        <p *ngIf="addAdminMessage">{{ addAdminMessage }}</p>

        <h3>Eliminar Administrador</h3>
        <input [(ngModel)]="deleteAdminEmail" placeholder="Correo del administrador" />
        <button (click)="deleteAdmin()">Eliminar</button>
        <p *ngIf="deleteAdminMessage">{{ deleteAdminMessage }}</p>

        <h3>Verificar Administrador</h3>
        <input [(ngModel)]="checkAdminEmail" placeholder="Ingresa el correo" />
        <button (click)="checkAdmin()">Verificar</button>
        <p *ngIf="checkAdminMessage">{{ checkAdminMessage }}</p>
        <h3><button (click)="goToPurchases()">Ver Compras</button></h3> <!-- Botón para ir a compras -->
      </div>
    </div>
  `
})
export class AdminManagementComponent {
  showAdminSection: boolean = false;
  addAdminEmail: string = '';
  addAdminMessage: string | null = null;
  deleteAdminEmail: string = '';
  deleteAdminMessage: string | null = null;
  checkAdminEmail: string = '';
  checkAdminMessage: string | null = null;

  constructor(private adminService: AdminService,private router:Router) {}

  toggleAdminSection() {
    this.showAdminSection = !this.showAdminSection;
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
    }