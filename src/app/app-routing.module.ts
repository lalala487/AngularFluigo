import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DealDetailComponent } from './deal-detail/deal-detail.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { AgbComponent } from './agb/agb.component';

const routes: Routes = [
  { path: 'deal/:slug', component: DealDetailComponent, },
  { path: 'home', component: HomeComponent },
  { path: 'datenschutz', component: DatenschutzComponent },
  { path: 'agb', component: AgbComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
