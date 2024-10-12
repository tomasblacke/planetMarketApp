import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';
import { TiendaTripsComponent } from './tienda-trips/tienda-trips.component';
import { TiendaPlanetsComponent} from './tienda-planets/tienda-planets.component';
import { PlanetComponent } from './planet/planet.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'trips', component: TiendaTripsComponent },
  { path: 'planets', component: TiendaPlanetsComponent},
  { path: 'planets/:planetID', component: PlanetComponent},// este nos va a llevar a la data de cada planeta

  // Añadir otras rutas aca
  { path: '**', redirectTo: '' } // Ruta comodín, redirige a home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
