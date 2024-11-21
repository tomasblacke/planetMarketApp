import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { TravelReservationsService, SpaceTrip } from '../../Services/travel-reservations.service';
import { FirebaseTimestamp } from '../../Services/travel-reservations.service';
@Component({
  selector: 'app-space-trips-display',
  templateUrl: './space-trips-display.component.html',
  styleUrls: ['./space-trips-display.component.css']
})
export class SpaceTripsDisplayComponent implements OnInit {
  trips: SpaceTrip[] = [];
  imagesLoaded = 0; // Contador para las imágenes cargadas

  constructor(
    private travelReservationsService: TravelReservationsService,
    private router: Router,
    private cdr: ChangeDetectorRef, 
    private zone: NgZone // Inyectamos NgZone para asegurar detección de cambios
  ) {}

  ngOnInit() {
 
    this.travelReservationsService.getTrips().subscribe(trips => {
      this.zone.run(() => {
        this.trips = trips; 
      });
    });
  }

  // Método para manejar el evento load de las imágenes
  onImageLoad() {
    this.imagesLoaded++;
    if (this.imagesLoaded === this.trips.length) {
      this.cdr.detectChanges(); 
    }
  }

  // Método para redirigir al detalle de un viaje
  reserveTrip(tripId: number) {
    this.router.navigate(['/trips', tripId]); 
  }

  convertToDate(date: Date | FirebaseTimestamp | null): Date | null {
    if (date && typeof date === 'object' && 'seconds' in date) {
      return new Date(date.seconds * 1000);
    }
    return date instanceof Date ? date : null;
  }
  
  getFormattedDate(date: Date | FirebaseTimestamp | null): string {
    const validDate = this.convertToDate(date);
    if (!validDate || isNaN(validDate.getTime())) {
      return 'Not specified';
    }
    return validDate.toLocaleDateString('en-GB');
  }
}
