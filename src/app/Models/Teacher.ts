import { Timetable } from './Timetable';
import { ISelectable } from './ISelectable';
export type Teacher = ISelectable & null & {
  name: string
  timetable: Timetable
  shortName: string
}
