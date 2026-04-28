import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuiensoyPage } from './quiensoy';

describe('Quiensoy', () => {
  let component: QuiensoyPage;
  let fixture: ComponentFixture<QuiensoyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuiensoyPage],
    }).compileComponents();

    fixture = TestBed.createComponent(QuiensoyPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
