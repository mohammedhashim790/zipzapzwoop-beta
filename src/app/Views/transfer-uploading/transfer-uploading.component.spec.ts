import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferUploadingComponent } from './transfer-uploading.component';

describe('TransferUploadingComponent', () => {
  let component: TransferUploadingComponent;
  let fixture: ComponentFixture<TransferUploadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferUploadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferUploadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
