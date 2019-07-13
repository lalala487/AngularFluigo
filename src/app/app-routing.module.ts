import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AgbComponent } from './agb/agb.component';
import { TeamComponent } from './team/team.component';
import { DataProtectionComponent } from './data-protection/data-protection.component';
import { CustomerServiceComponent } from './customer-service/customer-service.component';
import { DealDetailComponent } from './deal-detail/deal-detail.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AuthGuardService } from './services/auth-guard.service';
import { OfflineComponent } from './offline/offline.component';
import { TravelGuideComponent } from './travel-guide/travel-guide.component';
import { OfflineGuardService } from './services/offline-guard.service';

const routes: Routes = [
  { path: 'deal/:slug', component: DealDetailComponent, canActivate: [OfflineGuardService] },
  { path: 'home', component: HomeComponent, canActivate: [OfflineGuardService] },
  { path: 'login', component: LoginComponent, canActivate: [OfflineGuardService]  },
  { path: 'logout', component: LogoutComponent, canActivate: [OfflineGuardService]  },
  { path: 'data-protection', component: DataProtectionComponent, canActivate: [OfflineGuardService]  },
  { path: 'customer-service', component: CustomerServiceComponent, canActivate: [OfflineGuardService]  },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuardService, OfflineGuardService] },
  { path: 'account/:page', component: AccountComponent, canActivate: [AuthGuardService, OfflineGuardService]},
  { path: 'agb', component: AgbComponent, canActivate: [OfflineGuardService]  },
  { path: 'team', component: TeamComponent, canActivate: [OfflineGuardService]  },
  { path: 'offline', component: OfflineComponent, canActivate: [OfflineGuardService]  },
  { path: 'travel-guide', component: TravelGuideComponent, canActivate: [OfflineGuardService]  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
