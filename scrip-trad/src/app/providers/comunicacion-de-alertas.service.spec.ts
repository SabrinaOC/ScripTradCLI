import { TestBed } from '@angular/core/testing';

import { ComunicacionDeAlertasService } from './comunicacion-de-alertas.service';

describe('ComunicacionDeAlertasService', () => {
  let service: ComunicacionDeAlertasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComunicacionDeAlertasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
