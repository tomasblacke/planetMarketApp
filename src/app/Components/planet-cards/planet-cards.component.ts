import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlanetService, Planet } from '../../Services/planet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planet-cards',
  templateUrl: './planet-cards.component.html',
  styleUrls: ['./planet-cards.component.css']
})
export class PlanetCardsComponent implements OnInit {
  planets: Planet[] = [];

  @ViewChild('planetGrid', { static: true }) planetGrid!: ElementRef;

  constructor(private planetService: PlanetService, private router: Router) {}

  ngOnInit() {
    this.planetService.getPlanets().subscribe(planets => {
      this.planets = planets;
    });
  }

  viewPlanetDetails(planetId: number) {
    console.log('Navigating to planet details:', planetId);
    this.router.navigate(['/planets', planetId]);
  }

  scrollLeft(): void {
    const container = this.planetGrid.nativeElement;
    container.scrollBy({ left: -300, behavior: 'smooth' }); // Desplaza 300px a la izquierda
  }

  scrollRight(): void {
    const container = this.planetGrid.nativeElement;
    container.scrollBy({ left: 300, behavior: 'smooth' }); // Desplaza 300px a la derecha
  }
}
