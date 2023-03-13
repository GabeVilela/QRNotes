import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'note',loadChildren: () => import ('./note/feature/note-shell/note-shell.module').then((m) => m.NoteShellModule)},
  {path: '**',redirectTo: '/note'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
