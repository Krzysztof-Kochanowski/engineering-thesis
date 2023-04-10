import {Component, Input} from '@angular/core';
import {Status} from "shared/enums/visit-details-status.enum";
import {generalTexts} from "assets/app-texts-pl/generalTexts";

@Component({
  selector: 'app-visit-details-status-icon',
  templateUrl: './visit-details-status-icon.component.html',
  styleUrls: ['./visit-details-status-icon.component.scss']
})
export class VisitDetailsStatusIconComponent {
  @Input() visitStatus!: string;
  tooltipText!: string;
  status = Status;

  ngOnInit() {
    switch (this.visitStatus) {
      case this.status.PRESENT:
        this.tooltipText = generalTexts.present;
        break;
      case this.status.ABSENT:
        this.tooltipText = generalTexts.absent;
        break;
      case this.status.CANCELLED:
        this.tooltipText = generalTexts.cancelled;
        break;
      case this.status.ABSENT_EMPLOYEE:
        this.tooltipText = generalTexts.absent_employee;
        break;
    }
  }
}
