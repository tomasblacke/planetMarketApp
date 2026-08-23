import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlanetService, Planet } from '../../Services/planet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planet-cards',
  templateUrl: './planet-cards.component.html',
  styleUrl: './planet-cards.component.css'
})
export class PlanetCardsComponent implements OnInit {
  planets: Planet[] = [];
  puedeIrIzquierda: boolean = false;
  puedeIrDerecha: boolean = false;

  @ViewChild('planetGrid') planetGrid!: ElementRef<HTMLDivElement>;

  constructor(private planetService: PlanetService, private router: Router) { }

  ngOnInit() {
    this.planetService.getPlanets().subscribe(
      planets => {
        this.planets = planets;
          //Espera a que cargue la cantidad y despues prepara para desplazar
        setTimeout(() => this.actualizarFlechas());
      }
    );
  }
  viewPlanetDetails(planetId: number) {
    console.log('Navigating to planet details:', planetId);
    
    this.router.navigate(['/planets', planetId]);
  }

  // Desplaza la fila casi una pantalla
  scrollGrid(direccion: number) {
    const grid = this.planetGrid.nativeElement;
    grid.scrollBy({ left: direccion * grid.clientWidth * 0.8 });
  }

  // Apaga la flecha del lado que ya no tiene mas planetas
  actualizarFlechas() {
    const grid = this.planetGrid.nativeElement;
    this.puedeIrIzquierda = grid.scrollLeft > 0;
    this.puedeIrDerecha = grid.scrollLeft + grid.clientWidth < grid.scrollWidth - 1;
  }
}
