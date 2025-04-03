import { Component, OnInit } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ServiceService } from '../../../core/services/frontoffice/service.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user';
import { Router } from '@angular/router';
interface Mecanicien extends User {}

@Component({
  selector: 'app-mecanicien',
  standalone: true,
  imports: [
    CommonModule,
    NzDividerModule,
    NzTableModule,
    NgxEchartsModule,
    NzDatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
  ],
  templateUrl: './mecanicien.component.html',
  styleUrl: './mecanicien.component.scss',
})
export class MecanicienComponent implements OnInit {
  selectedMecanicien: User | null = null;
  mecanicienList: User[] = [];
  echartOption: any = {};
  moisFiltre: Date = new Date();
  mecForm = false;

  ngOnInit(): void {
    this.getListMecanicien();
    this.initForm();
  }

  getListMecanicien(): void {
    this.authService.getListMecanicien('MECANICIEN').subscribe({
      next: (data) => {
        this.mecanicienList = Array.isArray(data) ? data : [data];
      },
      error: (err) => {
        console.error('Erreur lors du chargement des voitures', err);
      },
    });
  }
  disableFutureMonth = (current: Date): boolean => {
    const today = new Date();
    const currentMonth = current.getMonth();
    const currentYear = current.getFullYear();

    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    // Si année future OU même année mais mois futur => désactivé
    return (
      currentYear > todayYear ||
      (currentYear === todayYear && currentMonth > todayMonth)
    );
  };

  mecanicienForm!: FormGroup;
  calculateAge(date: any): number {
    if (!date) return 0;

    const dateObject = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObject.getTime())) return 0;

    const today = new Date();
    let age = today.getFullYear() - dateObject.getFullYear();
    const monthDifference = today.getMonth() - dateObject.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < dateObject.getDate())
    ) {
      age--;
    }
    return age;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private serviceService: ServiceService
  ) {}

  initForm() {
    this.mecanicienForm = this.fb.group({
      nom: ['', Validators.required],
      dateNaissance: [null, Validators.required],
      adresseMail: ['', Validators.required],
      adresse: ['', Validators.required],
      cin: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
      contact: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
    });
  }

  get listOfData(): User[] {
    return this.mecanicienList;
  }

  onSelectMecanicien(m: User): void {
    this.mecForm = false;
    this.selectedMecanicien = m;
    this.mettreAJourGraphique();
  }

  mettreAJourGraphique(): void {
    this.mecForm = false;
    if (!this.selectedMecanicien || !this.moisFiltre) return;

    const mois = this.moisFiltre.getMonth() + 1; // +1 car les mois en JS sont de 0 à 11
    const annee = this.moisFiltre.getFullYear();

    this.serviceService.getChargeDeTravailParMecanoParDateParMois(this.selectedMecanicien._id!, annee, mois)
      .subscribe({
        next: (data) => {
          console.log('Données reçues du backend :', data);
          const series = Object.keys(data).map(date => ({
            date,
            heures: data[date]
          }));

          this.echartOption = {
            tooltip: {
              trigger: 'axis',
            },
            xAxis: {
              type: 'category',
              data: series.map(d => d.date),
              name: 'Date',
            },
            yAxis: {
              type: 'value',
              name: 'Heures',
            },
            series: [
              {
                data: series.map(d => d.heures),
                type: 'line',
                smooth: true,
                name: this.selectedMecanicien?.nom
              },
            ],
          };
        },
        error: (err) => {
          console.error('Erreur lors du chargement des données :', err);
        }
      });
  }


  disableFutureDate = (current: Date): boolean => {
    return current > new Date();
  };

  submitForm(): void {
    if (this.mecanicienForm.invalid) return;

    const formValue = this.mecanicienForm.value;

    const newUser: User = {
      nom: formValue.nom,
      adresseMail: formValue.adresseMail,
      dateDeNaissance: formValue.dateNaissance
        ? new Date(formValue.dateNaissance)
        : new Date(),
      adresse: formValue.adresse,
      CIN: formValue.cin,
      numeroTel: formValue.contact,
      password: formValue.nom + ' mecano',
      role: 'MECANICIEN',
    };

    console.log(newUser);

    this.authService.addUser(newUser).subscribe({
      next: (res) => {
        alert('Mécanicien enregistré avec succès!');

        // Reload the list of mecaniciens
        this.getListMecanicien();

        // Optionally, clear the form
        this.mecanicienForm.reset();

        // Optionally, hide the form
        this.mecForm = false;
      },
      error: (err) => {
        console.error("Erreur lors de l'enregistrement du mécanicien :", err);
      },
    });
  }

  activateMecForm(): void {
    this.mecForm = true;
  }
}
