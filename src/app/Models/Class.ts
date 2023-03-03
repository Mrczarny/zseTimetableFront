import { Timetable } from './Timetable';
import { ISelectable } from './ISelectable';
export type Class = ISelectable & null & {
  Name: string
  Timetable: Timetable
}
