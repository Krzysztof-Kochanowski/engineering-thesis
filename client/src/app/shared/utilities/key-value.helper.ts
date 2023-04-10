import {KeyValue} from "@angular/common";

export function valuesToString(keyValueArr: Array<KeyValue<string, string>>): string {
  let str: string = '';
  if (!Array.isArray(keyValueArr))
    return str;
  keyValueArr.forEach((keyValuePair: KeyValue<string, string>) => {
    if (isKeyValuePair(keyValuePair))
      str.length == 0 ? str += keyValuePair.value : str += ', ' + keyValuePair.value
  })
  return str;
}


export function isKeyValuePair(object: any): object is KeyValue<string, string> {
  return 'key' in object && 'value' in object;
}
