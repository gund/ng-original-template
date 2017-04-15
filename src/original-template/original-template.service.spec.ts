/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OriginalTemplateService } from './original-template.service';

describe('Service: OriginalTemplate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OriginalTemplateService]
    });
  });

  it('should ...', inject([OriginalTemplateService], (service: OriginalTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
