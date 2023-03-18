import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getDefaultNote, NoteDTO } from '../../data-access/note-dto.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-note-list-item',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './note-list-item.component.html',
  styleUrls: ['./note-list-item.component.scss']
})
export class NoteListItemComponent {
  @Input() note:NoteDTO = getDefaultNote();
  @Input() isActive = false;

  private onSelectEmitter = new EventEmitter<number>();
  @Output() onSelect = this.onSelectEmitter.asObservable();
  
  private onDeleteClickEmitter = new EventEmitter<number>();
  @Output() onDeleteClick = this.onDeleteClickEmitter.asObservable();

  private onRestoreClickEmitter = new EventEmitter<number>();
  @Output() onRestoreClick = this.onRestoreClickEmitter.asObservable();

  moveToBinClick(event:MouseEvent):void{
    console.log("Clicked!");
    event.stopPropagation();
    this.onDeleteClickEmitter.emit(this.note.id);
  }

  restoreClick():void{
    this.onRestoreClickEmitter.emit(this.note.id);
  }

  onNoteClick():void{
    this.onSelectEmitter.emit(this.note.id);
  }
}
