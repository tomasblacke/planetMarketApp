import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { UserReservationsService } from 'src/app/Services/user-reservations.service';
import { PdfService } from 'src/app/Services/pdf.service';


@Component({
  selector: 'app-user-trips-reservation',
  templateUrl: './user-trips-reservation.component.html',
  styleUrls: ['./user-trips-reservation.component.css']
})
export class UserTripsReservationComponent implements OnInit {

  userReservations$!: Observable<any[]>;

  constructor(private userService: UserReservationsService, private pdfService : PdfService) { }

  ngOnInit(): void {
    // Llamamos al servicio para obtener las reservas del usuario
    this.userReservations$ = this.userService.getUserReservations();
  }
  
  async downloadTicketPDF(reservation: any): Promise<void> {
    try {
      await this.pdfService.generateReservationPDF(reservation);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Aquí puedes manejar el error como prefieras (mostrar un mensaje al usuario, etc.)
    }
  }
}