import { Routes } from '@angular/router';
import { BackOfficeComponent } from './back-office/back-office.component';
import { MecanicienComponent } from './back-office/mecanicien/mecanicien.component';
import { DashboardComponent } from './back-office/mecanicien/dashboard/dashboard.component';
import { AdminComponent } from './back-office/admin/admin.component';
import { DashboardComponent as AdminDashboard } from './back-office/admin/dashboard/dashboard.component';
import { MecanicienComponent as mecano } from './back-office/admin/mecanicien/mecanicien.component';
import { RendezVousComponent as adminRendezVous } from './back-office/admin/rendez-vous/rendez-vous.component';
import { RendezVousComponent as MecanicienRdv } from './back-office/mecanicien/rendez-vous/rendez-vous.component';
import { AppMecanoAuthGuard } from './core/guards/app-mecano-auth-guard';
import { AppAdminAuthGuard } from './core/guards/app-admin-auth-guard';
export const routes: Routes = [
    { path: '', component: BackOfficeComponent},
    { path: 'backoffice', component: BackOfficeComponent},
    {
      path: 'backoffice/mecanicien',component: MecanicienComponent, canActivate: [AppMecanoAuthGuard],
      children: [
        { path: '', component: DashboardComponent, canActivate: [AppMecanoAuthGuard]},
        { path: 'rendezvous', component: MecanicienRdv, canActivate: [AppMecanoAuthGuard]}
      ]
    },
    {
      path: 'backoffice/admin', component: AdminComponent,canActivate: [AppAdminAuthGuard],
      children: [
        { path: '', component: AdminDashboard,canActivate: [AppAdminAuthGuard]},
        { path: 'mecanicien', component: mecano,canActivate: [AppAdminAuthGuard]},
        { path: 'rendezvous', component: adminRendezVous,canActivate: [AppAdminAuthGuard]}
      ]
    }];
