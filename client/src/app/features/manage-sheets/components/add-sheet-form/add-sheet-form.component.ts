import {Component} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {alertTexts} from "assets/app-texts-pl/alertTexts";
import {take} from "rxjs";
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as moment from "moment";
import {MatDialog} from "@angular/material/dialog";
import {dialogTexts} from "assets/app-texts-pl/dialogTexts";
import {DialogComponent} from "shared/components/dialog/dialog.component";
import {SheetService} from "app/features/manage-sheets/services/sheet.service";
import {SharedDataService} from "app/core/services/shared-data.service";
import {FormComponent} from "shared/abstract-components/form.component";

@Component({
  selector: 'app-add-sheet-form',
  templateUrl: './add-sheet-form.component.html',
  styleUrls: ['./add-sheet-form.component.scss']
})
export class AddSheetFormComponent extends FormComponent {
  generalTexts = generalTexts;
  fileName: string | null = null;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: ToastrService,
    private sheetService: SheetService,
    private sharedDataService: SharedDataService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      excelFile: [null, Validators.required],
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
    }, {updateOn: 'submit'});
  }

  handleFileInput(files: FileList) {
    const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (files.length > 0) {
      const file = files[0];
      if (file.type === contentType) {
        this.fileName = file.name;
        this.form.get('excelFile')!.setValue(file);
      } else {
        this.alertService.error(alertTexts.notExcelFileError);
      }
    }
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

      const sheetInfo = {
        daysTotal: '1',
        rowsPerDay: '21',
        totalEmployees: '3',
        columnsPerEmployee: '4',
        startDate: this.f['startDate'].value.utc(),
        endDate: this.f['endDate'].value.utc(),
      };

      const sheetInfoBlob = new Blob([JSON.stringify(sheetInfo)], {
        type: 'application/json',
      });

      const formData = new FormData();
      formData.append('file', this.form.get('excelFile')!.value);
      formData.append('sheetInfo', sheetInfoBlob);

      this.sheetService.postExcelFile(formData).pipe(take(1)).subscribe({
        next: () => {
          this.alertService.success(alertTexts.uploadSuccess);
          this.sharedDataService.refreshSheets();
          this.sharedDataService.refreshEmployees();
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
      data: {title: dialogTexts.addSheetTitle, message: dialogTexts.addSheetMessage},
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
}
