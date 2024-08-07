import {BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip} from "chart.js";
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import {inject} from "@angular/core";
import {WorkSummaryService} from "../services/work-summary.service";

Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export class ChartComponent
{
  protected workSummary: any;
  protected selectedUser: string = '';
  protected selectedMachine: string = 'all'; // Définir par défaut sur 'all' pour afficher toutes les machines
  protected users: string[] = [];
  protected machines: string[] = []; // Liste des machines pour l'utilisateur sélectionné
  protected selectedSummaryType: string = 'daily'; // Par défaut à 'daily'
  public chart: any;
  workSummaryService = inject(WorkSummaryService);
  protected updateChart(graphiqueName:string,title:string): void {
    const workDurations: { x: string, y: number, label: string }[] = [];
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

    this.chart = new Chart(graphiqueName, {
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
            text: title,
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

  generateReport(graphiqueName:string): void {
    const doc = new jsPDF();

    // Capture le graphique et ajoutez-le au PDF
    const chartElement = document.getElementById(graphiqueName) as HTMLElement;
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
