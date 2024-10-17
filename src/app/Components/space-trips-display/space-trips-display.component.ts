import { Component, OnInit } from '@angular/core';
import { TravelReservationsService, SpaceTrip } from '../../Services/travel-reservations.service';

@Component({
  selector: 'app-space-trips-display',
  templateUrl: './space-trips-display.component.html',
  styleUrl: './space-trips-display.component.css'
})
export class SpaceTripsDisplayComponent implements OnInit  {
  trips: SpaceTrip[] = [];

  constructor(private travelReservationsService: TravelReservationsService) { }

  ngOnInit() {
    this.travelReservationsService.getTrips().subscribe(
      trips => this.trips = trips
    );
  }

  reserveTrip(tripId: number) {
    console.log(`Reserving trip with id: ${tripId}`);
    // Aquí implementaremos la lógica que se pueda llevar la data del id al componente del viaje...o quizas no, veremos
  }

}

