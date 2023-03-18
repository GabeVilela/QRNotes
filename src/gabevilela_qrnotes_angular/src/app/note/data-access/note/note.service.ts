import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NoteDTO } from '../note-dto.interface';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  notes: NoteDTO[] = [];

  private allNotesSubject = new BehaviorSubject<NoteDTO[]>(this.notes);
  allNotes$ = this.allNotesSubject.asObservable();

  private notesOnBinSubject = new BehaviorSubject<NoteDTO[]>(this.notes.filter(n => n.onBin));
  notesOnBin$ = this.notesOnBinSubject.asObservable();

  qrCodeSettings = {
    sizeIndex: 2,
    includeTitle: true,
    useCompatibilityMode: false,
    breakAfter: () => {
      if (this.qrCodeSettings.useCompatibilityMode) return 64;
      return 2000;
    }

  };

  constructor() {}

  get(id:number|null):NoteDTO|undefined{
    if (id === null) return undefined;

    for (const note of this.notes) {
      if (note.id === id){
        return note;
      }
    }

    return undefined;
  }

  update(noteId:number,noteChanges:Partial<NoteDTO>):void{
    let shouldUpdateNeedsExport = true;
    const note = this.notes.find(n => n.id === noteId);
    
    for (const key in noteChanges) {
      if (key === 'id') continue;
      
      if (key === 'needsExport' || key === 'onBin'){
        shouldUpdateNeedsExport = false;
      }

      (note as any)[key] = (noteChanges as any)[key];
    }

    if (note !== undefined && shouldUpdateNeedsExport){
      note.needsExport = true;
    }
    
    this.refreshAllNotes();
  }

  add(note:NoteDTO):number{
    const searchResult = this.notes.find(n => n.id === note.id);
    if (searchResult !== undefined){
      note.id = new Date().getTime();
    }

    this.notes.push(note);
    this.refreshAllNotes();
    return note.id;
  }
  
  private refreshAllNotes():void{
    this.allNotesSubject.next(this.notes);
  }
}
