import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteQrcodePage } from './note-qrcode.page';

describe('NoteQrcodePage', () => {
  let component: NoteQrcodePage;
  let fixture: ComponentFixture<NoteQrcodePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NoteQrcodePage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteQrcodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
