import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlanetService } from '../../Services/planet.service';
import { TravelReservationsService } from '../../Services/travel-reservations.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private searchTerms = new Subject<string>();
  searchResults: any[] = [];
  showResults = false;

  constructor(
    private router: Router,
    private planetService: PlanetService,
    private tripService: TravelReservationsService
  ) {
    // Configurar la búsqueda con debounce
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
  }

  // Método que se llama cada vez que el usuario escribe
  onSearch(event: any) {
    const term = event.target.value;
    this.searchTerms.next(term);
  }

  // Método que combina resultados de planetas y viajes
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

}
