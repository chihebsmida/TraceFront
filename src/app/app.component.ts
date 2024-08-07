import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {WorkSummaryChartComponent} from "./components/work-summary-chart/work-summary-chart.component";
import {WorkSummaryMachineChartComponent} from "./components/work-summary-machine-chart/work-summary-machine-chart.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WorkSummaryChartComponent, WorkSummaryMachineChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front';
}
