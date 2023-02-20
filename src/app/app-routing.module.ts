import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimetableSelectComponent } from './timetable-select/timetable-select.component';
import { TimetableViewComponent } from './timetable-view/timetable-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'select/:type', component: TimetableSelectComponent},
  {path: 'class/:name', component: TimetableViewComponent},
  {path: 'teacher/:name', component: TimetableViewComponent},
  {path: 'classroom/:name', component: TimetableViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
