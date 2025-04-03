import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
// import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-sidebar-admin',
  imports: [
    CommonModule,
    NzButtonModule,
    // NzIconModule,
    NzLayoutModule,
    NzMenuModule
  ],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.scss'
})
export class SidebarAdminComponent {
  constructor(private router: Router) {}
  logout(): void {
    console.log("Déconnexion...");
    this.router.navigate(['/login']);
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  public sideBarContents: any = [
    {
      id: 1,
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/backoffice/admin'
    },
    {
      id: 2,
      title: 'Mecanicien',
      icon: 'user',
      route: '/backoffice/admin/mecanicien'
    },
    {
      id: 2,
      title: 'Rendez-Vous',
      icon: 'file-done',
      route: '/backoffice/admin/rendezvous'
    }
  ];
}
