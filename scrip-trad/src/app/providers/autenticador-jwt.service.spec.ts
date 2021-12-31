import { TestBed } from '@angular/core/testing';

import { AutenticadorJwtService } from './autenticador-jwt.service';

describe('AutenticadorJwtService', () => {
  let service: AutenticadorJwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutenticadorJwtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
