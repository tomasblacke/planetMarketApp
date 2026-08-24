import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserReservationsService } from 'src/app/Services/user-reservations.service';

@Component({
  selector: 'app-user-trips-reservation',
  templateUrl: './user-trips-reservation.component.html',
  styleUrls: ['./user-trips-reservation.component.css']
})
export class UserTripsReservationComponent implements OnInit {

  userReservations$!: Observable<any[]>;
  reservaAbierta: string | null = null;

  constructor(private userService: UserReservationsService) { }

  ngOnInit(): void {
    // Llamamos al servicio para obtener las reservas del usuario
    this.userReservations$ = this.userService.getUserReservations();
  }

  // Abre la reserva clickeada, y si ya estaba abierta la cierra
  toggleReserva(tripId: string) {
    this.reservaAbierta = this.reservaAbierta === tripId ? null : tripId;
  }

  // Fomartea timestamp de Firebase
  getFormattedDate(date: any): string {
    if (!date) {
      return 'Not specified';
    }
    const validDate = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
    if (isNaN(validDate.getTime())) {
      return 'Not specified';
    }
    return validDate.toLocaleDateString('en-GB');
  }
}
