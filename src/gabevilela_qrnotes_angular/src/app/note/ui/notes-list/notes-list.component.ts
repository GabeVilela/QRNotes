import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NoteDTO } from '../../data-access/note-dto.interface';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent {
  @Input() currentNoteId?:number;
  @Input() allNotes?:NoteDTO[];

  private onNoteCreateClickEmitter = new EventEmitter<string>();
  @Output('onNoteCreateClick') onNoteCreateClick$ = this.onNoteCreateClickEmitter.asObservable(); 


  constructor(private router:Router){}
  
  openNote(noteId:number):void{
    this.router.navigate(['note',noteId]);
  }

  createNote():void{
    this.onNoteCreateClickEmitter.emit();
  }
}
