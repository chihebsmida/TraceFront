import { Component, OnInit } from '@angular/core';
import { WorkSummaryService } from "../../services/work-summary.service";
import { NgForOf, NgIf } from "@angular/common";
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend } from 'chart.js';
import {FormsModule} from "@angular/forms";

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
  styleUrl: './work-summary-chart.component.css'
})
export class WorkSummaryChartComponent implements OnInit {
  public chart: any;
  workSummary: any;
  selectedUser: string='';
  users: string[] = [];

  constructor(private workSummaryService: WorkSummaryService) { }

  ngOnInit(): void {
    this.workSummaryService.getWeeklyWorkSummary().subscribe(
      data => {
        this.workSummary = data;
        this.users = Object.keys(this.workSummary);
        this.selectedUser = this.users[0]; // Sélectionne le premier utilisateur par défaut
        this.updateChart();
      },
      error => console.error('There was an error!', error)
    );
  }

  updateChart(): void {
    const workDurations: { x: string, y: number, label: string }[] = [];
    const pauseDurations: { x: string, y: number, label: string }[] = [];
    const inactiveDurations: { x: string, y: number, label: string }[] = [];
    const labels: string[] = [];

    if (this.workSummary[this.selectedUser]) {
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

    if (this.chart) {
      this.chart.destroy(); // Détruire le graphique précédent avant de créer un nouveau
    }

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
            text: 'Résumé hebdomadaire du travail par semaine pour ' + this.selectedUser,
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


}
