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
  styleUrl: './trip-reserva-id.component.css'
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
    const tripId = Number(this.route.snapshot.paramMap.get('id'));
    this.travelReservationsService.getTripById(tripId).subscribe(
      trip => {
        this.trip = trip;
        this.calculateTotalPrice();
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
      this.totalPrice = this.trip.priceByPassanger * numberOfPassengers;
    }
  }
  //----------------------------------------------------------------PROCESSING----------------------------------------------------------------

  onSubmit() {
    console.log('Reservation submitted', {
      mainPassenger: this.mainPassenger,
      companions: this.companions
    });
    // Aca iría la lógica para guardar la reserva
  }

}
