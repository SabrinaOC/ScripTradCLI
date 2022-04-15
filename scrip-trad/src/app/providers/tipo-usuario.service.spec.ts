import { TestBed } from '@angular/core/testing';

import { TipoUsuarioService } from './tipo-usuario.service';

describe('TipoUsuarioService', () => {
  let service: TipoUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
