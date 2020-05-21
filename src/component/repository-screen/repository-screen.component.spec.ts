import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryScreenComponent } from './repository-screen.component';

describe('RepositoryScreenComponent', () => {
  let component: RepositoryScreenComponent;
  let fixture: ComponentFixture<RepositoryScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepositoryScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
