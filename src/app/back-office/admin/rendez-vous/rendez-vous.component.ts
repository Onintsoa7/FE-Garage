import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { User } from '../../../core/models/user';
import { AuthService } from '../../../core/services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

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
  rendezVousData: Service[] = [];
  filteredRendezVous: Service[] = [];
  mecanicienList: User[] = [];
  upcomingDates: any[] = [];
  constructor(private fb: FormBuilder, private serviceService: ServiceService,
      private authService: AuthService, private message: NzMessageService, private cdr: ChangeDetectorRef) {
    this.formRendezVous = this.fb.group({
      mecanicien: [null, Validators.required],
      date: [null, Validators.required],
      dateoffice: [null, Validators.required],
      heure: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRendezVous();
    this.getListMecanicien();
    this.loadUpcomingDates();
    this.formRendezVous.valueChanges.subscribe(() => {
      this.checkMechanicAvailability();
    });
  }
  checkMechanicAvailability(): void {
    const selectedDate = this.formRendezVous.value.date;
    const selectedTime = this.formRendezVous.value.heure;

    if (selectedDate && selectedTime) {
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(selectedTime.getHours());
      selectedDateTime.setMinutes(selectedTime.getMinutes());

      const isTaken = this.upcomingDates.some(service => {
        const serviceDate = new Date(service.dateFixeVisite);
        const serviceTime = service.heureFixeVisite;

        // Si la date correspond
        if (serviceDate.toDateString() === selectedDateTime.toDateString() && serviceTime === this.formatTime(selectedDateTime)) {
          return true;
        }
        return false;
      });

      if (isTaken) {
        this.message.error('Tous les mécaniciens sont pris à cette heure');
      }
    }
  }
  loadUpcomingDates(): void {
    this.serviceService.getServicesUpComingTakenDates().subscribe({
      next: (data: any[]) => {
        this.upcomingDates = data;
        console.log("Dates prises à venir :", this.upcomingDates);
      },
      error: (error) => {
        console.error("Erreur lors du chargement des dates à venir :", error);
      }
    });
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
  getRendezVousDuJour(date: Date) {
    const currentDateMidnight = new Date(date).setHours(0, 0, 0, 0);
    return this.rendezVousData.filter(rdv => {
      const displayDate = rdv.dateFixeVisite ? new Date(rdv.dateFixeVisite) : new Date(rdv.createdAt!);
      const rdvDateMidnight = displayDate.setHours(0, 0, 0, 0);
      return rdvDateMidnight === currentDateMidnight;
    });
  }
  filterRendezVousByDate(): void {
    this.filteredRendezVous = this.rendezVousData.filter(rdv => {
      const date = rdv.dateFixeVisite ? new Date(rdv.dateFixeVisite) : new Date(rdv.createdAt!);
      return date.toLocaleDateString('fr-CA') === this.selectedDate;
    });
  }
  onSelectChange(date: Date): void {
    this.selectedDateObject = date;
    this.selectedDate = date.toLocaleDateString('fr-CA');
    this.filterRendezVousByDate();
    this.selectedRDVIndex = null;
  }

  openForm(index: number, rdv: Service): void {
    if (rdv.etat !== 'devis') return;

    this.selectedRDVIndex = index;

    if (!rdv.prixPiece) {
      rdv.prixPiece = [];
    }

    let heureSuggestionVisite: Date | null = null;
    if (rdv.heureSuggestionVisite) {
        const [hours, minutes] = rdv.heureSuggestionVisite.split(':').map(Number);
        heureSuggestionVisite = new Date();
        heureSuggestionVisite.setHours(hours, minutes, 0, 0);
    }

    this.formRendezVous.patchValue({
      mecanicien: rdv.mecanicien || null,
      date: rdv.createdAt ? new Date(rdv.createdAt) : null,
      dateoffice: rdv.dateSuggestionVisite ? new Date(rdv.dateSuggestionVisite) : null,
      heure: heureSuggestionVisite,
      estimationReparation: rdv.dureeEstimee || null
    });
  }

  submitForm(): void {
    if (this.formRendezVous.valid) {

        // Récupération des données du formulaire
        const formValues = this.formRendezVous.value;

        // Récupération des pièces avec leurs prix
        const selectedService = this.filteredRendezVous[this.selectedRDVIndex!];
        const prixPieces: (number | null)[] = [];
        const avecPieces: boolean[] = [];

        // Transformation des données en tableaux distincts
        selectedService.piece.forEach((piece: any, index: number) => {
          if (this.prixPieces[index] !== undefined && this.prixPieces[index] !== null) {
              prixPieces.push(this.prixPieces[index]);
          } else {
              prixPieces.push(0);
          }
          avecPieces.push(selectedService.avecPiece?.[index] || false);
      });

        // Création de l'objet à envoyer
        const dataToSubmit = {
            mecanicien: formValues.mecanicien,
            dateFixeVisite: formValues.dateoffice,
            heureFixeVisite: this.formatTime(formValues.heure),
            dureeEstimee: this.formatTime(formValues.estimationReparation),
            avecPiece: avecPieces,
            prixPiece: prixPieces,
            etat: "assigne"
        };

        this.serviceService.validateService(selectedService._id!, dataToSubmit).subscribe({
          next: (response) => {
            console.log("Service mis à jour avec succès :", response);

            this.filteredRendezVous[this.selectedRDVIndex!] = selectedService;
            this.message.success('Service mis à jour avec succès !');

            this.selectedRDVIndex = null;
            this.formRendezVous.reset();
            this.cdr.detectChanges();
          },
          error: (error) => console.error("Erreur lors de la mise à jour du service :", error)
        });
    }
}


formatTime(time: any): string | null {
  if (!time) return null;

  if (typeof time === 'string' && time.match(/^\d{2}:\d{2}$/)) {
      return time;
  }

  if (time instanceof Date) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
  }

  if (typeof time === 'object' && 'hour' in time && 'minute' in time) {
      const hours = time.hour.toString().padStart(2, '0');
      const minutes = time.minute.toString().padStart(2, '0');
      return `${hours}:${minutes}`;
  }

  console.error("Format d'heure non reconnu :", time);
  return null;
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

  getBadgeColor(rdv: Service): string {
    if (rdv.createdAt && !rdv.dateFixeVisite && rdv.etat === 'devis') {
      return 'black';
    }
    if (rdv.createdAt && rdv.dateFixeVisite && rdv.etat === 'attente') {
      return 'orange';
    }
    if (rdv.createdAt && rdv.dateFixeVisite && rdv.etat === 'assigne') {
      return 'yellow';
    }
    if (rdv.createdAt && rdv.dateFixeVisite && rdv.etat === 'en cours') {
      return 'purple';
    }
    if (rdv.createdAt && rdv.dateFixeVisite && rdv.etat === 'annule') {
      return 'red';
    }
    if (rdv.createdAt && rdv.dateFixeVisite && rdv.etat === 'facturer') {
      return 'cyan';
    }
    if (rdv.createdAt && rdv.dateFixeVisite && rdv.etat === 'apayer') {
      return 'blue';
    }
    if (rdv.createdAt && rdv.dateFixeVisite && rdv.etat === 'payer') {
      return 'green';
    }else{
      return 'brown';
    }
  }
  getBadgeDetails(rdv: Service): { label: string, color: string } {
    switch (rdv.etat) {
      case 'devis':
        return { label: 'Devis', color: 'black' };
      case 'attente':
        return { label: 'En attente', color: 'orange' };
      case 'assigne':
        return { label: 'Assigné', color: 'yellow' };
      case 'en cours':
        return { label: 'En cours', color: 'purple' };
      case 'annule':
        return { label: 'Annulé', color: 'red' };
      case 'facturer':
        return { label: 'Facturé', color: 'cyan' };
      case 'apayer':
        return { label: 'À Payer', color: 'blue' };
      case 'payer':
        return { label: 'Payé', color: 'green' };
      default:
        return { label: 'Inconnu', color: 'brown' };
    }
  }

  getDisplayDate(rdv: Service): Date | null {
    if (rdv.dateFixeVisite) {
      return new Date(rdv.dateFixeVisite);
    } else if (rdv.createdAt) {
      return new Date(rdv.createdAt);
    }
    return null;
  }

  getDisplayText(rdv: Service): string {
    const displayDate = this.getDisplayDate(rdv);
    const dateText = displayDate ? displayDate.toLocaleDateString('fr-CA') : 'Pas de date';
    return `${rdv.voiture.immatriculation || 'Immatriculation non renseignée'}`;
  }
  prixPieces: (number | null)[] = []; // Initialiser un tableau vide pour les prix

  updatePrice(event: Event, index: number): void {
      const input = event.target as HTMLInputElement;
      const value = input.value ? parseFloat(input.value) : null;

      // S'assurer que le tableau prixPieces a la même taille que le nombre de pièces
      if (this.prixPieces.length <= index) {
          this.prixPieces.length = index + 1; // Augmente la taille du tableau si nécessaire
      }

      this.prixPieces[index] = value; // Met à jour le prix au bon index

      console.log("Prix mis à jour :", this.prixPieces); // Regarde la console pour vérifier
  }

  etatList = [
    { label: 'Devis', color: 'black' },
    { label: 'En attente', color: 'orange' },
    { label: 'Assigné', color: 'yellow' },
    { label: 'En cours', color: 'purple' },
    { label: 'Annulé', color: 'red' },
    { label: 'Facturé', color: 'cyan' },
    { label: 'À Payer', color: 'blue' },
    { label: 'Payé', color: 'green' },
    { label: 'Inconnu', color: 'brown' }
  ];
}
