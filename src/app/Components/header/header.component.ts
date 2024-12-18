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
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private searchTerms = new Subject<string>();
  searchResults: any[] = [];
  showResults = false;
  isLoggedIn: boolean = false;
  userDisplayName: string = '';
  showUserMenu: boolean = false;
  isAdmin: boolean = false; // Propiedad para verificar si el usuario es admin

  constructor(
    private router: Router,
    private planetService: PlanetService,
    private tripService: TravelReservationsService,
    public authService: AuthService,
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
    });

    // Suscribirse al estado de autenticación
    this.authService.getAuthState().subscribe(user => {
      this.isLoggedIn = !!user; // Verifica si hay un usuario autenticado
      if (user) {
        this.userDisplayName = user.displayName || 'Usuario';
        
        // Verifica si el usuario es admin
        this.authService.isAdmin(user.email).subscribe(isAdmin => {
          this.isAdmin = isAdmin; // Actualiza la propiedad isAdmin
        });
      } else {
        this.isAdmin = false; // Si no hay usuario, no es admin
      }
    });
  }

  // Método que se llama cada vez que el usuario escribe
  onSearch(event: any) {
    const term = event.target.value;
    this.searchTerms.next(term);
  }


  // Método que combina resultados de planetas y viajes, los busca en el arreglo ver cuando conectemos la api
  //Usamos spread, anduve averiguand y va rellenando los y completando los campos mapeados ademas le mete el typo
  
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

  
  goToAdmin() {
    this.router.navigate(['/admin-management']); 
    this.showUserMenu = false;
  }

}
