import {inject, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {routes} from "assets/routes";
import {AuthGuard} from "app/core/guards/auth.guard";
import {combineLatest} from "rxjs";

const routesConfig: Routes = [
  {
    path: routes.login,
    loadChildren: () => import(`app/features/login/login.module`).then(
      m => m.LoginModule
    ),
  },
  {
    path: routes.visits,
    loadChildren: () => import(`app/features/manage-visits/manage-visits.module`).then(
      m => m.ManageVisitsModule
    ),
    canActivate: [() => combineLatest([inject(AuthGuard).isTherapist(), inject(AuthGuard).isStaff()],
      (isTherapist, isStaff) => (isTherapist || isStaff)
    )]
  },
  {
    path: routes.schedule,
    loadChildren: () => import(`app/features/work-schedule/work-schedule.module`).then(
      m => m.WorkScheduleModule
    ),
    canActivate: [() => inject(AuthGuard).isTherapist()]
  },
  {
    path: routes.sheets,
    loadChildren: () => import(`app/features/manage-sheets/manage-sheets.module`).then(
      m => m.ManageSheetsModule
    ),
    canActivate: [() => inject(AuthGuard).isStaff()]
  },
  {
    path: routes.absences,
    loadChildren: () => import(`app/features/manage-absences/manage-absences.module`).then(
      m => m.ManageAbsencesModule
    ),
    canActivate: [() => inject(AuthGuard).isStaff()]
  },
  {
    path: routes.adminPanel,
    loadChildren: () => import(`app/features/admin-panel/admin-panel.module`).then(
      m => m.AdminPanelModule
    ),
    canActivate: [() => combineLatest([inject(AuthGuard).isStaff(), inject(AuthGuard).isAdmin()],
      (isStaff, isAdmin) => (isStaff || isAdmin)
      )]
  },
  {
    path: routes.reports,
    loadChildren: () => import(`app/features/manage-reports/manage-reports.module`).then(
      m => m.ManageReportsModule
    ),
    canActivate: [() => inject(AuthGuard).isStaff()]
  },
  { path: '', redirectTo: routes.login, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routesConfig)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
