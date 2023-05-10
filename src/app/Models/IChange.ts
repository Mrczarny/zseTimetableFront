import { Lesson } from "./Lesson";

export interface IChange {
  lesson: Lesson | null,
  newClassroomName: string,
  newTeacherName: string,
  className: string,
  replacementDate: Date,
  note: string
}
