import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {Sheet} from "shared/models/sheet.model";
import {Subscription} from "rxjs";
import {MatSelectionList} from "@angular/material/list";
import * as moment from "moment";
import {SharedDataService} from "app/core/services/shared-data.service";
import {generalTexts} from "assets/app-texts-pl/generalTexts";

@Component({
  selector: 'app-saved-sheets',
  templateUrl: './saved-sheets.component.html',
  styleUrls: ['./saved-sheets.component.scss']
})
export class SavedSheetsComponent {
  @ViewChild('selectionList', {static: false}) private selectionList!: MatSelectionList;
  @Output() bySelectionChange: EventEmitter<Sheet> = new EventEmitter();
  sheets: Sheet[] = [];
  sheetSub!: Subscription;
  selectedOptions!: Sheet[];
  generalTexts = generalTexts;

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    this.sharedDataService.refreshSheets();
    this.sheetSub = this.sharedDataService.sheets$
      .subscribe(sheets => {
        this.sheets = sheets;
        let currentSheet: Sheet | undefined = sheets.find(sheet => this.checkIfCurrent(sheet));
        if (currentSheet) {
          this.selectedOptions = [currentSheet];
          this.updateSelectedSheet();
        }
      })
  }

  ngOnDestroy() {
    this.sheetSub.unsubscribe();
  }

  updateSelectedSheet() {
    this.bySelectionChange.emit(this.selectedOptions[0]);
  }

  checkIfCurrent(sheet: Sheet) {
    let now = moment();
    return moment(sheet.startDate).isSameOrBefore(now) && moment(sheet.endDate).isAfter(now);
  }
}
