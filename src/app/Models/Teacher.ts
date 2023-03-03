import { Timetable } from './Timetable';
import { ISelectable } from './ISelectable';
export type Teacher = ISelectable & null & {
  Name: string
  Timetable: Timetable
  ShortName: string
}
