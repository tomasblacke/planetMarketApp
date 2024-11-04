import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanetService, Planet } from '../../Services/planet.service';
import { CommentListComponent } from '../../Components/comment-list/comment-list.component';


@Component({
  selector: 'app-planet',
  templateUrl: './planet.component.html',
  styleUrl: './planet.component.css'
})
export class PlanetComponent implements OnInit {
  planet: Planet | undefined;
  error: string | undefined;
  kilometersInput: number = 0;
  calculatedPrice: number = 0;
  isProcessing: boolean = false;
  isPlanetLoaded: boolean = false;

  @ViewChild('commentsListComponent') commentListComponent!: CommentListComponent;

  constructor(
    private route: ActivatedRoute,
    private planetService: PlanetService
  ) { }

  ngOnInit() {
    const planetId = Number(this.route.snapshot.paramMap.get('planetID'));
    console.log('Planet ID from route:', planetId);
    // Validar el ID de planeta antes de hacer la petición
    if (isNaN(planetId) || planetId < 1) {
      this.error = 'Invalid planet ID';
      return;
    }
    this.loadPlanetData(planetId);
  }
  private loadPlanetData(planetId: number): void{
    this.planetService.getPlanetById(planetId).subscribe(
      planet => {
        console.log('Planet data received:', planet);
        this.planet = planet;
        if (planet && this.planet) {
          console.log('Planet ID:', this.planet.id);
          this.isPlanetLoaded = true;
          this.planetService.getPlanetImage(planet.name).subscribe(
            imageUrl => {
              if (this.planet) {
                this.planet.imageUrl = imageUrl;
              }
            },
            error => {
              console.error('Error fetching planet image:', error);
              this.error = 'Failed to load planet image';
              return; 
              
            }
          );
        } else {
          this.error = 'Planet not found'; 
          return;
        }
      },
      error => {
        console.error('Error fetching planet details:', error);
        this.error = 'Failed to load planet details';
        return; 
      }
    );
  }
  calculateTotalPrice(): void {
    if (this.planet && this.kilometersInput > 0) {
      this.calculatedPrice = this.kilometersInput * this.planet.price;
    } else {
      this.calculatedPrice = 0;
    }
  }

  get isPurchaseValid(): boolean {
    return !this.isProcessing && 
           !!this.planet?.id && 
           this.kilometersInput > 0 && 
           this.kilometersInput <= (this.planet?.availableKilometers || 0);
  }

  get purchaseButtonText(): string {
    if (this.isProcessing) return 'Processing...';
    if (!this.planet?.available) return 'Sold Out';
    if (this.kilometersInput <= 0) return 'Enter amount to buy';
    if (this.kilometersInput > this.planet.availableKilometers) 
      return 'Amount exceeds available space';
    return 'Buy Now';
  }

  async buyPlanet() {
    console.log("Iniciando proceso de compra:", {
        planet: this.planet,
        kilometersInput: this.kilometersInput
    });

    // 1. Validaciones mejoradas
    if (!this.planet?.id) {
        alert('Error: Planeta no válido');
        return;
    }

    if (!this.kilometersInput || this.kilometersInput <= 0) {
        alert('Por favor, ingresa una cantidad válida de kilómetros');
        return;
    }

    if (this.kilometersInput > this.planet.availableKilometers) {
        alert(`Solo hay ${this.planet.availableKilometers} km² disponibles`);
        return;
    }

    // 2. Proceso de compra
    try {
        this.isProcessing = true; // Añadir esta propiedad si no la tienes

        const result = await this.planetService.processPurchase(
            this.planet.id,
            this.kilometersInput
        );

        if (result.success) {
            // 3. Actualización después de compra exitosa
            await this.loadPlanetData(this.planet.id);
            this.resetPurchaseForm();
            alert('¡Compra realizada exitosamente!');
        } else {
            alert(result.message || 'Error en la compra');
        }
    } catch (error) {
        console.error('Error en la compra:', error);
        alert('Error al procesar la compra. Por favor, intenta nuevamente.');
    } finally {
        this.isProcessing = false;
    }
}

// Método auxiliar para reset
private resetPurchaseForm(): void {
    this.kilometersInput = 0;
    this.calculatedPrice = 0;
}

// Agregar un getter para validación
get canPurchase(): boolean {
    return !this.isProcessing && 
           !!this.planet?.id && 
           this.kilometersInput > 0 && 
           this.kilometersInput <= (this.planet?.availableKilometers || 0);
}
  
  

  private handleSuccessfulPurchase(result: any): void {
    alert('Purchase successful!');
    // Recargar datos del planeta
    this.loadPlanetData(this.planet!.id);
    // Resetear formulario
    this.kilometersInput = 0;
    this.calculatedPrice = 0;
  }

  private handleFailedPurchase(message: string): void {
    alert(message || 'Purchase failed');
  }

  private handlePurchaseError(error: any): void {
    console.error('Error during purchase:', error);
    alert('An error occurred during the purchase');
  }
}
