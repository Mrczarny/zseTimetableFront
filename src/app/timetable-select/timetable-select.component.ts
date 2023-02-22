import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Car {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-timetable-select',
  templateUrl: './timetable-select.component.html',
  styleUrls: ['../dashboard/dashboard.component.css', './timetable-select.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TimetableSelectComponent implements OnInit {

  typeName: String = '';
  selectedCar!: string;
  cars: Car[] = [
    {value: 'volvo', viewValue: 'Volvo'},
    {value: 'saab', viewValue: 'Saab'},
    {value: 'mercedes', viewValue: 'Mercedes'},
  ];

  constructor(
    private route: ActivatedRoute,
  ) { }

  onSelect() {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {this.typeName = params['type']})
  }

}
