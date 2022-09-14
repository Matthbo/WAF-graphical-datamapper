import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsplumbComponent } from './jsplumb.component';

describe('JsplumbComponent', () => {
  let component: JsplumbComponent;
  let fixture: ComponentFixture<JsplumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsplumbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsplumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
