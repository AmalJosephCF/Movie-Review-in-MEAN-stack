import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPass } from './forget-pass';

describe('ForgetPass', () => {
  let component: ForgetPass;
  let fixture: ComponentFixture<ForgetPass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgetPass]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgetPass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
