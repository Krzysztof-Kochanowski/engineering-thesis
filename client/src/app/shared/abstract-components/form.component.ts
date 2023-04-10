import {Directive, EventEmitter, OnInit, Output} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {Observable} from "rxjs";

@Directive()
export abstract class FormComponent implements OnInit {
  @Output() bySubmit: EventEmitter<void> = new EventEmitter();
  form!: FormGroup;

  abstract ngOnInit(): void;
  abstract onSubmit(): void;
  abstract openDialog(): Observable<any>;

  get f() { return this.form.controls; }
}
