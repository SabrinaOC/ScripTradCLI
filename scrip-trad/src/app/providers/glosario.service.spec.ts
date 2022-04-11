import { TestBed } from '@angular/core/testing';

import { GlosarioService } from './glosario.service';

describe('GlosarioService', () => {
  let service: GlosarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlosarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
