import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../Services/admin.service'; // Asegúrate de ajustar la ruta
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html', // Cambia a usar el archivo HTML separado
  styleUrls: ['./purchases.component.css'],
})
export class PurchasesComponent implements OnInit {
  purchases: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getPurchases().subscribe(data => {
      this.purchases = data.map(purchase => {
        let purchaseDate: Date;

        // Verifica si purchaseDate es un Timestamp
        if (purchase.purchaseDate instanceof Timestamp) {
          purchaseDate = purchase.purchaseDate.toDate();
        } else if (typeof purchase.purchaseDate === 'string') {
          // Si es un string, intenta convertirlo a Date
          purchaseDate = new Date(purchase.purchaseDate);
          if (isNaN(purchaseDate.getTime())) {
            // Si la conversión falla, puedes manejarlo aquí
            console.warn('Fecha no válida:', purchase.purchaseDate);
            purchaseDate = new Date(); // Valor por defecto
          }
        } else {
          // Si no es un Timestamp ni un string, puedes manejarlo aquí
          purchaseDate = new Date(); // Valor por defecto
        }

        return {
          ...purchase,
          purchaseDate: purchaseDate
        };
      });
      console.log(this.purchases); // Para verificar que los datos se están recibiendo
    });
  }
}