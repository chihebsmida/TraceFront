import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {WorkSummaryChartComponent} from "./components/work-summary-chart/work-summary-chart.component";
import {WorkSummaryMachineChartComponent} from "./components/work-summary-machine-chart/work-summary-machine-chart.component";
import {HttpClientModule} from "@angular/common/http";
import {KeycloakAngularModule} from "keycloak-angular";
import {KeycloakOperationService} from "./services/keycloak.service";
import {MatToolbar} from "@angular/material/toolbar";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatFabButton} from "@angular/material/button";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WorkSummaryChartComponent, WorkSummaryMachineChartComponent, KeycloakAngularModule, MatToolbar, MatMenu, MatDivider, MatMenuTrigger, MatMenuItem, MatButton, NgIf, MatFabButton, MatIcon],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'front';
  public userRoles: string[] = [];
  public userName: string = '';
  public userEmail: string = '';
  keycloakService = inject(KeycloakOperationService);
  ngOnInit(): void {

    this.keycloakService.getUserProfile().then((data: any) => {
      this.userName=data.firstName+' '+data.lastName;
      this.userEmail=data.email;
      this.userRoles=this.keycloakService.getUserRole();
      console.log(this.userName);
      console.log(this.userEmail);
      console.log(this.userRoles);
    });
  }

  logout() {
    console.log('logout');
    this.keycloakService.logout();
  }
}
