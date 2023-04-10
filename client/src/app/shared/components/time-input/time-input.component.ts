import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Injector,
  Input,
  OnDestroy,
  Optional,
  Self,
  ViewChild
} from '@angular/core';
import {MAT_FORM_FIELD, MatFormField, MatFormFieldControl} from "@angular/material/form-field";
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroupDirective,
  NgControl,
  Validators
} from "@angular/forms";
import {FocusMonitor} from "@angular/cdk/a11y";
import {Subject} from "rxjs";
import {coerceBooleanProperty} from "@angular/cdk/coercion";

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: TimeInputComponent}],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
})

export class TimeInputComponent implements ControlValueAccessor, MatFormFieldControl<Time>, OnDestroy {
  @ViewChild('hour') hourInput!: HTMLInputElement;
  @ViewChild('minute') minuteInput!: HTMLInputElement;
  static nextId = 0;
  private formGroup = this.injector.get(FormGroupDirective, null);
  parts = this._formBuilder.group({
    hour: ['', [
      Validators.required,
      Validators.minLength(2), Validators.maxLength(2),
      Validators.min(0), Validators.max(24)
    ]],
    minute: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.min(0), Validators.max(59)]],
  });
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  controlType = 'time-input-component';
  id = `time-input-component-${TimeInputComponent.nextId++}`;
  describedBy = '';
  onChange = (_: any) => {};
  onTouched = () => {};

  @Input()
  get placeholder() { return this._placeholder; }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder!: string;

  @Input()
  get required() { return this._required; }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled() { return this._disabled; }
  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): Time | null {
    if (this.parts.valid) {
      const {
        value: {hour, minute},
      } = this.parts;
      return new Time(hour!, minute!);
    }
    return null;
  }
  set value(t: Time | null) {
    const {hour, minute} = t || new Time('', '');
    this.parts.setValue({hour, minute});
    this.stateChanges.next();
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    private injector: Injector,
    @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  get empty() {
    const {
      value: {hour, minute},
    } = this.parts;

    return !hour && !minute;
  }

  get errorState(): boolean {
    this.ngControl.control?.updateValueAndValidity();
    return coerceBooleanProperty(this.parts.invalid
      && (this.ngControl.touched || (this.formGroup as FormGroupDirective).submitted));
  }

  get shouldLabelFloat() { return this.focused || !this.empty; }

  onFocusIn() {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (!control.errors && nextElement) {
      this._focusMonitor.focusVia(nextElement, 'program');
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this._focusMonitor.focusVia(prevElement, 'program');
    }
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement.querySelector(
      '.time-input-container',
    )!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick() {
    if (this.parts.controls.minute.valid) {
      this._focusMonitor.focusVia(this.minuteInput, 'program');
    } else if (this.parts.controls.hour.valid) {
      this._focusMonitor.focusVia(this.minuteInput, 'program');
    } else {
      this._focusMonitor.focusVia(this.hourInput, 'program');
    }
  }

  writeValue(t: Time | null): void {
    this.value = t;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _handleHourInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    let val = control.value;
    if (val && +val < 0) {
      val = '00';
    }
    if (val && +val > 23) {
      val = '23';
    }
    control.setValue(val)
    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }

  _handleMinuteInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    let val = control.value;
    if (val && +val < 0) {
      val = '00';
    }
    if (val && +val > 59) {
      val = '59';
    }
    control.setValue(val)
    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }

  onInputFocusOut(target: EventTarget | null, control: AbstractControl) {
    if (target instanceof HTMLInputElement) {
      if (target.value.length === 1) {
        target.value = '0' + target.value;
        control.setValue(target.value)
      }
    }
  }
}

export class Time {
  constructor(public hour: string, public minute: string) {
  }
}
