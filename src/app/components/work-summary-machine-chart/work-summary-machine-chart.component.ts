import { Component, OnInit, inject } from '@angular/core';
import { WorkSummaryService } from '../../services/work-summary.service';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

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
  selector: 'app-work-summary-machine-chart',
  standalone: true,
  templateUrl: './work-summary-machine-chart.component.html',
  imports: [
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./work-summary-machine-chart.component.css']
})
export class WorkSummaryMachineChartComponent implements OnInit {
  public chart: any;
  public workSummary: any;
  public machineNames: string[] = [];
  public selectedMachine: string = '';

  workSummaryService = inject(WorkSummaryService);
  selectedSummaryType: string='daily';

  ngOnInit(): void {
    this.initilizeMachineNamesAndData();
  }



  fetchWorkSummary(): void {
    switch (this.selectedSummaryType) {
      case 'weekly':
        this.workSummaryService.getWeeklyWorkSummaryByMachine(this.selectedMachine).subscribe(
          data => {
            this.workSummary = data || {};
            this.updateChart();
          },
          error => console.error('Erreur lors du chargement du résumé du travail!', error)
        );
        break;
      case 'monthly':
        this.workSummaryService.getMonthlyWorkSummaryByMachine(this.selectedMachine).subscribe(
          data => {
            this.workSummary = data || {};
            this.updateChart();
          },
          error => console.error('Erreur lors du chargement du résumé du travail!', error)
        );
        break;
      default:
        this.workSummaryService.getDailyWorkSummaryByMachine(this.selectedMachine).subscribe(
          data => {
            this.workSummary = data || {};
            this.updateChart();
          },
          error => console.error('Erreur lors du chargement du résumé du travail!', error)
        );
    }
  }

  onMachineChange(): void {
    this.fetchWorkSummary();
  }
  initilizeMachineNamesAndData(): void {
    this.workSummaryService.getDistinctAllMachineNames().subscribe(
      data => {
        this.machineNames = data || [];
        if(this.machineNames.length>0)
        this.selectedMachine = this.machineNames[0] || ''; // Sélectionner le premier utilisateur par défaut
        this.fetchWorkSummary();
      },
      error => console.error('Erreur lors du chargement des noms de machines!', error)
    );
  }
  updateChart(): void {const workDurations: { x: string, y: number, label: string }[] = [];
    const pauseDurations: { x: string, y: number, label: string }[] = [];
    const inactiveDurations: { x: string, y: number, label: string }[] = [];
    const labels: string[] = [];
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


    if (this.chart) {
      this.chart.destroy(); // Détruire le graphique précédent avant de créer un nouveau
    }
    // Déterminer le texte du titre
    const titleText =
      `Résumé ${this.selectedSummaryType} du travail pour la machine ${this.selectedMachine}`;


    this.chart = new Chart("MyChart2", {
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
    if (!duration || typeof duration !== 'string') {
      return 0;
    }

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

  generateReport(): void {
    const doc = new jsPDF();

    // Capture le graphique et ajoutez-le au PDF
    const chartElement = document.getElementById('MyChart2') as HTMLElement;
    if (chartElement) {
      html2canvas(chartElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        doc.save('rapport.pdf');
      });
    }
  }
}
