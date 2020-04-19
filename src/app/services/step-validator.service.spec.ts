import { TestBed } from '@angular/core/testing';

import { StepValidatorService } from './step-validator.service';

describe('StepValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StepValidatorService = TestBed.inject(StepValidatorService);
    expect(service).toBeTruthy();
  });
});
