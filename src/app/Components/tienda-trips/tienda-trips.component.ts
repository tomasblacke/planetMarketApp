import { Component, OnInit } from '@angular/core';
import { NasaApiService } from '../../Services/nasa-api-service.service';

@Component({
  selector: 'app-tienda-trips',
  templateUrl: './tienda-trips.component.html',
  styleUrl: './tienda-trips.component.css'
})
export class TiendaTripsComponent implements OnInit {
  apodData: any;
  constructor(private nasaApiService: NasaApiService) { }

  ngOnInit(): void {
    this.nasaApiService.getAstronomyPictureOfDay().subscribe({
      next: (data: any) => {
        this.apodData = data;
      },
      error: (error: any) => {
        console.error('Error fetching NASA APOD:', error);
      }
    });
  }
}
