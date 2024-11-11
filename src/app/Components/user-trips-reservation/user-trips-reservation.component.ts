import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { UserServiceService } from 'src/app/Services/user-service.service';


@Component({
  selector: 'app-user-trips-reservation',
  templateUrl: './user-trips-reservation.component.html',
  styleUrls: ['./user-trips-reservation.component.css']
})
export class UserTripsReservationComponent implements OnInit {

  userReservations$!: Observable<any[]>;

  constructor(private userService: UserServiceService) { }

  ngOnInit(): void {
    // Llamamos al servicio para obtener las reservas del usuario
    this.userReservations$ = this.userService.getUserReservations();
  }

 
 
}