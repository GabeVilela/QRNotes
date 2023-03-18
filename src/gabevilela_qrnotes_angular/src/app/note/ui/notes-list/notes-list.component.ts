import { Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NoteDTO } from '../../data-access/note-dto.interface';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoteListItemComponent } from '../note-list-item/note-list-item.component';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule,NoteListItemComponent],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent {
  @Input() currentNoteId?:number;
  @Input() allNotes:NoteDTO[] = [];
  @Input() notesOnBin:NoteDTO[] = [];
  @Input() isBinExpanded:boolean = false;

  private onToggleBinEmitter = new EventEmitter();
  @Output('onToggleBin') onToggleBin$ = this.onToggleBinEmitter.asObservable();

  private onNoteCreateClickEmitter = new EventEmitter<string>();
  @Output('onNoteCreateClick') onNoteCreateClick$ = this.onNoteCreateClickEmitter.asObservable(); 

  private onNoteMoveToBinEmitter = new EventEmitter<number>();
  @Output('onNoteMoveToBin') onNoteMoveToBin$ = this.onNoteMoveToBinEmitter.asObservable();

  private onRestoreEmitter = new EventEmitter<number>();
  @Output('onRestore') onRestore$ = this.onRestoreEmitter.asObservable();

  constructor(private router:Router){}
  
  openNote(noteId:number):void{
    this.router.navigate(['note',noteId]);
  }

  createNote():void{
    this.onNoteCreateClickEmitter.emit();
  }

  onNoteMoveToBin(id:number):void{
    this.onNoteMoveToBinEmitter.emit(id);
  }

  onRestore(id:number):void{
    this.onRestoreEmitter.emit(id);
  }

  toggleBin(event:MouseEvent):void{
    this.onToggleBinEmitter.emit();
    event.stopPropagation();
  }
}
