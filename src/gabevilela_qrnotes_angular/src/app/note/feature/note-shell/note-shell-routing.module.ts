import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoteQrcodePage } from '../note-qrcode/note-qrcode.page';
import { NoteViewPage } from '../note-view/note-view.page';

const routes: Routes = [
  { path: ':id', component: NoteViewPage },
  { path: 'qrcode/:id', component: NoteQrcodePage },
  { path: '**', component: NoteViewPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoteShellRoutingModule {}
