import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import {FormControl} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClientService } from '../http-client.service';
import { ISelectable } from '../Models/ISelectable';
import { Teacher } from '../Models/Teacher';
import { Class } from '../Models/Class';
import { Classroom } from '../Models/Classroom';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-timetable-select',
  templateUrl: './timetable-select.component.html',
  styleUrls: ['../dashboard/dashboard.component.css', './timetable-select.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class TimetableSelectComponent implements OnInit {

  myControl = new FormControl('');
  typeName: String = '';
  filteredNames: Observable<string[]> | undefined;
  Names: string[] = [];
  selectedName: string =''

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpClientService
  ) {
    this.route.params.subscribe(params => {this.typeName = params['type']})
    this.httpService.getAllNames(this.getType()).subscribe(names => {
      this.Names = names;
      this.filteredNames = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),);
    })

  }


  ngOnInit(): void {

  }

  //TODO - this is ugly
  getType(): string { switch (this.typeName.toLowerCase()) {
    case 'teacher':
      return 'teacher'
    case 'classroom':
      return 'classroom'
    default:
      return 'class'
  }}

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.Names.filter(option => option.toLowerCase().includes(filterValue));
  }

}
