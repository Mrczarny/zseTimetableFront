import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import httpConfig from '../assets/httpConfig.json';
import { ISelectable } from './Models/ISelectable';
import { IChange } from './Models/IChange';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private http: HttpClient) {
   // http.options(httpConfig.baseAddress, { responseType: 'json'})
  }

  getAllNames(type: string) {
    return this.http.get<string[]>(`${httpConfig.baseAddress}/${httpConfig.timetablesUrl}/${type}/allnames`)
  }

  getTimetable(type: string, name: string) {
    return this.http.get<ISelectable>(`${httpConfig.baseAddress}/${httpConfig.timetablesUrl}/${type}/${name}`);
  }

  getTodaysChanges(){
    return this.http.get<IChange[]>(`${httpConfig.baseAddress}/${httpConfig.changesUrl}/today`)
  }
  getThisWeekChanges(){
    return this.http.get<IChange[]>(`${httpConfig.baseAddress}/${httpConfig.changesUrl}/week`)
  }

  // getChange(type: IChangable) {
  //   throw Error;
  //   return this.http.get<IChange>(`${httpConfig.changesUrl}/`)
  // }
}

