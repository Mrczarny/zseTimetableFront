import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectable } from '../Models/ISelectable';
import { HttpClientService } from '../http-client.service';
import { MatTableDataSource } from '@angular/material/table';
import { TimetableDay } from '../Models/TimetableDay';

@Component({
  selector: 'app-timetable-view',
  templateUrl: './timetable-view.component.html',
  styleUrls: ['./timetable-view.component.css']
})
export class TimetableViewComponent implements OnInit {

  constructor(private route: ActivatedRoute, private httpService: HttpClientService) {

   }

   SelectableName: string = '';
   Selectable: ISelectable | null = null;
   DataSource = new MatTableDataSource<TimetableDay>(this.Selectable?.Timetable.Days)

  ngOnInit(): void {
    this.route.params.subscribe(params => {this.SelectableName = params['name']})
    this.httpService.getTimetable(new ).subscribe(selecatable => this.Selectable = selecatable)
  }

}
