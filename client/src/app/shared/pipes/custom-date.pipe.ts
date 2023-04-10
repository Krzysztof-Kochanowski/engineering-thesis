import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from "@angular/common";

@Pipe({
  name: 'customDatePipe'
})
export class CustomDatePipe extends DatePipe implements PipeTransform {
  override transform(value: any, args?: any): any {
      return super.transform(value, 'EEEE, MMMM d, y, h:mm:ss a zzzz');
  }
}
