import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  OnDestroy,
  OnChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { getDefaultNote, NoteDTO } from '../../data-access/note-dto.interface';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Matches both bullet lists "- " and numbered lists "1. "
const listItemRegex = new RegExp(/^(\t{0,}(-|\d{1,}\.)\s)/);

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.scss'],
})
export class NoteFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input('note') note: NoteDTO = getDefaultNote();

  private onNoteChangeEmitter = new EventEmitter<Partial<NoteDTO>>();
  @Output('onNoteChange') onNoteChange$ =
    this.onNoteChangeEmitter.asObservable();

  private onDeleteClickEmitter = new EventEmitter();
  @Output('onDeleteClick') onDeleteClick$ = this.onDeleteClickEmitter.asObservable();

  charCount: number = 0;
  wordCount: number = 0;
  titleField = new FormControl<string>('');
  contentField = new FormControl<string>('');
  titleChangesSubscription?: Subscription;
  contentChangesSubscription?: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    if (this.titleChangesSubscription !== undefined) {
      this.titleChangesSubscription.unsubscribe();
    }

    if (this.contentChangesSubscription !== undefined) {
      this.contentChangesSubscription.unsubscribe();
    }
  }

  ngOnChanges():void{
    this.titleField.setValue(this.note.title,{emitEvent: false});
    this.contentField.setValue(this.note.content,{emitEvent: false});
    if (this.note.onBin){
      this.titleField.disable({emitEvent: false});
      this.contentField.disable({emitEvent: false});
    }else{
      this.titleField.enable({emitEvent: false});
      this.contentField.enable({emitEvent: false});
    }
    this.updateCounters();
  }

  initializeForm(): void {
    this.titleField?.setValue(this.note.title);
    this.contentField?.setValue(this.note.content);

    if (this.titleChangesSubscription === undefined) {
      this.titleChangesSubscription = this.titleField.valueChanges.subscribe(
        () => {
          this.produceOutput(this.titleField.value, 'title');
        }
      );
    }

    if (this.contentChangesSubscription === undefined) {
      this.contentChangesSubscription =
        this.contentField.valueChanges.subscribe(() => {
          this.produceOutput(this.contentField.value, 'content');
        });
    }

    this.updateCounters();
  }

  produceOutput(
    newValue: any,
    field: 'title' | 'content' | 'needsExport'
  ): void {
    if (newValue === null || newValue === undefined) return;

    let changeCommit: Partial<NoteDTO> = {};

    switch (field) {
      case 'content':
        changeCommit['content'] = newValue;
        break;

      case 'title':
        changeCommit['title'] = newValue;
        break;

      case 'needsExport':
        changeCommit['needsExport'] = newValue;
        break;

      default:
        break;
    }

    this.onNoteChangeEmitter.emit(changeCommit);
  }

  updateCounters(): void {
    const value = this.contentField.value;

    if (value == null) {
      this.charCount = 0;
      this.wordCount = 0;
      return;
    }

    this.charCount = value.length;
    this.wordCount = this.countWords(value);
  }

  countWords(text: string): number {
    const regex = new RegExp(/(\s|\\|\/|\||\.|,|\<|\>|\?|!|{|}|\[|\]|\(|\))/);
    let currentWordLength = 0;
    let result = 0;

    for (const char of text) {
      if (regex.test(char)) {
        if (currentWordLength > 1) {
          result++;
        }
        currentWordLength = 0;
        continue;
      }

      currentWordLength++;
    }

    if (currentWordLength > 1) {
      result++;
    }

    return result;
  }

  redirectToQR(): void {
    this.router.navigate(['note', 'qrcode', `${this.note.id}`]);
  }

  inputHandler(event: any): void{
    switch (event.key) {
      case 'Tab':
        event.preventDefault();

        if (event.shiftKey){
          this.removeTab(event.target);
          break;
        }

        if (this.isCaretOnBulletOrNumberedListItem(event.target)){
          this.insertTextOnRowStartCaret(event.target, '\t');
          break;
        }

        this.insertTextOnCaret(event.target, '\t');
        break;
    
      default:
        break;
    }
  }

  private insertTextOnCaret(field: any, text: string): void{
    const start = field.selectionStart;
    const end = field.selectionEnd;

    field.value = `${field.value.substring(0, start)}${text}${field.value.substring(end)}`;
    field.selectionStart = field.selectionEnd = start + 1;
  }

  private insertTextOnRowStartCaret(field: any, text: string): void{
    const start = field.selectionStart;
    const textBefore = field.value.substring(0,start);
    let indexRowStartLineBreak = textBefore.lastIndexOf('\n');
    const textAfter = this.getTextAfter(indexRowStartLineBreak,field.value);
    const rowsBefore = this.getTextBefore(indexRowStartLineBreak + 1, field.value);

    field.value = `${rowsBefore}${text}${textAfter}`;
    field.selectionStart = field.selectionEnd = start + 1;
  }

  private isCaretOnBulletOrNumberedListItem(field:any):boolean{
    const currentRow = this.getTextOnCaretRow(field);
    return listItemRegex.test(currentRow);
  }

  private removeTab(field:any):void{
    const start = field.selectionStart;
    const value:string = field.value;
    
    const breakRowIndex = value.substring(0,start).lastIndexOf('\n');
    const rowsBefore = value.substring(0,breakRowIndex);
    const rowStart = value.substring(breakRowIndex,start);

    const tabIndex = rowStart.lastIndexOf('\t');
    if (tabIndex < 0) return;

    let result = rowsBefore;

    if (tabIndex === 0){
      result += rowStart.substring(1);
    }else{
      result += rowStart.substring(0,tabIndex);
      result += rowStart.substring(tabIndex + 1);
    }

    result += value.substring(start);

    field.value = result;
    field.selectionStart = field.selectionEnd = start - 1;
  }

  private getTextOnCaretRow(field:any):string{
    const start = field.selectionStart;
    const end = field.selectionEnd;

    let textBefore:string = field.value.substring(0,start);
    let textAfter:string = field.value.substring(end);

    textBefore = this.getTextAfterRightmostValue(textBefore,'\n');
    textAfter = this.getTextBeforeLeftmostValue(textAfter,'\n');

    return `${textBefore}${textAfter}`;
  }

  private getTextBeforeRightmostValue(fullText:string, value:string):string{
    const index = fullText.lastIndexOf(value);
    return this.getTextBefore(index,fullText);
  }

  private getTextAfterRightmostValue(fullText:string,value:string):string{
    const index = fullText.lastIndexOf(value);
    return this.getTextAfter(index,fullText);
  }

  private getTextBeforeLeftmostValue(fullText:string, value:string):string{
    const index = fullText.indexOf(value);
    return this.getTextBefore(index, fullText);
  }

  private getTextAfterLeftmostValue(fullText:string, value:string):string{
    const index = fullText.indexOf(value);
    return this.getTextAfter(index,fullText);
  }

  private getTextBefore(index:number,fullText:string):string{
    if (index === 0) return "";
    return fullText.substring(0,index);
  }

  private getTextAfter(index:number,fullText:string):string{
    if (index + 1 >= fullText.length) return "";
    return fullText.substring(index + 1);
  }

  onDeleteClick():void{
    this.onDeleteClickEmitter.emit();
  }
}
