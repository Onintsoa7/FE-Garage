import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
// import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-sidebar-mecanicien',
  imports: [
    CommonModule,
    NzButtonModule,
    // NzIconModule,
    NzLayoutModule,
    NzMenuModule],
  templateUrl: './sidebar-mecanicien.component.html',
  styleUrl: './sidebar-mecanicien.component.scss'
})
export class SidebarMecanicienComponent {
  isCollapsed = false; 

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  navigateToProfil() {
    this.router.navigate(['/profiles']);
  }

  logout(): void {
    console.log("Déconnexion...");
    this.router.navigate(['/login']); 
  }

  public sideBarContents: any = [
  {
    id: 1,
    title: 'Dashboard',
    icon: 'dashboard',
    route: '/backoffice/mecanicien'
  },
  {
    id: 2,
    title: 'Rendez-vous',
    icon: 'file-done',
    route: '/backoffice/mecanicien/rendezvous'
  }
  ];
}
