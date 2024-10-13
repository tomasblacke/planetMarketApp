import { Component, OnInit } from '@angular/core';
import { PlanetService, Planet } from '../../Services/planet.service';

@Component({
  selector: 'app-planet-cards',
  templateUrl: './planet-cards.component.html',
  styleUrl: './planet-cards.component.css'
})
export class PlanetCardsComponent implements OnInit {
  planets: Planet[] = [];
  constructor(private planetService: PlanetService) { }

  ngOnInit() {
    this.planetService.getPlanets().subscribe(
      planets => {
        this.planets = planets;
      }
    );
  }
  


}
