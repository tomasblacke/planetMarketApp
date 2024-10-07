import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';
import { TiendaTripsComponent } from './tienda-trips/tienda-trips.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'trips', component: TiendaTripsComponent },
  // Añade otras rutas aquí
  { path: '**', redirectTo: '' } // Ruta comodín, redirige a home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
