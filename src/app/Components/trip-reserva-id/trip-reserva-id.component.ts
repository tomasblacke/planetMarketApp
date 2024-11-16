import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core'; 
import { ActivatedRoute } from '@angular/router'; 
import { SpaceTrip, TravelReservationsService } from 'src/app/Services/travel-reservations.service'; 
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
  trip: SpaceTrip | undefined; // Usamos una propiedad regular trip
  mainPassenger: Passenger = { name: '', email: '' };
  companions: Passenger[] = [];
  totalPrice: number = 0; 
  successMessage: string = ''; 
  isImageLoading: boolean = true;
  errorMessages: string[] = []; 

  @ViewChild('commentsListComponent') commentsListComponent!: CommentListComponent;

  constructor(
    private route: ActivatedRoute,
    private travelReservationsService: TravelReservationsService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const tripId = this.route.snapshot.paramMap.get('id')!;
    this.travelReservationsService.getTripById(parseInt(tripId, 10)).subscribe(trip => {
      if (trip) {
        // Convierte el timestamp de departure a Date
        if ((trip.departure as any).seconds) {
          trip.departure = new Date((trip.departure as any).seconds * 1000);
        }
        this.trip = trip;
        this.calculateTotalPrice();
      }
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

  /*onSubmit() {
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
  }*/
      onSubmit() {
        this.errorMessages = []; 
    
        
        if (!this.validateEmail(this.mainPassenger.email)) {
          this.errorMessages.push('Invalid email format for the main passenger.');
        }
    
        
        this.companions.forEach((companion, index) => {
          if (!this.validateEmail(companion.email)) {
            this.errorMessages.push(`Invalid email format for companion ${index + 1}.`);
          }
        });
    
        
        if (this.errorMessages.length > 0) {
          return;
        }
    
        if (!this.trip) return;
    
        const totalPassengers = this.companions.length + 1;
        this.travelReservationsService.processPurchase(this.trip.id.toString(), totalPassengers)
          .then(response => {
            if (response.success) {
              console.log('Reservation submitted successfully:', response.transaction);
    
              
              this.mainPassenger = { name: '', email: '' };
              this.companions = [];
              this.calculateTotalPrice();
    
              
              this.successMessage = 'Reservation successful!';
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
    
      validateEmail(email: string): boolean {
        const allowedDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'hotmail.com.ar'];
        const emailRegex = /^[^\s@]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
      
        if (!emailRegex.test(email)) {
          return false; // Si no cumple con la estructura general de un email
        }
      
        const domain = email.split('@')[1];
        return allowedDomains.includes(domain);
      }
}
