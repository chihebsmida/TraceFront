import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {ChartComponent} from "../../abstarcts/work-summary-abstract-chart";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatButton} from "@angular/material/button";


@Component({
  selector: 'app-work-summary-chart',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatIcon,
    MatDivider,
    MatLabel,
    MatSelect,
    MatOption,
    MatFormField,
    MatButton,
  ],
  templateUrl: './work-summary-chart.component.html',
  styleUrls: ['./work-summary-chart.component.css']
})
export class WorkSummaryChartComponent extends ChartComponent implements OnInit {

  ngOnInit(): void {
    this.fetchData(); // Charger les données initiales
  }
  fetchData(): void
{
    let summaryObservable;
    let isApiCallForAllMachinesAndRetournAllUsers = this.selectedMachine === 'all';
    if (!isApiCallForAllMachinesAndRetournAllUsers) {
      switch (this.selectedSummaryType)
      {
        case 'weekly':
          summaryObservable = this.workSummaryService.getWeeklyWorkSummaryByMachineAndEmployee(this.selectedUser, this.selectedMachine);
          break;
        case 'monthly':
          summaryObservable = this.workSummaryService.getMonthlyWorkSummaryByMachineAndEmployee(this.selectedUser, this.selectedMachine);
          break;
        default:
          summaryObservable = this.workSummaryService.getDailyWorkSummaryByMachineAndEmployee(this.selectedUser, this.selectedMachine);
      }
    } else
    {
      // Appel à l'API générale pour tous les résumés (sans machine spécifique)
      switch (this.selectedSummaryType) {
        case 'weekly':
          summaryObservable = this.workSummaryService.getWeeklyWorkSummary();
          break;
        case 'monthly':
          summaryObservable = this.workSummaryService.getMonthlyWorkSummary();
          break;
        default:
          summaryObservable = this.workSummaryService.getDailyWorkSummary();
      }
    }

    summaryObservable.subscribe(
      data => {
        this.workSummary = data;
        if (isApiCallForAllMachinesAndRetournAllUsers)
        {
          // dans ce cas on a un objet avec les noms des utilisateurs comme clés  on doit reinitiliser workSummary pour avoir les données de l'utilisateur sélectionné
          this.users = Object.keys(this.workSummary);
          // Initialiser selectedUser seulement s'il est vide
          if (this.selectedUser === '')
          {
            this.selectedUser = this.users[0] || ''; // Sélectionner le premier utilisateur par défaut
          }
          this.workSummary = this.workSummary[this.selectedUser] || {};

        }

        // Mettre à jour la liste des machines specifiques à l'utilisateur sélectionné
        this.getMachines(this.selectedUser);



        const titleText = this.selectedMachine === 'all'
          ? `Résumé ${this.selectedSummaryType} du travail pour l'employé ${this.selectedUser} sur toutes les machines`
          : `Résumé ${this.selectedSummaryType} du travail pour l'employé ${this.selectedUser} sur la machine ${this.selectedMachine}`;
        this.updateChart("MyChart", titleText);

      },
      error => console.error('There was an error!', error)
    );
  }

  getMachines(employerName: string) {
    this.workSummaryService.getDIstinctMachineNames(employerName).subscribe(
      data => {
        this.machines = data;
      },
      error => console.error('There was an error!', error)
    );
  }
  onChangeUser() {
    this.selectedMachine='all'; // Réinitialiser la machine sélectionnée à 'all'
    this.fetchData();
  }
}
