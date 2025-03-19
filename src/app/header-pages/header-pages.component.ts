import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-pages',
  imports: [CommonModule],
  templateUrl: './header-pages.component.html',
  styleUrl: './header-pages.component.scss'
})
export class HeaderPagesComponent {
  isMenuOpen = false;
  isServicesMenuOpen = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  constructor(private router: Router) {}
  servicesMenu = [
      { id: 1, title: "Diagnostic"},
      { id: 2, title: "Entretien"},
      { id: 3, title: "Réparation"}
  ];
  toggleServicesMenu(event: Event) {
    event.preventDefault();
    this.isServicesMenuOpen = !this.isServicesMenuOpen;
  }
  navigateToService(service: any) {
    this.router.navigate(['/services', service.id], { queryParams: { title: service.title}});
  }
  navigateToProfil() {
    this.router.navigate(['/profiles']);
  }
  navigateToRendezVous() {
    this.router.navigate(['/rendezvous']);
  }
  navigateToLandingPage() {
    this.router.navigate(['/landing-page']);
  }
}
