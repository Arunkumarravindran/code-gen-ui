/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AnimationService } from './animation.service';

describe('Service: Animation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnimationService]
    });
  });

  it('should ...', inject([AnimationService], (service: AnimationService) => {
    expect(service).toBeTruthy();
  }));
});
