import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserReservationsService } from 'src/app/Services/user-reservations.service';
import { AuthService } from 'src/app/Services/user-auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PdfService } from 'src/app/Services/pdf.service';

interface UserData {
  name: string;
  lastname: string;
}

@Component({
  selector: 'app-user-trips-reservation',
  templateUrl: './user-trips-reservation.component.html',
  styleUrls: ['./user-trips-reservation.component.css']
})
export class UserTripsReservationComponent implements OnInit {

  userReservations$!: Observable<any[]>;
  reservaAbierta: string | null = null;

  constructor(
    private userService: UserReservationsService,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private pdfService: PdfService
  ) { }

  ngOnInit(): void {
    // Llamamos al servicio para obtener las reservas del usuario
    this.userReservations$ = this.userService.getUserReservations();
  }

  // Abre la reserva clickeada, y si ya estaba abierta la cierra
  toggleReserva(tripId: string) {
    this.reservaAbierta = this.reservaAbierta === tripId ? null : tripId;
  }

  // La fecha de salida viene como Timestamp de Firebase
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

  //DESCARGA DEL PASAJE
  async downloadTicket(reservation: any) {
    try {
      const user = await this.authService.getCurrentUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const userDoc = await this.firestore
        .collection('users')
        .doc(user.uid)
        .get()
        .toPromise();

      const userData = userDoc?.data() as UserData;

      if (userData) {
        const userInfo = {
          name: userData.name,
          lastname: userData.lastname
        };

        await this.pdfService.generateTripTicketPDF(reservation, userInfo);
      }
    } catch (error) {
      console.error('Error generando el pasaje:', error);
    }
  }
}
