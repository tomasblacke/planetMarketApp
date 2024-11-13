import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SpaceTrip } from 'src/app/Services/travel-reservations.service';
import { TravelReservationsService } from 'src/app/Services/travel-reservations.service';
import { CommentListComponent } from 'src/app/Components/comment-list/comment-list.component';

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
  trip$!: Observable<SpaceTrip | undefined>;
  mainPassenger: Passenger = { name: '', email: '' };
  companions: Passenger[] = [];
  totalPrice: number = 0; 
  successMessage: string = ''; // Variable para el mensaje de éxito
  isImageLoading: boolean = true; // Flag para mostrar cargador de imagen

  // Declarar ViewChild para acceder a commentsListComponent
  @ViewChild('commentsListComponent') commentsListComponent!: CommentListComponent;

  constructor(
    private route: ActivatedRoute,
    private travelReservationsService: TravelReservationsService,
    private cd: ChangeDetectorRef // Inyectar ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const tripId = this.route.snapshot.paramMap.get('id')!;
    this.trip$ = this.travelReservationsService.getTripById(parseInt(tripId, 10));
  }

  // Función llamada cuando la imagen se carga
  onImageLoad() {
    this.isImageLoading = false; // La imagen se ha cargado
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
    const numberOfPassengers = this.companions.length + 1; // +1 for main passenger
    this.trip$?.subscribe(trip => {
      if (trip) {
        this.totalPrice = trip.priceByPassanger * numberOfPassengers;
      }
    });
  }

  onSubmit() {
    this.trip$?.subscribe(trip => {
      if (trip) {
        const totalPassengers = this.companions.length + 1;
    
        this.travelReservationsService.processPurchase(trip.id.toString(), totalPassengers)
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
    });
  }
}
