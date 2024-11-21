import { Component, OnInit } from '@angular/core';
import { PlanetService, Planet } from '../../Services/planet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planet-cards',
  templateUrl: './planet-cards.component.html',
  styleUrl: './planet-cards.component.css'
})
export class PlanetCardsComponent implements OnInit {
  planets: Planet[] = [];
  constructor(private planetService: PlanetService, private router: Router) { }

  ngOnInit() {
    this.planetService.getPlanets().subscribe(
      planets => {
        this.planets = planets;
      }
    );
  }
  viewPlanetDetails(planetId: number) {
    console.log('Navigating to planet details:', planetId);
    
    this.router.navigate(['/planets', planetId]);
  }
  


}
