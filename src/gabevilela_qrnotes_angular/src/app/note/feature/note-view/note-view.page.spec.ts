import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteViewPage } from './note-view.page';

describe('NoteViewPage', () => {
  let component: NoteViewPage;
  let fixture: ComponentFixture<NoteViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NoteViewPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
