import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TravelReservationsService, SpaceTrip } from '../../Services/travel-reservations.service';
import { TripNotificationService } from 'src/app/Services/trip-notification-service.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';

interface Passenger {
  name: string;
  email: string;
}

@Component({
  selector: 'app-trip-reserva-id',
  templateUrl: './trip-reserva-id.component.html',
  styleUrls: ['./trip-reserva-id.component.css']
})
export class TripReservaIdComponent implements OnInit, OnDestroy {
  trip: SpaceTrip | undefined;
  mainPassenger: Passenger = { name: '', email: '' };
  companions: Passenger[] = [];
  totalPrice: number = 0;
  showNotification: boolean = false;
  private checkInterval: any;
  private subscriptions: Subscription[] = [];

  reservationForm = {
    name: '',
    email: '',
    passengers: 1
  };

  constructor(
    private route: ActivatedRoute,
    private travelReservationsService: TravelReservationsService,
    private tripNotificationService: TripNotificationService,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    const tripId = this.route.snapshot.paramMap.get('id')!;
    this.loadTripData(tripId);
    this.requestNotificationPermission();
  }

  ngOnDestroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.tripNotificationService.initNotificationCheck();
      }
    }
  }

  private loadTripData(tripId: string) {
    const sub = this.firestore.collection('trips').doc(tripId)
      .valueChanges()
      .subscribe(data => {
        this.trip = data as SpaceTrip;
        if (this.trip) {
          this.checkIfTripIsUpcoming();
          this.calculateTotalPrice();
        }
      });
    this.subscriptions.push(sub);
  }

  private checkIfTripIsUpcoming() {
    if (!this.trip?.departure) return;

    const checkNotification = () => {
      const departureDate = new Date(this.trip!.departure).getTime();
      const now = new Date().getTime();
      const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
      const timeUntilDeparture = departureDate - now;

      if (timeUntilDeparture <= twoDaysInMs && timeUntilDeparture > 0) {
        this.showNotification = true;
        this.tripNotificationService.forceCheck();
      }
    };

    checkNotification();
    this.checkInterval = setInterval(checkNotification, 1000 * 60 * 60); // Cada hora
  }

  dismissNotification() {
    this.showNotification = false;
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
    if (this.trip) {
      const numberOfPassengers = this.companions.length + 1;
      this.totalPrice = this.trip.priceByPassanger * numberOfPassengers;
    }
  }

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
      this.tripNotificationService.forceCheck();
    }
  }
}