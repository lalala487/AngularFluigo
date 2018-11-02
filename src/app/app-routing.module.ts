import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DealDetailComponent } from './deal-detail/deal-detail.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { AccountComponent } from './account/account.component';
import { AgbComponent } from './agb/agb.component';
import { AuthGuardService } from './services/auth-guard.service';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'deal/:slug', component: DealDetailComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'datenschutz', component: DatenschutzComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuardService] },
  { path: 'agb', component: AgbComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
