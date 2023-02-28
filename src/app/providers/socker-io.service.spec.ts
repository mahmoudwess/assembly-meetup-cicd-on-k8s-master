import { TestBed } from '@angular/core/testing';

import { SockerIoService } from './socker-io.service';

describe('SockerIoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SockerIoService = TestBed.get(SockerIoService);
    expect(service).toBeTruthy();
  });
});
