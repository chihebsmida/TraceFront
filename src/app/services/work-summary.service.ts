import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkSummaryService {

  private apiUrl = 'http://localhost:8080/weekly-work-summary';
 #http= inject(HttpClient);


  getWeeklyWorkSummary(): Observable<any> {
    return this.#http.get<any>(this.apiUrl);
  }
}
