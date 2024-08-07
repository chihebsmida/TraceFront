import { Component, inject, OnInit } from '@angular/core';
import { WorkSummaryService } from "../../services/work-summary.service";
import { NgForOf, NgIf } from "@angular/common";
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FormsModule } from "@angular/forms";

Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-work-summary-chart',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
  ],
  templateUrl: './work-summary-chart.component.html',
  styleUrls: ['./work-summary-chart.component.css']
})
export class WorkSummaryChartComponent implements OnInit {
  public chart: any;
  public workSummary: any;
  public selectedUser: string = '';
  public selectedMachine: string = 'all'; // Définir par défaut sur 'all' pour afficher toutes les machines
  public users: string[] = [];
  public machines: string[] = []; // Liste des machines pour l'utilisateur sélectionné
  public selectedSummaryType: string = 'daily'; // Par défaut à 'daily'
  workSummaryService = inject(WorkSummaryService);

  ngOnInit(): void {
    this.fetchData(); // Charger les données initiales
  }

  fetchData(): void {
    let summaryObservable;

    if (this.selectedMachine !== 'all') {
      switch (this.selectedSummaryType) {
        case 'weekly':
          summaryObservable = this.workSummaryService.getWeeklyWorkSummaryByMachineAndEmployee(this.selectedUser, this.selectedMachine);
          break;
        case 'monthly':
          summaryObservable = this.workSummaryService.getMonthlyWorkSummaryByMachineAndEmployee(this.selectedUser, this.selectedMachine);
          break;
        default:
          summaryObservable = this.workSummaryService.getDailyWorkSummaryByMachineAndEmployee(this.selectedUser, this.selectedMachine);
      }
    } else {
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
        if (this.selectedMachine === 'all') {
          this.users = Object.keys(this.workSummary);
        }
        // Initialiser selectedUser seulement s'il est vide
        if (this.selectedUser === '') {
          this.selectedUser = this.users[0] || ''; // Sélectionner le premier utilisateur par défaut
        }
        // Mettre à jour la liste des machines
        this.getMachines(this.selectedUser);
        this.updateChart();
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

  // Méthode pour mettre à jour le graph avec choix de l'utilisateur et machine
  updateChartWithUserAndMachine(): void
  {
    this.fetchData();
    this.updateChart();
  }

  updateChart(): void {const workDurations: { x: string, y: number, label: string }[] = [];
    const pauseDurations: { x: string, y: number, label: string }[] = [];
    const inactiveDurations: { x: string, y: number, label: string }[] = [];
    const labels: string[] = [];

    // Cas où une machine spécifique est sélectionnée
    if (this.selectedMachine !== 'all') {
      if (this.workSummary) {
        for (const date in this.workSummary) {
          if (this.workSummary.hasOwnProperty(date)) {
            const workDuration = this.convertDuration(this.workSummary[date].workDuration);
            const pauseDuration = this.convertDuration(this.workSummary[date].pauseDuration);
            const inactiveDuration = this.convertDuration(this.workSummary[date].inactiveDuration);

            labels.push(date);
            workDurations.push({ x: date, y: workDuration, label: this.formatDuration(workDuration) });
            pauseDurations.push({ x: date, y: pauseDuration, label: this.formatDuration(pauseDuration) });
            inactiveDurations.push({ x: date, y: inactiveDuration, label: this.formatDuration(inactiveDuration) });
          }
        }
      }
    } else {
      // Cas où toutes les machines sont sélectionnées
      if (this.workSummary && this.workSummary[this.selectedUser]) {
        for (const date in this.workSummary[this.selectedUser]) {
          if (this.workSummary[this.selectedUser].hasOwnProperty(date)) {
            const workDuration = this.convertDuration(this.workSummary[this.selectedUser][date].workDuration);
            const pauseDuration = this.convertDuration(this.workSummary[this.selectedUser][date].pauseDuration);
            const inactiveDuration = this.convertDuration(this.workSummary[this.selectedUser][date].inactiveDuration);

            labels.push(date);
            workDurations.push({ x: date, y: workDuration, label: this.formatDuration(workDuration) });
            pauseDurations.push({ x: date, y: pauseDuration, label: this.formatDuration(pauseDuration) });
            inactiveDurations.push({ x: date, y: inactiveDuration, label: this.formatDuration(inactiveDuration) });
          }
        }
      }
    }

    if (this.chart) {
      this.chart.destroy(); // Détruire le graphique précédent avant de créer un nouveau
    }
    // Déterminer le texte du titre
    const titleText = this.selectedMachine === 'all'
      ? `Résumé ${this.selectedSummaryType} du travail pour l'employé ${this.selectedUser} sur toutes les machines`
      : `Résumé ${this.selectedSummaryType} du travail pour l'employé ${this.selectedUser} sur la machine ${this.selectedMachine}`;

    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: "Durée de travail", data: workDurations.map(d => d.y), backgroundColor: 'rgba(75, 192, 192, 0.2)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 },
          { label: "Durée de pause", data: pauseDurations.map(d => d.y), backgroundColor: 'rgba(255, 206, 86, 0.2)', borderColor: 'rgba(255, 206, 86, 1)', borderWidth: 1 },
          { label: "Durée d'inactivité", data: inactiveDurations.map(d => d.y), backgroundColor: 'rgba(153, 102, 255, 0.2)', borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 1 }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        },
        aspectRatio: 2.5,
        plugins: {
          title: {
            display: true,
            text: titleText,
            font: {
              size: 18
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const datasetIndex = context.datasetIndex;
                const index = context.dataIndex;
                const label = context.dataset.label || '';
                const value = context.raw;
                const durationLabel = [workDurations, pauseDurations, inactiveDurations][datasetIndex][index].label;
                return `${label}: ${durationLabel}`;
              }
            }
          }
        }
      }
    });
  }

  convertDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
    if (match) {
      const hours = parseInt(match[1] || '0');
      const minutes = parseInt(match[2] || '0');
      const seconds = parseFloat(match[3] || '0');
      return hours * 3600 + minutes * 60 + seconds;
    } else {
      return 0;
    }
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  }

  onChangeUser() {
    this.selectedMachine='all'; // Réinitialiser la machine sélectionnée à 'all'
    this.fetchData();
  }
}
