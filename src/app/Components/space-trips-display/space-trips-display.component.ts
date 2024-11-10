import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TravelReservationsService, SpaceTrip } from '../../Services/travel-reservations.service';

@Component({
  selector: 'app-space-trips-display',
  templateUrl: './space-trips-display.component.html',
  styleUrls: ['./space-trips-display.component.css']
})
export class SpaceTripsDisplayComponent implements OnInit  {
  trips: SpaceTrip[] = [];

  constructor(private travelReservationsService: TravelReservationsService,
              private router: Router) { }

  ngOnInit() {
    // Llamada para agregar todos los viajes hardcodeados a Firebase
    //this.travelReservationsService.addAllTripsToFirebase(); //FUNCION QUE AGREGA HARDCODEADOS LOS PLANETAS

    // Llamada para obtener los viajes y asignarlos a la variable trips
    this.travelReservationsService.getTrips().subscribe(
      trips => this.trips = trips
    );
  }

  reserveTrip(tripId: number) {
    this.router.navigate(['/trips', tripId]); // En teoría, esto te lleva al viaje por ID
  }
}

