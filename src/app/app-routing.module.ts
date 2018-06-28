import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { HomeComponent } from './home/home.component';
import { DealDetailComponent } from './deal-detail/deal-detail.component';

const routes: Routes = [
  { path: 'detail', component: DetailComponent, },
  { path: 'deal/:slug', component: DealDetailComponent, },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
