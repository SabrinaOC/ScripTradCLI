import { TestBed } from '@angular/core/testing';

import { SegmentoService } from './segmento.service';

describe('SegmentoService', () => {
  let service: SegmentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SegmentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
