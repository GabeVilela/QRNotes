import { Component,OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesListComponent } from '../../ui/notes-list/notes-list.component';
import { NoteFormComponent } from '../../ui/note-form/note-form.component';
import { NoteDTO } from '../../data-access/note-dto.interface';
import { NoteService } from '../../data-access/note/note.service';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { BehaviorSubject, filter, map, Subscription, switchMap, tap } from 'rxjs';
import { UserPreferencesService } from 'src/app/shared/services/user-preferences/user-preferences.service';

interface Subscriptions{
 [key:string]:Subscription;
}

@Component({
  selector: 'app-note-view',
  standalone: true,
  imports: [CommonModule,
  NotesListComponent,
NoteFormComponent],
  templateUrl: './note-view.page.html',
  styleUrls: ['./note-view.page.scss']
})
export class NoteViewPage implements OnInit, OnDestroy {
  currentNote?:NoteDTO;
  currentNoteId?: number;
  subscriptions:Subscriptions = {}
  allNotes:NoteDTO[] = [];
  notesOnBin:NoteDTO[] = [];
  get isBinExpanded():boolean {
    return this.prefs.isBinPanelExpanded;
  }

  constructor(private service:NoteService,private route:ActivatedRoute,private router:Router,private prefs:UserPreferencesService){}

  ngOnInit(){
    this.subscriptions['routeParams'] = this.route.params.subscribe((params:Params) => {
      this.currentNoteId = undefined;
      const noteId = params['id'];

      if (noteId === null || noteId === undefined) return;

      try {
        this.currentNoteId = Number(noteId);
      } catch (error) {
        console.log('Invalid note id!');
      }

      this.fetchNote();
    });

    this.subscriptions['allNotes'] = this.service.allNotes$.subscribe((val) => {
      this.allNotes = val.filter(n => !n.onBin);
      this.notesOnBin = val.filter(n => n.onBin);
    });
  }

  ngOnDestroy(){
    for (const key in this.subscriptions) {
      this.subscriptions[key].unsubscribe();
    }
  }

  private fetchNote():void{
    /*this.currentNote = this.service.notes[0];
    this.currentNoteId = this.currentNote.id;*/
    if (this.currentNoteId !== undefined){
      this.currentNote = this.service.get(this.currentNoteId);
      if (this.currentNote === undefined) this.closeNote();
    }
  }

  saveUpdate(event:Partial<NoteDTO>):void{
    if (this.currentNote === undefined) return;

    this.service.update(this.currentNote.id, event);
  }

  createNote():void{
    let now = new Date();
    let newNote:NoteDTO = {
      id: now.getTime(),
      title: `New note - ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
      content: '',
      needsExport: true,
      onBin: false
    };
    this.router.navigate(['note',this.service.add(newNote)]);
  }

  moveNoteToBin(id:number){
    this.service.update(id,{onBin: true});
    this.closeNote();
  }

  closeNote():void{
    this.currentNoteId = undefined;
    this.router.navigate(['note']);
  }

  toggleBin():void{
    this.prefs.isBinPanelExpanded = !this.prefs.isBinPanelExpanded;
  }

  deleteNote():void{
    if (this.currentNote === undefined) return;
    this.service.delete(this.currentNote.id);
    this.closeNote();
  }

  restoreNote(id:number):void{
    this.service.update(id,{onBin:false});
  }
}
