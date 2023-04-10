import {dateTexts} from "assets/app-texts-pl/dateTexts";
import {Inject, Injectable, Optional} from '@angular/core';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateAdapterOptions,
  MomentDateAdapter
} from '@angular/material-moment-adapter';

@Injectable()
export class CustomDateAdapter extends MomentDateAdapter {
  constructor(
    @Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string,
    @Optional() @Inject(MAT_MOMENT_DATE_ADAPTER_OPTIONS)
    private options?: MatMomentDateAdapterOptions
  ) {
    super(dateLocale, options);
    this.setLocale(dateLocale);
  }

  override getFirstDayOfWeek(): number {
    return 1;
  }

  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
    return dateTexts.dayOfWeekNamesShort;
  }
}
