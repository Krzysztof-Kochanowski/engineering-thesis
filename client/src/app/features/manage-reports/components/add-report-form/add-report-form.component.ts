import {Component} from '@angular/core';
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as moment from "moment";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {alertTexts} from "assets/app-texts-pl/alertTexts";
import {take} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {DialogComponent} from "shared/components/dialog/dialog.component";
import {dialogTexts} from "assets/app-texts-pl/dialogTexts";
import {FormComponent} from "shared/abstract-components/form.component";
import {enumTexts} from "assets/app-texts-pl/enumTexts";
import {MatSelectChange} from "@angular/material/select";
import {valuesToString} from "shared/utilities/key-value.helper";
import {ReportOptionLang} from "shared/enums/report-option.enum";
import {ReportService} from "app/features/manage-reports/services/report.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {KeyValue} from "@angular/common";

@Component({
  selector: 'app-add-report-form',
  templateUrl: './add-report-form.component.html',
  styleUrls: ['./add-report-form.component.scss']
})
export class AddReportFormComponent extends FormComponent {
  generalTexts = generalTexts;
  loading = false;
  enumTexts = enumTexts;
  reportOptionPl: ReportOptionLang = {
    COUNT: 'Liczba wizyt',
    VISIT_STATUS: 'Status wizyty',
    EMPLOYEE: 'Pracownik',
    ORGANIZATION: 'Organizacja',
  };
  reportOptionPlKeyValue = this.getKeyValue(this.reportOptionPl);
  displayedColumns: string[] = Object.values(this.reportOptionPl);
  columnsToDisplay: string[] = [];

  getKeyValue(o: ReportOptionLang): KeyValue<string, string>[] {
    let result: KeyValue<string, string>[] = [];
    for (const key in Object.keys(o)) {
      let k: string = Object.keys(o)[key];
      let v: string = o[k as keyof ReportOptionLang]
      result = result.concat({
        key: k,
        value: v
      })
    }
    return result;
  }

  constructor(
    private formBuilder: FormBuilder,
    private alertService: ToastrService,
    private reportService: ReportService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      reportOptions: [[this.reportOptionPlKeyValue[0]], Validators.required],
      startDate: new FormControl(null),
      endDate: new FormControl(null),
    }, {updateOn: 'submit'});

    this.columnsToDisplay = this.f['reportOptions'].value.map((option: { key: string, value: string }) => {
      return option.value
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.openDialog().subscribe((result: boolean) => {
      if (!result) {
        this.loading = false;
        return;
      }

      let reportOptions: string[] = this.f['reportOptions'].value.map((option: { key: string, value: string }) => {
        return option.key
      });


      let reportHeaders: string[] = this.f['reportOptions'].value.map((option: { key: string, value: string }) => {
        return option.value
      });



      const reportDto = {
        reportOptions: reportOptions,
        reportHeaders: reportHeaders,
        startDate: this.f['startDate'].value ? this.f['startDate'].value.utc(): null,
        endDate: this.f['endDate'].value ? this.f['endDate'].value.utc(): null,
      };

      this.reportService.generateReport(reportDto).pipe(take(1)).subscribe({
        next: () => {
          this.alertService.success(alertTexts.reportGenerationSuccess);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400) {
            this.alertService.error(err.error || alertTexts.unkownError);
          } else {
            this.alertService.error(alertTexts.unkownError);
          }
        }
      }).add(() => this.loading = false)
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: dialogTexts.addReportTitle, message: dialogTexts.addReportMessage},
    });
    return dialogRef.afterClosed();
  }


  updateSelectedStartDate(event: MatDatepickerInputEvent<moment.Moment>) {
    if (event.value) {
      event.value = event.value.startOf('day');
    }
    this.f['startDate'].setValue(event.value);
  }

  updateSelectedEndDate(event: MatDatepickerInputEvent<moment.Moment>) {
    if (event.value) {
      event.value = event.value.endOf('day');
    }
    this.f['endDate'].setValue(event.value);
  }

  updateSelectedReportOptions(event: MatSelectChange) {
    this.f['reportOptions'].setValue(event.value);
    this.columnsToDisplay = event.value.map((v: any) => {return v.value});
  }

  valuesToString = valuesToString;

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.f['reportOptions'].value, event.previousIndex, event.currentIndex);
    moveItemInArray(this.columnsToDisplay, event.previousIndex, event.currentIndex);
  }
}
