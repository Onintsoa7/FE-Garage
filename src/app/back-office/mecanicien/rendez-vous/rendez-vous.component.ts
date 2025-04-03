import { CommonModule } from '@angular/common';
import { Component ,OnInit} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../../../core/services/frontoffice/service.service';
import { Service } from '../../../core/models/service';

@Component({
  selector: 'app-rendez-vous',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CdkDropList,
    CdkDrag,
    NzCardModule,
    NzDividerModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule,
    NzSpinModule
  ],
  templateUrl: './rendez-vous.component.html',
  styleUrls: ['./rendez-vous.component.scss'],
  providers: [NzMessageService]
})
export class RendezVousComponent implements OnInit{

  mecano: string | null = sessionStorage.getItem('connected_admin');
  serviceList: Service[] = [];
  todo: Service[] = [];
  inProgress: Service[] = [];
  done: Service[] = [];
  isLoading: boolean = false;  

  constructor(private Service: ServiceService, private message: NzMessageService) {}

  ngOnInit(): void {
    this.getListRendezVous();
  }

  getListRendezVous(): void {
    this.isLoading = true;
    if(this.mecano){
      let parsedUser = JSON.parse(this.mecano);
      this.Service.getServicesByEtatAndMecanicien('assigne', parsedUser._id).subscribe({
        next: (data) => {
          this.serviceList = Array.isArray(data) ? data : [data];
          this.todo = this.serviceList.filter(service => service.etat === 'assigne');
          this.inProgress = this.serviceList.filter(service => service.etat === 'En cours');
          this.done = this.serviceList.filter(service => service.etat === 'Facturer');
          this.isLoading = false;
          this.message.success('Liste des rendez-vous chargée avec succès');
        },
        error: (err) => {
          console.error('Erreur lors du chargement des services', err);
          this.message.error('Erreur lors du chargement des services');
          this.isLoading = false;
        },
      });
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
  
      const movedTask = event.container.data[event.currentIndex];
  
      if (event.container.id === 'todoList') {
        movedTask.etat = 'assigne';
      } else if (event.container.id === 'inProgressList') {
        movedTask.etat = 'En cours';
      } else if (event.container.id === 'doneList') {
        movedTask.etat = 'Facturer';
      }

      this.isLoading = true;
      this.message.info('Mise à jour de l\'état en cours...');

      // Appeler le backend pour mettre à jour l'état
      this.Service.updateService(movedTask._id, { etat: movedTask.etat }).subscribe({
        next: (response) => {
          console.log(`✅ État mis à jour avec succès pour l'élément ${movedTask._id} - ${response.etat}`);
          this.isLoading = false;
          this.message.success('État mis à jour avec succès !');
        },
        error: (err) => {
          console.error('❌ Erreur lors de la mise à jour de l\'état', err)
          this.isLoading = false;
          this.message.error('Erreur lors de la mise à jour de l\'état');
        }  
      });
    }
  }
}
