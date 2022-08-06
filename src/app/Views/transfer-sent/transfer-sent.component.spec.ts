import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferSentComponent } from './transfer-sent.component';

describe('TransferSentComponent', () => {
  let component: TransferSentComponent;
  let fixture: ComponentFixture<TransferSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferSentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
