import { AuthService } from './../../../core/services/auth.service';
import { ServiceService } from './../../../core/services/frontoffice/service.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzCardModule,
    NgxEchartsModule,
    FormsModule,
    NzDatePickerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  moisFiltre: Date = new Date();
  selectedMonth: string = '01';
  servicesDone : Number | undefined;
  servicesPending : Number | undefined;
  servicesToday : Number | undefined;
  mecanicienCount : Number | undefined;
  CA : string | undefined;

  salesData: { [key: string]: number } = {};
  revenueByMonth: number[] = [];
  selectedYear: number = this.moisFiltre.getFullYear();


  ngOnInit(): void {
    this.getServicesDone();
    this.getServicesPending();
    this.getServicesToday();
    this.getMecanicienCount();
    this.getChiffreAffaire();
    this.getMontantTotal(this.selectedYear);
  }

  constructor(private serviceService: ServiceService,
              private authService: AuthService
  ){

  }

  disableFutureMonth = (current: Date): boolean => {
    const today = new Date();
    const currentMonth = current.getMonth();
    const currentYear = current.getFullYear();

    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    return (
      currentYear > todayYear ||
      (currentYear === todayYear && currentMonth > todayMonth)
    );
  };
  updateChartOptions(): void {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const data: number[] = [];

    months.forEach((_, index) => {
      const monthKey = `${this.selectedYear}-${(index + 1).toString().padStart(2, '0')}`;
      data.push(this.salesData[monthKey] || 0);
    });

    this.chartOptions = {
      title: {
        text: `Chiffre d'affaires - ${this.selectedYear}`
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: months
      },
      yAxis: {
        type: 'value',
        name: 'Chiffre d\'affaires (MGA)'
      },
      series: [
        {
          data: data,
          type: 'bar',
          smooth: true
        }
      ]
    };
  }


  chartOptions: any = {};
  mettreAJourGraphique(): void {
    const selectedYear = this.moisFiltre.getFullYear();
    const selectedMonth = (this.moisFiltre.getMonth() + 1).toString().padStart(2, '0');

    this.getMontantTotal(selectedYear);
    this.selectedYear = selectedYear;
  }
  getServicesToday(): void {
    this.serviceService.getServicesToday().subscribe({
      next: (data) => {
        this.servicesToday = data.count;
        console.log('Services prévus pour aujourd\'hui :', data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des services prévus pour aujourd\'hui :', err);
      }
    });
  }
  getServicesDone(): void {
    this.serviceService.getCountByEtat("facturer").subscribe({
      next: (response) => {
        this.servicesDone = response.count;
        console.log(`Nombre de rendez-vous avec l'état "${"facturer"}":`, this.servicesDone);
      },
      error: (err) => {
        console.error(`Erreur lors de la récupération des rendez-vous pour l'état "${"facturer"}":`, err);
      }
    });
  }
  getServicesPending(): void {
    this.serviceService.getCountByEtat("devis").subscribe({
      next: (response) => {
        this.servicesPending = response.count;
        console.log(`Nombre de rendez-vous avec l'état "${"devis"}":`, this.servicesPending);
      },
      error: (err) => {
        console.error(`Erreur lors de la récupération des rendez-vous pour l'état "${"devis"}":`, err);
      }
    });
  }
  getMecanicienCount(): void {
    this.authService.countMecaniciens().subscribe({
      next: (response) => {
        this.mecanicienCount = response.count;
      },
      error: (err) => {
        console.error(`Erreur lors de la récupération du nombre des mécano`, err);
      }
    });
  }

  getMontantTotal(year: number): void {
    this.serviceService.getMontantTotalByYear(year).subscribe({
      next: (data) => {
        this.salesData = data;
        this.updateChartOptions();  // Mise à jour du graphique après récupération des données
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du montant total :', err);
      }
    });
  }
  getChiffreAffaire(): void {
    this.serviceService.getCA().subscribe({
      next: (data) => {
        this.CA = this.formatNumber(data.total);
        console.log('Chiffre d\'affaires :', this.formatNumber(data.total));
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du montant total :', err);
      }
    });
  }

  formatNumber(value: number): string {
    // Format number using French locale without decimals
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

}
