import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadTransferComponent } from './download-transfer.component';

describe('DownloadTransferComponent', () => {
  let component: DownloadTransferComponent;
  let fixture: ComponentFixture<DownloadTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
