import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectable } from '../Models/ISelectable';
import { HttpClientService } from '../http-client.service';
import { MatTableDataSource } from '@angular/material/table';
import { TimetableDay } from '../Models/TimetableDay';
import { Lesson } from '../Models/Lesson';
import { Timetable } from '../Models/Timetable';

interface LessonsRow {
  mondayLesson: Lesson
  tuesdayLesson: Lesson,
  wednesdayLesson: Lesson,
  thursdayLesson: Lesson,
  fridayLesson: Lesson
}

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
   TypeName: string = ''
   DataSource = new MatTableDataSource<LessonsRow>([])

  ngOnInit(): void {
    this.route.params.subscribe(params => {this.SelectableName = params['name']})
    this.route.url.subscribe(u => {this.TypeName = u.reverse()[1].path}) //TODO - no idea how urlsegment works

    this.httpService.getTimetable(this.TypeName, this.SelectableName).subscribe(selecatable =>
      { this.Selectable = selecatable;
        this.DataSource = new MatTableDataSource<LessonsRow>(this.ConvertToLessonRows(this.Selectable.Timetable))
      })
  }

  ConvertToLessonRows(timetable: Timetable): LessonsRow[] {
    throw new Error("Not implemented!");
  }

}
