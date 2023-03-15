import { Timetable } from './Timetable';
import { ISelectable } from './ISelectable';
export type Class = ISelectable & null & {
  name: string
  timetable: Timetable
}
