import { WeekDay } from "@angular/common"
import { Lesson } from './Lesson';

export type TimetableDay = {
  Day: WeekDay;
  lessons: Lesson[];
}
