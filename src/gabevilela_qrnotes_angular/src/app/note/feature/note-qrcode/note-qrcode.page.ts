import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NoteService } from '../../data-access/note/note.service';
import { NoteDTO } from '../../data-access/note-dto.interface';
import { Subscription } from 'rxjs';
import { QRCodeModule } from 'angularx-qrcode';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-note-qrcode',
  standalone: true,
  imports: [CommonModule,QRCodeModule,MatButtonModule],
  templateUrl: './note-qrcode.page.html',
  styleUrls: ['./note-qrcode.page.scss']
})
export class NoteQrcodePage implements OnInit, OnDestroy{
  currentNote?:NoteDTO;
  currentNoteId?: number;
  routeParamsSubscription?: Subscription;
  qrcodeSizes = [128,512,768,1024];

  get content():string{
    if (this.currentNote === undefined) return "";

    if (this.service.qrCodeSettings.includeTitle)
      return `# ${this.currentNote.title}\n${this.currentNote.content}`;

    return this.currentNote.content;
  }

  get isTitleEnabled():boolean{
    return this.service.qrCodeSettings.includeTitle;
  }

  get sizeIndex():number{
    return this.service.qrCodeSettings.sizeIndex;
  }

  constructor(private service:NoteService,private route:ActivatedRoute,private router:Router){}

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
    //this.currentNote = this.service.notes[0];
    if (this.currentNoteId !== undefined){
      this.currentNote = this.service.get(this.currentNoteId);
      
      if (this.currentNote !== undefined){
        this.service.update(this.currentNoteId,{needsExport: false});
        return;
      }

    }
    this.redirectBack();
  }

  redirectBack():void{
    let fragments = ['note'];
    if (this.currentNote !== undefined){
      fragments.push(this.currentNote.id.toString());
    }
    
    this.router.navigate(fragments);
  }

  toggleSize():void{
    if (this.sizeIndex + 1 === this.qrcodeSizes.length){
      this.service.qrCodeSettings.sizeIndex = 0;
      return;
    }

    this.service.qrCodeSettings.sizeIndex++;
  }

  toggleTitle():void{
    this.service.qrCodeSettings.includeTitle = !this.service.qrCodeSettings.includeTitle;
  }
}
