
import { Component, OnInit } from '@angular/core';
import { TravelNotificationService } from '../../Services/travel-notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.css']
})
export class UserNotificationsComponent implements OnInit {
  upcomingTrips$: Observable<any[]>;

  constructor(private notificationService: TravelNotificationService) {
    this.upcomingTrips$ = this.notificationService.getUpcomingTrips();
  }

  ngOnInit(): void {
    // Empty implementation to satisfy OnInit interface
  }
}