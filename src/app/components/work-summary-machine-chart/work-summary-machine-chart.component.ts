import { Component, OnInit } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {ChartComponent} from "../../abstarcts/work-summary-abstract-chart";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatLabel, MatSelect} from "@angular/material/select";
import {MatButton, MatFabButton} from "@angular/material/button";

@Component({
  selector: 'app-work-summary-machine-chart',
  standalone: true,
  templateUrl: './work-summary-machine-chart.component.html',
  imports: [
    FormsModule,
    NgForOf,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatIcon,
    MatOption,
    MatSelect,
    MatLabel,
    MatFormField,
    MatFabButton,
    MatButton
  ],
  styleUrls: ['./work-summary-machine-chart.component.css']
})
export class WorkSummaryMachineChartComponent  extends  ChartComponent implements OnInit {
  public machineNames: string[] = [];
 constructor() {
   super();
 }

  ngOnInit(): void {
    this.initilizeMachineNamesAndData();
  }
  fetchData(): void {
    let summaryObservable;
    const titleText =
      `Résumé ${this.selectedSummaryType} du travail pour la machine ${this.selectedMachine}`;
    switch (this.selectedSummaryType) {
      case 'weekly':
      summaryObservable=this.workSummaryService.getWeeklyWorkSummaryByMachine(this.selectedMachine)
        break;
      case 'monthly':
        summaryObservable=this.workSummaryService.getMonthlyWorkSummaryByMachine(this.selectedMachine)
        break;
      default:
        summaryObservable=this.workSummaryService.getDailyWorkSummaryByMachine(this.selectedMachine)
    }
    summaryObservable.subscribe(
      data => {
        this.workSummary = data || {};
        this.updateChart("MyChart2",titleText);
      },
      error => console.error('Erreur lors du chargement du résumé du travail!', error)
    );
  }

  onMachineChange(): void {
    this.fetchData();
  }
  initilizeMachineNamesAndData(): void {
    this.workSummaryService.getDistinctAllMachineNames().subscribe(
      data => {
        this.machineNames = data || [];
        if(this.machineNames.length>0)
        this.selectedMachine = this.machineNames[0] || ''; // Sélectionner le premier utilisateur par défaut
        this.fetchData();
      },
      error => console.error('Erreur lors du chargement des noms de machines!', error)
    );
  }



}
