import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpaceTrip } from 'src/app/Services/travel-reservations.service';
import { TravelReservationsService } from 'src/app/Services/travel-reservations.service';

interface Passenger {
  name: string;
  email: string;
}

@Component({
  selector: 'app-trip-reserva-id',
  templateUrl: './trip-reserva-id.component.html',
  styleUrls: ['./trip-reserva-id.component.css']
})
export class TripReservaIdComponent implements OnInit {
  trip: SpaceTrip | undefined;
  mainPassenger: Passenger = { name: '', email: '' };
  companions: Passenger[] = [];
  totalPrice: number = 0; 
  successMessage: string = ''; // Variable para el mensaje de éxito

  constructor(
    private route: ActivatedRoute,
    private travelReservationsService: TravelReservationsService
  ) { }

  ngOnInit(): void {
    const tripId = this.route.snapshot.paramMap.get('id')!;
    this.travelReservationsService.getTripById(parseInt(tripId, 10)).subscribe(
      trip => {
        this.trip = trip;
        if (this.trip) {
          this.calculateTotalPrice();
        } else {
          console.error(`Trip with ID ${tripId} not found.`);
        }
      },
      error => {
        console.error(`Error loading trip with ID ${tripId}:`, error);
      }
    );
  }
  
  addCompanion() {
    this.companions.push({ name: '', email: '' });
    this.calculateTotalPrice();
  }

  removeCompanion(index: number) {
    this.companions.splice(index, 1);
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    if (this.trip) {
      const numberOfPassengers = this.companions.length + 1; // +1 for main passenger
      this.totalPrice = this.trip!.priceByPassanger * numberOfPassengers;
    }
  }

  onSubmit() {
    if (this.trip) {
      const totalPassengers = this.companions.length + 1;
  
      this.travelReservationsService.processPurchase(this.trip.id.toString(), totalPassengers)
        .then(response => {
          if (response.success) {
            console.log('Reservation submitted successfully:', response.transaction);

            // Limpiar el formulario
            this.mainPassenger = { name: '', email: '' };
            this.companions = [];
            this.calculateTotalPrice();

            // Mostrar mensaje de éxito
            this.successMessage = 'Reserva exitosa';

            // Ocultar mensaje después de unos segundos
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          } else {
            console.error('Error processing reservation:', response.message);
          }
        })
        .catch(error => {
          console.error('Error during reservation process:', error);
        });
    }
  }
}
