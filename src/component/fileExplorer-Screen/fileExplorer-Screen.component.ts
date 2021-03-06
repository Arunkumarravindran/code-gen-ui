import { Component, OnInit, Inject, AfterViewChecked, ElementRef, AfterViewInit, Optional, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource, MatDialogRef, MAT_DIALOG_DATA, TooltipPosition } from '@angular/material';
import { ParentTree } from 'src/_model/parentTree';
import { CodegenService } from 'src/_service/codegen.service';
import { of as observableOf } from 'rxjs';
import { MainTree } from 'src/_model/mainTree';
import { ChangeDetectorRef } from '@angular/core';
import * as fileSaver from 'file-saver';
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
export class FileExplorerScreenComponent implements OnInit, AfterViewInit {

  exploreResult: string;
  selectedContent: any;
  selectedLang: string = "xml";
  fileName: string;
  selectedFileName: string;
  folderExpand = false;
  folderCollapse = true;
  toolPosition: TooltipPosition = 'left';
  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<ParentTree, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<ParentTree, FlatTreeNode>;

  constructor(private codeGenService: CodegenService,
    private changeRef: ChangeDetectorRef, private router: Router,
    public dialogRef: MatDialogRef<FileExplorerScreenComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  @ViewChild('tree', null) tree;

  ngAfterViewInit() {
    this.tree.treeControl.expandAll();
    let data: MainTree = JSON.parse(this.exploreResult);
    this.selectedContent = data.selected.content;
    this.selectedLang = data.selected.language;
    this.fileName = data.tree.filename;
    this.selectedFileName = data.selected.filename;
    console.log("selected Language", this.selectedLang);
    this.changeRef.detectChanges();

  }

  ngOnInit() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);

    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    let data: MainTree = JSON.parse(this.exploreResult);
    let parent: ParentTree[] = [];
    parent.push(data.tree)
    this.dataSource.data = parent;

  }

  /** Transform the data to something the tree can read. */
  transformer(node: ParentTree, level: number) {
    return {
      fileName: node.filename,
      path: node.path,
      hidden: node.hidden,
      type: node.type,
      language: node.language,
      content: node.content,
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
  downloadFile(data) {
    console.log("dataaaaa=>", data);

    let blob: any = new Blob([data], { type: 'application/' + this.selectedLang });

    fileSaver.saveAs(blob, this.selectedFileName);
  }

  redirectHome() {
    this.router.navigate(['/homeScreen'])
  }
  selectedFile(data) {
    console.log("sected file", data);
    this.selectedContent = data.content
    this.selectedFileName = data.fileName;
    console.log('selected content -> ' + this.selectedContent)
    this.selectedLang = data.language

  }
  changeState(node) {
    node.expanded = !node.expanded;
    console.log(node);
  }
  expandFolder() {
    this.folderExpand = false;
    this.folderCollapse = true;
  }
  collapseFolder() {
    this.folderExpand = true;
    this.folderCollapse = false;
  }
  closeExplore() {
    this.dialogRef.close({ event: 'close', data: "" });
  }
  downloadAfterCls() {
    this.dialogRef.close({ event: 'close', data: "download" })
  }
  copyInputMessage(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }
}
