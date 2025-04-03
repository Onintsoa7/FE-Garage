import { Component, OnInit } from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ServiceService } from '../../../core/services/frontoffice/service.service';
import { Service } from '../../../core/models/service';

@Component({
  selector: 'app-rendez-vous',
  standalone: true,
  imports: [
    CommonModule,
    NzBadgeModule,
    NzCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzFormModule,
    NzButtonModule
  ],
  templateUrl: './rendez-vous.component.html',
  styleUrl: './rendez-vous.component.scss'
})
export class RendezVousComponent implements OnInit {
  selectedDate: string = new Date().toLocaleDateString('fr-CA');
  selectedDateObject: Date = new Date();
  selectedRDVIndex: number | null = null;
  formRendezVous: FormGroup;
  mecaniciens = ['Mickael', 'Jean', 'Tiana', 'Andry'];
  rendezVousData: Service[] = [];

  constructor(private fb: FormBuilder, private serviceService: ServiceService) {
    this.formRendezVous = this.fb.group({
      mecanicien: [null, Validators.required],
      date: [null, Validators.required],
      heure: [null, Validators.required],
      estimationReparation: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRendezVous();
  }
  getRendezVousDuJour(date: Date) {
    const currentDateMidnight = new Date(date).setHours(0, 0, 0, 0);
    return this.rendezVousData.filter(rdv => {
      const displayDate = rdv.dateFixeVisite ? new Date(rdv.dateFixeVisite) : new Date(rdv.dateSuggestionVisite!);
      const rdvDateMidnight = displayDate.setHours(0, 0, 0, 0);
      return rdvDateMidnight === currentDateMidnight;
    });
  }


  onSelectChange(date: Date): void {
    this.selectedDateObject = date;
    this.selectedDate = date.toLocaleDateString('fr-CA');
    this.selectedRDVIndex = null;
  }

  openForm(index: number, rdv: Service): void {
    if (rdv.etat === 'Validé') return;
    this.selectedRDVIndex = index;
    this.formRendezVous.patchValue({
      mecanicien: null,
      date: new Date(rdv.dateSuggestionVisite!),
      heure: rdv.heureSuggestionVisite,
    });
  }

  submitForm(): void {
    if (this.formRendezVous.valid) {
      console.log('Affectation du mécanicien :', this.formRendezVous.value);
    }
  }

  loadRendezVous(): void {
    this.serviceService.getServices().subscribe({
      next: (data: Service[]) => {
        this.rendezVousData = data;
        console.log(this.rendezVousData);
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des services:", err);
      }
    });
  }

  // Détermine la couleur du badge selon les conditions spécifiées
  getBadgeColor(rdv: Service): string {
    if (rdv.dateSuggestionVisite && !rdv.dateFixeVisite && rdv.etat === 'devis') {
      console.log(rdv.dateSuggestionVisite, " devis");
      return 'black';
    }
    if (rdv.dateSuggestionVisite && rdv.dateFixeVisite && rdv.etat === 'attente') {
      console.log(rdv.dateFixeVisite, " attente");
      return 'orange';
    }
    if (rdv.dateSuggestionVisite && rdv.dateFixeVisite && rdv.etat === 'assigne') {
      console.log(rdv.dateFixeVisite, " assigne");
      return 'yellow';
    }
    if (rdv.dateSuggestionVisite && rdv.dateFixeVisite && rdv.etat === 'annule') {
      console.log(rdv.dateFixeVisite, " annule");
      return 'red';
    }
    if (rdv.dateSuggestionVisite && rdv.dateFixeVisite && rdv.etat === 'facturer') {
      console.log(rdv.dateFixeVisite, " facturer");
      return 'blue';
    }
    if (rdv.dateSuggestionVisite && rdv.dateFixeVisite && rdv.etat === 'payer') {
      console.log(rdv.dateFixeVisite, " payer");
      return 'green';
    }else{
      return 'brown';
    }
    return 'default';
  }

  // Renvoie la date à afficher : si dateFixeVisite existe, on l'utilise, sinon on utilise dateSuggestionVisite
  getDisplayDate(rdv: Service): Date | null {
    if (rdv.dateFixeVisite) {
      return new Date(rdv.dateFixeVisite);
    } else if (rdv.dateSuggestionVisite) {
      return new Date(rdv.dateSuggestionVisite);
    }
    return null;
  }

  // Combine la date d'affichage (formatée) et l'immatriculation de la voiture
  getDisplayText(rdv: Service): string {
    const displayDate = this.getDisplayDate(rdv);
    const dateText = displayDate ? displayDate.toLocaleDateString('fr-CA') : 'Pas de date';
    // On suppose que la propriété immatriculation existe dans l'objet Service
    return `${rdv.voiture.immatriculation || 'Immatriculation non renseignée'}`;
  }
}
