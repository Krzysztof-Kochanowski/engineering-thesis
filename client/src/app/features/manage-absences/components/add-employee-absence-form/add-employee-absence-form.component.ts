import {Component, Input} from '@angular/core';
import {generalTexts} from "assets/app-texts-pl/generalTexts";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Employee} from "shared/models/employee.model";
import {ToastrService} from "ngx-toastr";
import {BehaviorSubject, Subscription} from "rxjs";
import {MatSelectChange} from "@angular/material/select";
import * as moment from "moment";
import {dialogTexts} from "assets/app-texts-pl/dialogTexts";
import {EmployeeAbsence} from "shared/models/employee-absence.model";
import {DialogComponent} from "shared/components/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {Time} from "shared/components/time-input/time-input.component";
import {SharedDataService} from "app/core/services/shared-data.service";
import {EmployeeAbsenceService} from "app/features/manage-absences/services/employee-absence.service";
import {employeeFilter, filterBySearchValue} from "shared/utilities/sort.helper";
import {FormComponent} from "shared/abstract-components/form.component"
import {alertTexts} from "assets/app-texts-pl/alertTexts";

@Component({
  selector: 'app-add-employee-absence-form',
  templateUrl: './add-employee-absence-form.component.html',
  styleUrls: ['./add-employee-absence-form.component.scss']
})
export class AddEmployeeAbsenceFormComponent extends FormComponent {
  @Input() date: moment.Moment | null = null;
  @Input() time: Time | null = null;
  generalTexts = generalTexts;
  loading = false;
  employees: Employee[] = [];
  employeesSub!: Subscription;
  employeeFilterCtrl = new FormControl<string>('') as FormControl<string>;
  public filteredEmployees = new BehaviorSubject<Employee[]>([]);

  constructor(
    private formBuilder: FormBuilder,
    private alertService: ToastrService,
    private sharedDataService: SharedDataService,
    private employeeAbsenceService: EmployeeAbsenceService,
    private dialog: MatDialog
  ) {
    super();
  }

  override ngOnInit() {
    this.sharedDataService.refreshEmployees();

    this.form = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      employee: [null, Validators.required],
    }, {updateOn: 'submit'});

    this.employeesSub = this.sharedDataService.employees$
      .subscribe(employees => {
        this.employees = employees;
        this.filterEmployees();
      })

    this.employeeFilterCtrl.valueChanges.subscribe(() => this.filterEmployees());
  }

  ngOnDestroy() {
    this.employeesSub.unsubscribe();
  }

  filterEmployees() {
    this.filteredEmployees.next(filterBySearchValue(this.employees, this.employeeFilterCtrl.value, employeeFilter));
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

      let employeeAbsence: EmployeeAbsence = {
        employee: this.f['employee'].value,
        startDate: this.f['startDate'].value.utc(),
        endDate: this.f['endDate'].value.utc(),
      };

      this.employeeAbsenceService.postEmployeeAbsence(employeeAbsence).subscribe({
        next: () => {
          this.alertService.success(alertTexts.absenceAddedSuccess);
          this.bySubmit.emit();
        },
        error: () => this.alertService.error(alertTexts.absenceAddedError)
      }).add(() => this.loading = false)
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: dialogTexts.addAbsenceTitle, message: dialogTexts.addEmployeeAbsenceMessage},
    });
    return dialogRef.afterClosed();
  }

  updateSelectedEmployee(event: MatSelectChange) {
    this.f['employee'].setValue(event.value);
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
