import { TestBed } from '@angular/core/testing';

import { JsplumbService } from './jsplumb.service';

describe('JsplumbService', () => {
  let service: JsplumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsplumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
