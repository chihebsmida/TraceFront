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
    return this.#http.get<any>(this.apiUrl+'/weekly-work-summary');
  }
  getMonthlyWorkSummary(): Observable<any> {
    return this.#http.get<any>(this.apiUrl+'/monthly-work-summary');
  }
  getDailyWorkSummary(): Observable<any> {
    return this.#http.get<any>(this.apiUrl+'/daily-work-summary');
  }
}
