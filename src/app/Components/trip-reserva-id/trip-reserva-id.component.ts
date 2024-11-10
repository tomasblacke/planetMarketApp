import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TravelReservationsService, SpaceTrip } from '../../Services/travel-reservations.service';

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

  reservationForm = {
    name: '',
    email: '',
    passengers: 1
  };

  constructor(
    private route: ActivatedRoute,
    private travelReservationsService: TravelReservationsService
  ) { }

  ngOnInit(): void {
    const tripId = this.route.snapshot.paramMap.get('id')!;
    console.log(`Trip ID: ${tripId}`); // Verifica el ID
    this.travelReservationsService.getTripById(parseInt(tripId, 10)).subscribe(
      trip => {
        this.trip = trip;
        if (this.trip) {
          console.log(`Trip loaded:`, this.trip);
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
  
  

  //----------------------------------------------------------------CALCULOS OPERACIONALES ------------------------
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

  //----------------------------------------------------------------PROCESSING----------------------------------------------------------------

  onSubmit() {
    if (this.trip) {
      const totalPassengers = this.companions.length + 1;
      console.log(`Attempting to purchase ${totalPassengers} seats for trip ID ${this.trip.id}`);
  
      this.travelReservationsService.processPurchase(this.trip.id.toString(), totalPassengers)
        .then(response => {
          if (response.success) {
            console.log('Reservation submitted successfully:', response.transaction);
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
