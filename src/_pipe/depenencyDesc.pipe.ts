import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'depenencyDesc'
})
export class DepenencyDescPipe implements PipeTransform {

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
      console.log("cZZcC",it.name)
        return (it.name.search(new RegExp(searchText, "i")) != -1 )
    
    });
  }
}