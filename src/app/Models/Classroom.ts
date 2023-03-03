import { Timetable } from './Timetable';
import { ISelectable } from './ISelectable';
export type Classroom = ISelectable & null & {
  Name: string
  Timetable: Timetable

}
