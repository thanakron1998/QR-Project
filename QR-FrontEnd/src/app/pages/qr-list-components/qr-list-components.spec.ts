import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrListComponents } from './qr-list-components';

describe('QrListComponents', () => {
  let component: QrListComponents;
  let fixture: ComponentFixture<QrListComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrListComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrListComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
