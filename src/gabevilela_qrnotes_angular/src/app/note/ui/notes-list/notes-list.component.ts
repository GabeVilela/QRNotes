import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent {

  constructor(private router:Router){}
  
  openNote(noteId:number):void{
    this.router.navigate(['note',noteId]);
  }
}
