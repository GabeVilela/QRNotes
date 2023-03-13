import { Component,OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesListComponent } from '../../ui/notes-list/notes-list.component';
import { NoteFormComponent } from '../../ui/note-form/note-form.component';
import { NoteDTO } from '../../data-access/note-dto.interface';
import { NoteService } from '../../data-access/note/note.service';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { map, Subscription, switchMap, tap } from 'rxjs';

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
  routeParamsSubscription?: Subscription;

  constructor(private service:NoteService,private route:ActivatedRoute){}

  ngOnInit(){
    this.routeParamsSubscription = this.route.params.subscribe((params:Params) => {
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
  }

  ngOnDestroy(){
    if (this.routeParamsSubscription !== undefined){
      this.routeParamsSubscription.unsubscribe();
    }
  }

  private fetchNote():void{
    /*this.currentNote = this.service.notes[0];
    this.currentNoteId = this.currentNote.id;*/
    if (this.currentNoteId !== undefined){
      this.currentNote = this.service.get(this.currentNoteId);
    }
  }

  saveUpdate(event:Partial<NoteDTO>):void{
    if (this.currentNote === undefined) return;

    this.service.update(this.currentNote.id, event);
  }
}
