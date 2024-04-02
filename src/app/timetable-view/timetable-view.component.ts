import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectable } from '../Models/ISelectable';
import { HttpClientService } from '../http-client.service';
import { MatTableDataSource } from '@angular/material/table';
import { TimetableDay } from '../Models/TimetableDay';
import { Lesson } from '../Models/Lesson';
import { Timetable } from '../Models/Timetable';
import { IChange } from '../Models/IChange';
import { WeekDay } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { MatCheckboxChange } from '@angular/material/checkbox';

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

  constructor(private route: ActivatedRoute, private httpService: HttpClientService, private cookieService: CookieService) {

   }

   //displayedColumns: string[] = ['position2','position3','position', 'name', 'weight', 'symbol'];
   //dataSource = ELEMENT_DATA;
   displayedColumns: string[] = ["nr", "poniedziałek", "wtorek", "środa", "czwartek", "piątek"]
   daysColumns: string[] = ["poniedziałek", "wtorek", "środa", "czwartek", "piątek"]
   SelectedRp: IChange | undefined;
   ShowChanges: boolean = true;
   SelectableName: string = '';
   Groups: {name: string, checked: boolean}[] = []
   Classes: {name: string, checked: boolean}[] = []
   Selectable: ISelectable | null = null;
   TypeName: string = ''
   Changes: IChange[] = [];
   DataSource: MatTableDataSource<LessonsRow>  = new MatTableDataSource<LessonsRow>();
   Result: LessonsRow[] = [];


  ngOnInit(): void {
    this.route.params.subscribe(params => {this.SelectableName = params['name']})
    this.route.url.subscribe(u => {this.TypeName = u.reverse()[1].path}) //TODO - no idea how urlsegment works


    this.httpService.getTimetable(this.TypeName, this.SelectableName).subscribe(selecatable =>
      {
        this.Selectable = selecatable;
        this.SetRightChanges().then(() => {
          this.Groups = this.GetGroups(selecatable.timetable)
          if (this.TypeName != 'class') {
            this.Classes = this.GetClasses(selecatable.timetable)
          }
          this.DataSource = new MatTableDataSource(this.ConvertToLessonRows(selecatable.timetable))
          this.Result =  this.ConvertToLessonRows(selecatable.timetable)
        });
      })

  }



  ConvertToLessonRows(timetable: Timetable): LessonsRow[] {
    let result: LessonsRow[] = []
    //find the largest lessonNumber in the timetable
    let maxLessonNumber = 0
    for(let day of timetable.days) {
      for(let lesson of day.lessons) {
        if(lesson?.lessonNumber > maxLessonNumber) {
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
        var lesson: Lesson | undefined = undefined
        if (this.TypeName == 'class') {
          lesson = timetable.days[j].lessons.find(l => l?.lessonNumber == i && this.Groups.some(x => x.name == l.group && x.checked))
        }
        else {
          lesson = timetable.days[j].lessons.find(l =>  l?.lessonNumber == i && this.Classes.some(x => x.name == l?.className && x.checked))
          if (lesson == undefined) {
            lesson = timetable.days[j].lessons.find(l => l?.lessonNumber == i && timetable.days[j].lessons.filter(x => x?.lessonNumber == l?.lessonNumber).length <= 1)
          }
        }

        if ( this.Changes.filter(x => new Date(x.replacementDate).getDay() - 1 == j).some(x =>
          x.lesson?.lessonNumber === i &&
          x.lesson.group == lesson?.group &&
          x.lesson.className == lesson?.className &&
          x.lesson.classroomName == lesson?.classroomName &&
          x.lesson.teacherName == lesson?.teacherName )) {
          lesson!.isReplacement = true
        }
        else {
          if (lesson != undefined) {
            lesson!.isReplacement = false
          }
        }


        lessons.push(lesson  ??  {name: '', lessonNumber: i, group: '', className: '', classroomName: '', teacherName: '', isReplacement: false});
      }
      result.push({lessons: lessons})
    }

    return result
  }

  UpdateClasses(e: MatCheckboxChange) {
    this.Classes.forEach(x => {if(x.name != e.source.name) x.checked = false})
    this.cookieService.putObject(`classes_${window.location.pathname.replace(/\//g,'_')}`, this.Classes.filter(x => x.checked).map(x => x.name), { expires: new Date(2025, 12, 30)})
    this.DataSource.connect().next(this.ConvertToLessonRows(this.Selectable!.timetable))
  }

  UpdateGroups(e: MatCheckboxChange) {
    console.log( window.location.pathname.replace(/\//g,'_'));
    this.Selectable!.timetable.days.forEach(day => {
      day.lessons.forEach(lesson => {
        if (lesson.group == e.source.name) {
         day.lessons.filter(x => x?.lessonNumber == lesson.lessonNumber && x.group != e.source.name).forEach(x => this.Groups.find(z => z.name == x.group)!.checked = false);
        }
      })
    })
    this.cookieService.putObject(`groups_${window.location.pathname.replace(/\//g,'_')}`, this.Groups.filter(x => x.checked).map(x => x.name), { expires: new Date(2025, 12, 30)})
    this.DataSource.connect().next(this.ConvertToLessonRows(this.Selectable!.timetable))
  }


  SetSelectedReplacement(ls: Lesson, day: number) {
    this.SelectedRp = this.Changes.find(x => x.lesson?.lessonNumber == ls.lessonNumber &&
       x.lesson.group == ls.group &&
       x.lesson.className == ls.className &&
       x.lesson.classroomName == ls.classroomName &&
       x.lesson.teacherName == ls.teacherName && new Date(x.replacementDate).getDay() - 1 == day)
  }

  async SetRightChanges(){
      const scr$ = this.httpService.getThisWeekChanges()
      this.Changes = await lastValueFrom(scr$)
    }

  GetClasses(timetable: Timetable): {name: string, checked: boolean}[] {
    let result: {name: string, checked: boolean}[] = []
    for(let day of timetable.days) {
      for(let lesson of day.lessons) {
        var ls = day.lessons.splice(day.lessons.indexOf(lesson), 1)
        if(day.lessons.some(x => x.lessonNumber == lesson.lessonNumber)) {
          if (!result.some(x => x.name == lesson.className)) {
            result.push({name: lesson.className, checked: false})
          }

        }
        day.lessons.push(ls[0])
      }
    }
    // if (result.find(x => x.name == '') != undefined) {
    //   result.find(x => x.name == '')!.checked = true
    // }
    if (this.cookieService.hasKey(`classes_${window.location.pathname.replace(/\//g,'_')}`)) {
      let cookieClasses = this.cookieService.getObject(`classes_${window.location.pathname.replace(/\//g,'_')}`) as string[]
      result.forEach(x => {if(cookieClasses.includes(x.name)) x.checked = true})
    }

    return result
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
    if (result.find(x => x.name == '') != undefined) {
      result.find(x => x.name == '')!.checked = true
    }
    if (this.cookieService.hasKey(`groups_${window.location.pathname.replace(/\//g,'_')}`)) {
      let cookieGroups = this.cookieService.getObject(`groups_${window.location.pathname.replace(/\//g,'_')}`) as string[]
      result.forEach(x => {if(cookieGroups.includes(x.name)) x.checked = true})
    }

    return result
  }

  ToggleChanges() {
    this.DataSource.connect().next(this.ConvertToLessonRows(this.Selectable!.timetable))
  }


}
