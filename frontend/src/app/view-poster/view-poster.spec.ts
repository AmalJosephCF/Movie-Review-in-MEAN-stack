import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPoster } from './view-poster';

describe('ViewPoster', () => {
  let component: ViewPoster;
  let fixture: ComponentFixture<ViewPoster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPoster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPoster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
