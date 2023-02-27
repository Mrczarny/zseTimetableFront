import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as httpConfig from '../assets/httpConfig.json';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private http: HttpClient) {
    http.options(httpConfig.baseAddress, { responseType: 'json'})
  }

  getAllNames(type: ISelectable) {
    return this.http.get<string[]>(`/api/${type.type}/allnames`)
  }

  getTimetable(type: ISelectable){
    return this.http.get<ITimetable>(`${httpConfig.timetablesUrl}/${type.Name}`)
  }

  getAllCurrentChanges(){
    return this.http.get<IChange[]>(`${httpConfig.changesUrl}/today`)
  }
  getChange(type: IChangable) {
    throw Error;
    return this.http.get<IChange>(`${httpConfig.changesUrl}/`)
  }
}

