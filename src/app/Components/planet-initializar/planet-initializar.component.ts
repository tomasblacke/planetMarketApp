import { Component } from '@angular/core';
import { PlanetService } from '../../Services/planet.service';

@Component({
  selector: 'app-planet-initializar',
  templateUrl: './planet-initializar.component.html',
  styleUrl: './planet-initializar.component.css'
})
export class PlanetInitializerComponent {
  isLoading = false;
  message = '';
  messageClass = '';

  constructor(private planetService: PlanetService) {}

  async initializePlanets() {
    if (!confirm('¿Estás seguro? Esta acción solo debe realizarse una vez.')) {
      return;
    }

    this.isLoading = true;
    this.message = '';

    try {
      await this.planetService.loadDefaultPlanets();
      this.message = '¡Planetas cargados exitosamente!';
      this.messageClass = 'text-green-500';
    } catch (error) {
      this.message = 'Error al cargar los planetas. Revisa la consola para más detalles.';
      this.messageClass = 'text-red-500';
    } finally {
      this.isLoading = false;
    }
  }
}