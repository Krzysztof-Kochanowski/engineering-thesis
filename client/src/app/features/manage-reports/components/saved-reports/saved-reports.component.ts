import {Component} from '@angular/core';
import {Subscription} from "rxjs";
import {ReportService} from "app/features/manage-reports/services/report.service";
import {generalTexts} from "assets/app-texts-pl/generalTexts";

@Component({
  selector: 'app-saved-reports',
  templateUrl: './saved-reports.component.html',
  styleUrls: ['./saved-reports.component.scss']
})
export class SavedReportsComponent {
  reports: string[] = [];
  reportSub!: Subscription;
  generalTexts = generalTexts;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.refreshReports();
    this.reportSub = this.reportService.reports$
      .subscribe(reports => {
        this.reports = reports;
      })
  }

  ngOnDestroy() {
    this.reportSub.unsubscribe();
  }

  downloadReport(report: string) {
    this.reportService.downloadReport(report);
  }
}
