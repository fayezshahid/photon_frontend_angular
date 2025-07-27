import { TestBed } from '@angular/core/testing';

import { PairsService } from './pair.service'; 

describe('PairService', () => {
  let service: PairsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PairsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
