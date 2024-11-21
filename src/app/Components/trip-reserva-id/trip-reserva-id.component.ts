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
  trip: SpaceTrip | undefined; // Usamos una propiedad regular trip
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
  ) { }

  ngOnInit(): void {
    const tripId = this.route.snapshot.paramMap.get('id')!;
    this.travelReservationsService.getTripById(parseInt(tripId, 10)).subscribe(trip => {
      this.trip = trip;
      this.calculateTotalPrice();  // Llamada inicial para calcular el precio
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

  onSubmit() {
    if (!this.trip) return;

    const totalPassengers = this.companions.length + 1;
    this.travelReservationsService.processPurchase(this.trip.id.toString(), totalPassengers)
      .then(response => {
        if (response.success) {
          console.log('Reservation submitted successfully:', response.transaction);

          // Limpiar el formulario después de la compra
          this.mainPassenger = { name: '', email: '' };
          this.companions = [];
          this.calculateTotalPrice();

          // Mostrar mensaje de éxito
          this.successMessage = 'Reserva exitosa';
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
  getFormattedDate(date: Date | FirebaseTimestamp | null): string {
    const validDate = this.convertToDate(date); // Asegura que sea un Date o null
    if (!validDate || isNaN(validDate.getTime())) {
      return 'Not specified';
    }
    return validDate.toLocaleDateString('en-GB'); // Formato dd/MM/yyyy
  }

  convertToDate(date: Date | FirebaseTimestamp | null): Date | null {
    if (date && typeof date === 'object' && 'seconds' in date) {
      return new Date(date.seconds * 1000); // Convierte FirebaseTimestamp a Date
    }
    return date instanceof Date ? date : null; // Si ya es Date, úsalo; si no, devuelve null
  }
}
