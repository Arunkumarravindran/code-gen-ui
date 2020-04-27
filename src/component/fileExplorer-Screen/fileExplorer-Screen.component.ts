import { Component, OnInit, Inject, AfterViewChecked, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { ParentTree } from 'src/_model/parentTree';
import { CodegenService } from 'src/_service/codegen.service';
import { of as observableOf } from 'rxjs';
import { HighlightService } from 'src/_service/highlight.service';
export interface FlatTreeNode {
  fileName: string;
  type: string;
  path: string;
  hidden: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'app-fileExplorer-Screen',
  templateUrl: './fileExplorer-Screen.component.html',
  styleUrls: ['./fileExplorer-Screen.component.css']
})
export class FileExplorerScreenComponent implements OnInit {

  selectedContent :any;
 


  

  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<ParentTree, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<ParentTree, FlatTreeNode>;

  constructor(private data : CodegenService, private router: Router)  {
    
  }
  
  ngOnInit() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);

    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.data.getDemoResponse().subscribe(data=>{
      this.selectedContent = data.selected.content
      console.log("data",data.tree)
     let parent : ParentTree[] = [];
      parent.push(data.tree)
      this.dataSource.data = parent;
    })
   
  }

  /** Transform the data to something the tree can read. */
  transformer(node: ParentTree, level: number) {
    return {
      fileName: node.filename,
      path: node.path,
      hidden: node.hidden,
      type: node.type,
      level: level,
      expandable: !!node.children && node.children.length > 0
    };
  }

  /** Get the level of the node */
  getLevel(node: FlatTreeNode) {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  isExpandable(node: FlatTreeNode) {
    return node.expandable;
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: FlatTreeNode) {
    return node.expandable;
  }

  /** Get the children for the node. */
  getChildren(node: ParentTree) {
    return observableOf(node.children);
  }


  redirectHome(){
    this.router.navigate(['/homeScreen'])
  }
}
