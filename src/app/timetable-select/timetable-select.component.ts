import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-timetable-select',
  templateUrl: './timetable-select.component.html',
  styleUrls: ['./timetable-select.component.css']
})
export class TimetableSelectComponent implements OnInit {

  typeName: String = '';

  constructor(
    private route: ActivatedRoute,
  ) { }

  onSelect() {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {this.typeName = params['type']})
  }

}
