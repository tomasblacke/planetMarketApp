import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanetService, Planet } from '../planet.service';


@Component({
  selector: 'app-planet',
  templateUrl: './planet.component.html',
  styleUrl: './planet.component.css'
})
export class PlanetComponent implements OnInit {
  planet: Planet | undefined;
  error: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private planetService: PlanetService
  ) { }

  ngOnInit() {
    const planetId = Number(this.route.snapshot.paramMap.get('planetId'));
    console.log('Planet ID from route:', planetId);
    // Validar el ID de planeta antes de hacer la petición
    if (isNaN(planetId) || planetId < 1) {
      this.error = 'Invalid planet ID';
      return;
    }

    this.planetService.getPlanetById(planetId).subscribe(
      planet => {
        console.log('Planet data received:', planet);
        this.planet = planet;
        if (planet) {
          this.planetService.getPlanetImage(planet.name).subscribe(
            imageUrl => {
              if (this.planet) {
                this.planet.imageUrl = imageUrl;
              }
            },
            error => {
              console.error('Error fetching planet image:', error);
              this.error = 'Failed to load planet image';  // Añade esta línea
            }
          );
        } else {
          this.error = 'Planet not found';  // Añade esta línea
        }
      },
      error => {
        console.error('Error fetching planet details:', error);
        this.error = 'Failed to load planet details';  // Añade esta línea
      }
    );
  }

  buyPlanet() {
    if (this.planet) {
      console.log(`Buying ${this.planet.name} for $${this.planet.price}`);
      // Implementar lógica de compra aquí
    }
  }
}
