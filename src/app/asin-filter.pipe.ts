import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asinFilter'
})
export class AsinFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    } else {
      args = args.trim();
      args = args.toUpperCase();
    }

    return value.filter(items => {
      return items.asin.indexOf(args) !== -1;
    })
  }

}
