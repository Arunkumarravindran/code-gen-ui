import { Pipe, PipeTransform } from '@angular/core';
import { stringify } from 'querystring';

@Pipe({
  name: 'dependencySearch'
})
export class DependencySearchPipe implements PipeTransform {
  names : string[];
  descriptions : string[];
  transform(items: any[], searchText: string): any[] {

    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
console.log('serchtext',searchText)

    return items.filter(it => {
      console.log('items',it.name)
      return (it.name.search(new RegExp(searchText, "i")) != -1)
  
    });
  }
}