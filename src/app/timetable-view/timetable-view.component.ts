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

   //displayedColumns: string[] = ['position2','position3','position', 'name', 'weight', 'symbol'];
   //dataSource = ELEMENT_DATA;
   displayedColumns: string[] = ["nr", "pon","wt", "sr", "czw", "pt"]
   SelectableName: string = '';
   Groups: {name: string, checked: boolean}[] = []
   Selectable: ISelectable | null = null;
   TypeName: string = ''
   DataSource: MatTableDataSource<LessonsRow>  = new MatTableDataSource<LessonsRow>();
   Result: LessonsRow[] = [];


  ngOnInit(): void {
    this.route.params.subscribe(params => {this.SelectableName = params['name']})
    this.route.url.subscribe(u => {this.TypeName = u.reverse()[1].path}) //TODO - no idea how urlsegment works

    this.httpService.getTimetable(this.TypeName, this.SelectableName).subscribe(selecatable =>
      { this.Selectable = selecatable;
        this.Groups = this.GetGroups(selecatable.timetable)
        this.DataSource = new MatTableDataSource(this.ConvertToLessonRows(selecatable.timetable))
        this.Result =  this.ConvertToLessonRows(selecatable.timetable)

      })

  }

  ConvertToLessonRows(timetable: Timetable): LessonsRow[] {
    let result: LessonsRow[] = []
    //find the largest lessonNumber in the timetable
    let maxLessonNumber = 0
    for(let day of timetable.days) {
      for(let lesson of day.lessons) {
        if(lesson.lessonNumber > maxLessonNumber) {
          maxLessonNumber = lesson.lessonNumber
        }
      }
    }

    //console.log(maxLessonNumber)
    for(let i = 0; i <= maxLessonNumber; i++) {
      let lessons: Lesson[] = []
      for(let j = 0; j < 5; j++) {
        //console.log(timetable.days[j].lessons)
        //timetable.days[j].lessons.forEach(l => {console.log(l.Group); console.log(this.SelectedGroups.includes(l.Group))})
        lessons.push(timetable.days[j].lessons.find(l => l.lessonNumber == i && this.Groups.some(x => x.name == l.group && x.checked))
         ?? {name: '', lessonNumber: i, group: '', className: '', classroomName: '', teacherName: ''})
      }
      result.push({lessons: lessons})
    }

    return result
  }

  UpdateGroups() {
    this.DataSource.connect().next(this.ConvertToLessonRows(this.Selectable!.timetable))
  }

  GetGroups(timetable: Timetable): {name: string, checked: boolean}[] {
    let result: {name: string, checked: boolean}[] = []
    for(let day of timetable.days) {
      for(let lesson of day.lessons) {
        if(!result.some(x => x.name == lesson.group)) {
          result.push({name: lesson.group, checked: false})
        }
      }
    }
    result[0].checked = true
    return result
  }

}
