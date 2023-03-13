import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { NoteDTO } from '../../data-access/note-dto.interface';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.scss'],
})
export class NoteFormComponent implements OnInit, OnDestroy {
  @Input('note') noteDTO: NoteDTO = {
    id: -1,
    content: '',
    title: '',
    needsExport: true,
  };

  onNoteChangeEmitter = new EventEmitter<Partial<NoteDTO>>();
  @Output('onNoteChange') onNoteChange$ =
    this.onNoteChangeEmitter.asObservable();

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

  initializeForm(): void {
    this.titleField?.setValue(this.noteDTO.title);
    this.contentField?.setValue(this.noteDTO.content);

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
    this.router.navigate(['note', 'qrcode', `${this.noteDTO.id}`]);
  }
}
