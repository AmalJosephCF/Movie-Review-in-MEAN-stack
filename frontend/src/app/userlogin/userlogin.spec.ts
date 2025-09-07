import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserloginComponent } from './userlogin.component';

describe('Userlogin', () => {
  let component: UserloginComponent;
  let fixture: ComponentFixture<UserloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserloginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserloginComponent;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
