import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkSummaryService {

  private apiUrl = 'http://localhost:8080';
 #http= inject(HttpClient);
  getWeeklyWorkSummary(): Observable<any> {
    return this.#http.get<any>(this.apiUrl+'/weekly-work-summary-all-employee');
  }
  getMonthlyWorkSummary(): Observable<any> {
    return this.#http.get<any>(this.apiUrl+'/monthly-work-summary-all-employee');
  }
  getDailyWorkSummary(): Observable<any> {
    return this.#http.get<any>(this.apiUrl+'/daily-work-summary-all-employee');
  }

  getDailyWorkSummaryByMachineAndEmployee(selectedUser: string, selectedMachine: string) {
    return this.#http.get<any>(this.apiUrl+'/daily-work-summary-by-employee-and-machine?employerName='+selectedUser+'&machineName='+selectedMachine);
  }
  getWeeklyWorkSummaryByMachineAndEmployee(selectedUser: string, selectedMachine: string) {
    return this.#http.get<any>(this.apiUrl+'/weekly-work-summary-by-employee-and-machine?employerName='+selectedUser+'&machineName='+selectedMachine);
  }
  getMonthlyWorkSummaryByMachineAndEmployee(selectedUser: string, selectedMachine: string) {
    return this.#http.get<any>(this.apiUrl+'/monthly-work-summary-by-employee-and-machine?employerName='+selectedUser+'&machineName='+selectedMachine);
  }
  getDIstinctMachineNames( employerName: string): Observable<string[]> {
    return this.#http.get<any>(this.apiUrl+'/findDistinctMachineName?employerName='+employerName);
  }
  getDistinctAllMachineNames(): Observable<string[]> {
    return this.#http.get<any>(this.apiUrl+'/findDistinctAllMachineName');
  }
  getDailyWorkSummaryByMachine(machineName: string): Observable<any> {
    return this.#http.get<any>(this.apiUrl+'/daily-work-summary-by-machine?machineName='+machineName);
  }
  getWeeklyWorkSummaryByMachine(machineName: string): Observable<any> {
    return this.#http.get<any>(this.apiUrl+'/weekly-work-summary-by-machine?machineName='+machineName);
  }
  getMonthlyWorkSummaryByMachine(machineName: string): Observable<any> {
    return this.#http.get<any>(this.apiUrl+'/monthly-work-summary-by-machine?machineName='+machineName);
  }

}
