import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClientService } from '../http-client.service';
import { ISelectable } from '../Models/ISelectable';
import { Teacher } from '../Models/Teacher';
import { Class } from '../Models/Class';
import { Classroom } from '../Models/Classroom';

@Component({
  selector: 'app-timetable-select',
  templateUrl: './timetable-select.component.html',
  styleUrls: ['../dashboard/dashboard.component.css', './timetable-select.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class TimetableSelectComponent implements OnInit {

  typeName: String = '';
  Names: string[] | null = null;
  selectedName: string =''

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpClientService
  ) { }


  ngOnInit(): void {
    this.route.params.subscribe(params => {this.typeName = params['type']})
    this.httpService.getAllNames(this.getType()).subscribe(names => this.Names = names)
  }

  //TODO - this is ugly
  getType(): ISelectable { switch (this.typeName.toLowerCase()) {
    case 'teacher':
      return {TypeName: 'teacher'} as Teacher;
    case 'classroom':
      return {TypeName: 'classroom'} as Classroom;
    default:
      return {TypeName: 'class'} as Class;
  }}


}
