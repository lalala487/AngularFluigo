import { TestBed, inject } from '@angular/core/testing';

import { StepValidatorService } from './step-validator.service';

describe('StepValidatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StepValidatorService]
    });
  });

  it('should be created', inject([StepValidatorService], (service: StepValidatorService) => {
    expect(service).toBeTruthy();
  }));
});
