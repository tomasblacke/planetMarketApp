import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TravelReservationsService, SpaceTrip } from '../../Services/travel-reservations.service';

@Component({
  selector: 'app-space-trips-display',
  templateUrl: './space-trips-display.component.html',
  styleUrl: './space-trips-display.component.css'
})
export class SpaceTripsDisplayComponent implements OnInit  {
  trips: SpaceTrip[] = [];

  constructor(private travelReservationsService: TravelReservationsService,
    private router:Router
  ) { }

  ngOnInit() {
    this.travelReservationsService.getTrips().subscribe(
      trips => this.trips = trips
    );
  }

  reserveTrip(tripId: number) {
    this.router.navigate(['/trips', tripId]);//en teoria aca va al viaje id
  }

}

