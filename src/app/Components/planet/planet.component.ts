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
        if (planet) {
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

  get canPurchase(): boolean {
    return !this.isProcessing && 
          this.planet != null && 
          this.kilometersInput > 0 && 
          this.kilometersInput <= this.planet.availableKilometers;
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
    if (!this.planet || !this.kilometersInput) {
      alert('Por favor, ingresa la cantidad de kilómetros a comprar');
      return;
    }

    try {
      const result = await this.planetService.processPurchase(
        this.planet.id,
        this.kilometersInput
      );

      if (result.success) {
        alert(result.message);
        // Recargar información del planeta
        this.loadPlanetData(this.planet.id);
        // Resetear el formulario
        this.kilometersInput = 0;
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la compra');
    } 
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
