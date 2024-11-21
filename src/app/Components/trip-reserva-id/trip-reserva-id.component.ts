import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core'; 
import { ActivatedRoute } from '@angular/router'; 
import { SpaceTrip, TravelReservationsService } from 'src/app/Services/travel-reservations.service'; 
import { CommentListComponent } from 'src/app/Components/comment-list/comment-list.component'; 
import { FirebaseTimestamp } from 'src/app/Services/travel-reservations.service';

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
  successMessage: string = ''; 
  errorMessage: string = ''; 
  isImageLoading: boolean = true;

  @ViewChild('commentsListComponent') commentsListComponent!: CommentListComponent;

  constructor(
    private route: ActivatedRoute,
    private travelReservationsService: TravelReservationsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const tripId = this.route.snapshot.paramMap.get('id')!;
    this.travelReservationsService.getTripById(parseInt(tripId, 10)).subscribe(trip => {
      this.trip = trip;
      this.calculateTotalPrice();
    });
  }

  onImageLoad() {
    this.isImageLoading = false;
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
    const numberOfPassengers = this.companions.length + 1;
    if (this.trip) {
      this.totalPrice = this.trip.priceByPassanger * numberOfPassengers;
    }
  }

  isValidEmail(email: string): boolean {
    return email.includes('@'); // Validación básica para verificar si contiene "@"
  }

  onSubmit() {
    if (!this.trip) return;

    // Validar el correo principal
    if (!this.isValidEmail(this.mainPassenger.email)) {
      this.errorMessage = 'The main passenger\'s email is invalid. Please include an "@" symbol.';
      return;
    }

    // Validar los correos de los acompañantes
    for (const companion of this.companions) {
      if (!this.isValidEmail(companion.email)) {
        this.errorMessage = `The email for companion "${companion.name}" is invalid. Please include an "@" symbol.`;
        return;
      }
    }

    const totalPassengers = this.companions.length + 1;

    this.errorMessage = ''; 
    this.successMessage = ''; 

    this.travelReservationsService.processPurchase(this.trip.id.toString(), totalPassengers)
      .then(response => {
        if (response.success) {
          console.log('Reservation submitted successfully:', response.transaction);

          this.mainPassenger = { name: '', email: '' };
          this.companions = [];
          this.calculateTotalPrice();

          this.successMessage = 'Reservation successful';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          console.error('Error processing reservation:', response.message);
          this.errorMessage = response.message; 
        }
      })
      .catch(error => {
        console.error('Error during reservation process:', error.message);
        this.errorMessage = error.message; 
      });
  }

  getFormattedDate(date: Date | FirebaseTimestamp | null): string {
    const validDate = this.convertToDate(date);
    if (!validDate || isNaN(validDate.getTime())) {
      return 'Not specified';
    }
    return validDate.toLocaleDateString('en-GB');
  }

  convertToDate(date: Date | FirebaseTimestamp | null): Date | null {
    if (date && typeof date === 'object' && 'seconds' in date) {
      return new Date(date.seconds * 1000);
    }
    return date instanceof Date ? date : null;
  }
}
