import { Component, OnInit } from '@angular/core';
import { PlanetService, Planet } from '../../Services/planet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tienda-planets',
  templateUrl: './tienda-planets.component.html',
  styleUrl: './tienda-planets.component.css'
})
export class TiendaPlanetsComponent implements OnInit {
  planets: Planet[] = [];

  constructor(private planetService: PlanetService, private router: Router) { }

  ngOnInit() {
    this.planetService.getPlanets().subscribe(
      planets => {
        this.planets = planets;
        this.loadPlanetImages();
      }
    );
  }
  loadPlanetImages() {
    this.planets.forEach(planet => {
      this.planetService.getPlanetImage(planet.name).subscribe(
        imageUrl => planet.imageUrl = imageUrl
      );
    });
  }
  viewPlanetDetails(planetId: number) {
    console.log('Navigating to planet details:', planetId);
    
    this.router.navigate(['/planets', planetId]);
  }
  buyPlanet(planet: Planet) {
    // Implementar lógica de compra aquí
    console.log(`Buying ${planet.name} for $${planet.price}`);
  }

}
