import {Role} from "shared/enums/roles.enum";
import {Status} from "shared/enums/visit-details-status.enum";
import {ReportOption} from "shared/enums/report-option.enum";

export const enumTexts = {
  roles: [
    {key: Role.THERAPIST, value: 'Terapeuta'},
    {key: Role.STAFF, value: 'Kierownik'},
    {key: Role.ADMIN, value: 'Administrator'},
  ],
  status: [
    {key: Status.PRESENT, value: 'Obecny'},
    {key: Status.ABSENT, value: 'Nieobecny'},
    {key: Status.CANCELLED, value: 'Wizyta odwołana'},
    {key: Status.ABSENT_EMPLOYEE, value: 'Urlop'},
  ],
  visitReportColumn: [
    {key: ReportOption.VISIT_STATUS, value: 'Status wizyty'},
    {key: ReportOption.EMPLOYEE, value: 'Pracownik'},
    {key: ReportOption.ORGANIZATION, value: 'Organizacja'},
  ]
}
