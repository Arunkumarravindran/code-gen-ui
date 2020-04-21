import { Pipe, PipeTransform } from '@angular/core';
import { stringify } from 'querystring';
import { DependenciesValue } from 'src/_model/dependenciesValue';

@Pipe({
  name: 'dependencySearch'
})
export class DependencySearchPipe implements PipeTransform {
 
  depName: any;
  depDescription: any;

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

      return ( it.name.search(new RegExp(searchText, "i")) != -1 ||
      it.description.search(new RegExp(searchText, "i")) != -1 )
    });
  }
}