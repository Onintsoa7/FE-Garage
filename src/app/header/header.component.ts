import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isHeaderVisible = false;
  isMenuOpen = false;
  isServicesMenuOpen = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    this.isHeaderVisible = scrollPosition > 200;
  }
  servicesMenu = [
    { id: 1, title: "Diagnostic"},
    { id: 2, title: "Entretien"},
    { id: 3, title: "Réparation"}
  ];
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  constructor(private router: Router) {}

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
