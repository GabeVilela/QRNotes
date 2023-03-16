import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NoteDTO } from '../note-dto.interface';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  notes: NoteDTO[] = [];

  allNotes$ = new BehaviorSubject<NoteDTO[]>(this.notes);
  qrCodeSettings = {
    sizeIndex: 2,
    includeTitle: true
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
    const note = this.findNote(noteId);
    
    for (const key in noteChanges) {
      if (key === 'id') continue;
      
      if (key === 'needsExport'){
        shouldUpdateNeedsExport = false;
      }
      
      (note as any)[key] = (noteChanges as any)[key];
    }

    if (note !== undefined && shouldUpdateNeedsExport){
      note.needsExport = true;
    }
    
    this.refreshNotesBehaviourSubject();
  }

  add(note:NoteDTO):number{
    if (this.findNote(note.id) !== undefined){
      note.id = new Date().getTime();
    }

    this.notes.push(note);
    this.refreshNotesBehaviourSubject();
    return note.id;
  }

  private findNote(noteId:number):NoteDTO|undefined{
    for (const note of this.notes){
      if (note.id === noteId){
        return note;
      }
    }
    return undefined;
  }

  private refreshNotesBehaviourSubject():void{
    this.allNotes$.next(this.notes);
  }
}
