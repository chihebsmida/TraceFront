import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {WorkSummaryChartComponent} from "./components/work-summary-chart/work-summary-chart.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WorkSummaryChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front';
}
