/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DataBaseComponent } from './dataBase.component';

describe('DataBaseComponent', () => {
  let component: DataBaseComponent;
  let fixture: ComponentFixture<DataBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
