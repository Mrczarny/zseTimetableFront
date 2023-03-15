import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import httpConfig from '../assets/httpConfig.json';
import { ISelectable } from './Models/ISelectable';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private http: HttpClient) {
   // http.options(httpConfig.baseAddress, { responseType: 'json'})
  }

  getAllNames(type: ISelectable) {
    return this.http.get<string[]>(`${httpConfig.baseAddress}/${httpConfig.timetablesUrl}/${type.typeName}/allnames`)
  }

  getTimetable(type: string, name: string) {
    return this.http.get<ISelectable>(`${httpConfig.baseAddress}/${httpConfig.timetablesUrl}/${type}/${name}`);
  }

  // getAllCurrentChanges(){
  //   return this.http.get<IChange[]>(`${httpConfig.changesUrl}/today`)
  // }
  // getChange(type: IChangable) {
  //   throw Error;
  //   return this.http.get<IChange>(`${httpConfig.changesUrl}/`)
  // }
}

