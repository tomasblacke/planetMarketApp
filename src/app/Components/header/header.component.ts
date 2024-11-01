import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PlanetService } from '../../Services/planet.service';
import { TravelReservationsService } from '../../Services/travel-reservations.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../Services/user-auth.service'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private searchTerms = new Subject<string>();
  searchResults: any[] = [];
  showResults = false;
//USERS MANAGEMENT
  isLoggedIn: boolean = false;
  userDisplayName: string = '';
  showUserMenu: boolean = false;


  constructor(
    private router: Router,
    private planetService: PlanetService,
    private tripService: TravelReservationsService,
    private authService: AuthService,
  ) {
   
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.trim()) {
          return this.search(term);
        }
        return [];
      })
    ).subscribe(results => {
      this.searchResults = results;
      this.showResults = results.length > 0;
    });/*
    this.authService.fireauth.onAuthStateChanged(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.userDisplayName = user.displayName || 'Usuario';
      }
    });REVISAR*/
  }

  // Método que se llama cada vez que el usuario escribe
  onSearch(event: any) {
    const term = event.target.value;
    this.searchTerms.next(term);
  }


  // Método que combina resultados de planetas y viajes, los busca en el arreglo ver cuando conectemos la api
  //Segun gpt, para limpiar el codigo nos recomienda usar spread que serian los ...
  /*
  Ventajas de usar spread:

Código más limpio y legible
Inmutabilidad: Crea nuevos objetos/arrays sin modificar los originales
Flexibilidad: Fácil de añadir o combinar propiedades/elementos
Sintaxis moderna: Es una característica estándar de ES6+
  */
  private search(term: string): Promise<any[]> {
    return Promise.all([
      this.planetService.searchPlanets(term),
      this.tripService.searchTrips(term)
    ]).then(([planets, trips]) => {
      return [
        ...planets.map(p => ({ ...p, type: 'planet' })),
        ...trips.map(t => ({ ...t, type: 'trip' }))
      ];
    });
  }

  // Método para navegar al resultado seleccionado
  goToResult(result: any) {
    if (result.type === 'planet') {
      this.router.navigate(['/planets', result.id]);
    } else {
      this.router.navigate(['/trips', result.id]);
    }
    this.showResults = false;
  }
   // Nuevos métodos para el menú de usuario
   toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
    this.showUserMenu = false;
  }

  // Cerrar el menú cuando se hace clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const userMenuElement = event.target as HTMLElement;
    if (!userMenuElement.closest('.user-menu-container')) {
      this.showUserMenu = false;
    }
  }

  // Método para navegar al perfil
  goToProfile() {
    this.router.navigate(['/profile']);
    this.showUserMenu = false;
  }

  // Método para navegar a configuración
  goToSettings() {
    this.router.navigate(['/settings']);
    this.showUserMenu = false;
  }

}
