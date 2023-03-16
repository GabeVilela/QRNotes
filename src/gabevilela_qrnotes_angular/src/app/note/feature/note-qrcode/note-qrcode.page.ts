import { Component, OnDestroy, OnInit, isDevMode} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NoteService } from '../../data-access/note/note.service';
import { NoteDTO } from '../../data-access/note-dto.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import { QRCodeModule } from 'angularx-qrcode';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-note-qrcode',
  standalone: true,
  imports: [CommonModule,QRCodeModule,MatButtonModule,MatIconModule],
  templateUrl: './note-qrcode.page.html',
  styleUrls: ['./note-qrcode.page.scss']
})
export class NoteQrcodePage implements OnInit, OnDestroy{
  currentNote?:NoteDTO;
  currentNoteId?: number;
  routeParamsSubscription?: Subscription;
  qrcodeSizes = [128,512,768,1024];
  currentCode = 0;
  totalCodes = 0;

  private noteContentSubject = new BehaviorSubject<string>(" ");
  noteContent$ = this.noteContentSubject.asObservable();

  get content():string{
    if (this.currentNote === undefined) return "";

    if (this.service.qrCodeSettings.includeTitle)
      return `# ${this.currentNote.title}\n${this.currentNote.content}`;

    return this.currentNote.content;
  }

  get isTitleEnabled():boolean{
    return this.service.qrCodeSettings.includeTitle;
  }

  get isCompatModeEnabled():boolean{
    return this.service.qrCodeSettings.useCompatibilityMode;
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
    if (this.currentNoteId !== undefined){
      this.currentNote = this.service.get(this.currentNoteId);
      
      if (this.currentNote !== undefined){
        this.service.update(this.currentNoteId,{needsExport: false});
        this.updateContent();
        return;
      }

    }
    this.redirectBack();
  }

  private updateContent():void{
    let fullContent = "";
    if (this.currentNote === undefined) return;

    if (this.isTitleEnabled)
      fullContent += `# ${this.currentNote.title}\n`;

    fullContent += this.currentNote.content;

    const qrCodesContent = this.getQRCodesContent(fullContent,this.service.qrCodeSettings.breakAfter());
    let newCodeIndex = this.currentCode;

    if (this.currentCode + 1 >= qrCodesContent.length)
      newCodeIndex = qrCodesContent.length - 1;
    else if (this.currentCode < 0)
      newCodeIndex = 0;

    this.noteContentSubject.next(qrCodesContent[newCodeIndex]);
    this.totalCodes = qrCodesContent.length;

    if (isDevMode()){
      console.groupCollapsed('Update content finished');
      console.log(`Current code: ${this.currentCode}`);
      console.log(`Current content length: ${qrCodesContent[newCodeIndex].length}`);
      console.groupEnd();
    }
  }

  private getQRCodesContent(fullText:string,breakAfter:number):string[]{
    let result = [];
    for (let startIndex = 0; startIndex < fullText.length; startIndex+= breakAfter) {
      result.push(fullText.substring(startIndex,startIndex + breakAfter));
    }
    return result;
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
    this.currentCode = 0;
    this.updateContent();
  }

  toggleCompatMode():void{
    this.service.qrCodeSettings.useCompatibilityMode = !this.service.qrCodeSettings.useCompatibilityMode;
    this.currentCode = 0;
    this.updateContent();
  }

  skipCode(step:number):void{
    this.currentCode += step;
    this.updateContent();
  }
}
