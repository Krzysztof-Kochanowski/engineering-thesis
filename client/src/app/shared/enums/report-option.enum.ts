export enum ReportOption {
  COUNT = 'COUNT',
  VISIT_STATUS = 'VISIT_STATUS',
  EMPLOYEE = 'EMPLOYEE',
  ORGANIZATION = 'ORGANIZATION',
}

export type ReportOptionLang = {
  [key in ReportOption]: string;
};
