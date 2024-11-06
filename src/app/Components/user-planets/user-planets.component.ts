import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/user-auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PdfService } from '../../Services/pdf.service';
import { UserPurchasedPlanetsService } from '../../Services/user-purchased-planets.service';


interface UserPlanet {
  planetId: string;
  planetName: string;
  totalKilometers: number;
  planetType: string;
  planetImage: string;
  lastPurchaseDate: Date;
  lastPurchaseAmount: number;
  totalInvested: number;
  purchases: {
    date: Date;
    kilometers: number;
    price: number;
  }[];
}
interface UserData {
  name: string;
  lastname: string;
}

@Component({
  selector: 'app-user-planets',
  templateUrl: './user-planets.component.html',
  styleUrls: ['./user-planets.component.css']
})
export class UserPlanetsComponent implements OnInit {
  userPlanets: UserPlanet[] = [];
  
  loading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private pdfService: PdfService,
    private UserPurchasedPlanetsService: UserPurchasedPlanetsService

  ) {}

  ngOnInit(): void {
    this.loadUserPlanets();
  }

  private loadUserPlanets(): void {
    console.log('Iniciando carga de planetas del usuario');
    this.authService.getCurrentUser().then(user => {
      if (user) {
        console.log('Usuario autenticado:', user.uid);
        this.firestore
          .collection('users')
          .doc(user.uid)
          .collection<UserPlanet>('purchasedPlanets')
          .valueChanges({ idField: 'planetId' })
          .subscribe(
            planets => {
              console.log('Planetas cargados:', planets);
              this.userPlanets = planets;
              this.loading = false;
            },
            error => {
              console.error('Error cargando planetas:', error);
              this.error = 'Error cargando los planetas';
              this.loading = false;
            }
          );
      }
    });
  }
  async downloadCertificate(planet: UserPlanet) {
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
        // Extraemos específicamente name y lastname
        const userInfo = {
          name: userData.name,
          lastname: userData.lastname
        };
        
        await this.pdfService.generatePlanetTittleCertificatePDF(planet, userInfo);
      }
    } catch (error) {
      console.error('Error generando certificado:', error);
    }
  }

}