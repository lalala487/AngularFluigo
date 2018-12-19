import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DealDetailComponent } from './deal-detail/deal-detail.component';
import { DataProtectionComponent } from './data-protection/data-protection.component';
import { CustomerServiceComponent } from './customer-service/customer-service.component';
import { AccountComponent } from './account/account.component';
import { AgbComponent } from './agb/agb.component';
import { TravelGuidesComponent } from './travel-guides/travel-guides.component';
import { TeamComponent } from './team/team.component';
import { AuthGuardService } from './services/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  { path: 'deal/:slug', component: DealDetailComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'data-protection', component: DataProtectionComponent },
  { path: 'customer-service', component: CustomerServiceComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuardService] },
  { path: 'agb', component: AgbComponent },
  { path: 'team', component: TeamComponent },
  { path: 'travel-guides', component: TravelGuidesComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
