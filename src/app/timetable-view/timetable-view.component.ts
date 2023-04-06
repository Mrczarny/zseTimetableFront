import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectable } from '../Models/ISelectable';
import { HttpClientService } from '../http-client.service';
import { MatTableDataSource } from '@angular/material/table';
import { TimetableDay } from '../Models/TimetableDay';
import { Lesson } from '../Models/Lesson';
import { Timetable } from '../Models/Timetable';

interface LessonsRow {
  // mondayLesson: Lesson
  // tuesdayLesson: Lesson,
  // wednesdayLesson: Lesson,
  // thursdayLesson: Lesson,
  // fridayLesson: Lesson
   lessons: Array<Lesson>
}

@Component({
  selector: 'app-timetable-view',
  templateUrl: './timetable-view.component.html',
  styleUrls: ['./timetable-view.component.css']
})
export class TimetableViewComponent implements OnInit {

  constructor(private route: ActivatedRoute, private httpService: HttpClientService) {

   }

   displayedColumns: string[] = ["pon","wt"]
   SelectableName: string = '';
   Selectable: ISelectable | null = null;
   TypeName: string = ''
   DataSource: MatTableDataSource<LessonsRow> = new MatTableDataSource<LessonsRow>(new Array<LessonsRow>);
   Result: LessonsRow[] = [];

  ngOnInit(): void {
    this.route.params.subscribe(params => {this.SelectableName = params['name']})
    this.route.url.subscribe(u => {this.TypeName = u.reverse()[1].path}) //TODO - no idea how urlsegment works

    this.httpService.getTimetable(this.TypeName, this.SelectableName).subscribe(selecatable =>
      { this.Selectable = selecatable;
        this.DataSource = new MatTableDataSource<LessonsRow>(this.ConvertToLessonRows(selecatable.timetable))
        this.Result =  this.ConvertToLessonRows(selecatable.timetable)
      })

  }

  ConvertToLessonRows(timetable: Timetable): LessonsRow[] {
    console.log(timetable);
    var max = 0
    timetable.days.forEach((day) => {
      console.log(day.lessons.length);
      day.lessons.length > max ? max = day.lessons.length : max
    })
    console.log(max);
    var result =  new Array<LessonsRow>(max);
    result.fill({lessons: []},0,max)
    timetable.days.forEach((day) => {
      day.lessons.forEach((lesson) => {
        console.log(result);
        result[day.lessons.indexOf(lesson)].lessons[timetable.days.indexOf(day)] = lesson
      })
    })
    return result;
  }

}
